<?php
/**
 * functions.php
 * -----------------------------------------------------------------------------
 * Shared helpers for the analytics endpoint:
 *   - PDO database connection (singleton)
 *   - CORS handling
 *   - JSON request parsing & JSON responses
 *   - Client IP detection
 *   - Lightweight User-Agent parsing (browser / os / device_type)
 *   - Optional IP geolocation
 *
 * PHP 7.4.33 compatible. No external dependencies.
 * -----------------------------------------------------------------------------
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

/**
 * Return a shared PDO connection (created once per request).
 *
 * @return PDO
 */
function db(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    }

    return $pdo;
}

/**
 * Emit CORS headers and short-circuit pre-flight (OPTIONS) requests.
 */
function handle_cors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array('*', ALLOWED_ORIGINS, true)) {
        header('Access-Control-Allow-Origin: *');
    } elseif ($origin !== '' && in_array($origin, ALLOWED_ORIGINS, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');

    // Pre-flight request: respond 204 and stop.
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/**
 * Read and decode the JSON request body.
 *
 * @return array<string,mixed>
 */
function json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }

    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Send a JSON response and terminate the script.
 *
 * @param array<string,mixed> $payload
 */
function respond(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
    exit;
}

/**
 * Best-effort client IP detection (handles common proxy headers).
 */
function client_ip(): string
{
    $candidates = [
        'HTTP_CF_CONNECTING_IP', // Cloudflare
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_REAL_IP',
        'REMOTE_ADDR',
    ];

    foreach ($candidates as $key) {
        if (!empty($_SERVER[$key])) {
            // X-Forwarded-For may contain a comma-separated list; take the first.
            $ip = trim(explode(',', $_SERVER[$key])[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }

    return '0.0.0.0';
}

/**
 * Lightweight User-Agent parser. Good enough for analytics without pulling in
 * a heavy third-party library.
 *
 * @return array{browser:string,os:string,device_type:string}
 */
function parse_user_agent(string $ua): array
{
    $ua = $ua ?: '';

    // --- Operating system ---------------------------------------------------
    $os = 'Unknown';
    $osMap = [
        'Windows NT 10.0' => 'Windows 10/11',
        'Windows NT 6.3'  => 'Windows 8.1',
        'Windows NT 6.2'  => 'Windows 8',
        'Windows NT 6.1'  => 'Windows 7',
        'Windows'         => 'Windows',
        'iPhone'          => 'iOS',
        'iPad'            => 'iPadOS',
        'Macintosh'       => 'macOS',
        'Mac OS X'        => 'macOS',
        'Android'         => 'Android',
        'Linux'           => 'Linux',
        'CrOS'            => 'ChromeOS',
    ];
    foreach ($osMap as $needle => $name) {
        if (stripos($ua, $needle) !== false) {
            $os = $name;
            break;
        }
    }

    // --- Browser ------------------------------------------------------------
    // Order matters: check the more specific tokens first.
    $browser = 'Unknown';
    $browserMap = [
        'Edg'      => 'Edge',
        'OPR'      => 'Opera',
        'Opera'    => 'Opera',
        'SamsungBrowser' => 'Samsung Internet',
        'Firefox'  => 'Firefox',
        'Chrome'   => 'Chrome',
        'Safari'   => 'Safari',
        'MSIE'     => 'Internet Explorer',
        'Trident'  => 'Internet Explorer',
    ];
    foreach ($browserMap as $needle => $name) {
        if (stripos($ua, $needle) !== false) {
            $browser = $name;
            break;
        }
    }

    // --- Device type --------------------------------------------------------
    $device = 'desktop';
    if (preg_match('/iPad|Tablet|PlayBook|(Android(?!.*Mobile))/i', $ua)) {
        $device = 'tablet';
    } elseif (preg_match('/Mobile|iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry|Opera Mini/i', $ua)) {
        $device = 'mobile';
    }

    return [
        'browser'     => $browser,
        'os'          => $os,
        'device_type' => $device,
    ];
}

/**
 * Optional: resolve country/city from an IP using the free ip-api.com service.
 * Controlled by ENABLE_GEO_LOOKUP in config.php. Fails silently.
 *
 * @return array{country:?string,city:?string}
 */
function geo_lookup(string $ip): array
{
    $result = ['country' => null, 'city' => null];

    if (!ENABLE_GEO_LOOKUP || $ip === '0.0.0.0' || !function_exists('curl_init')) {
        return $result;
    }

    $ch = curl_init('http://ip-api.com/json/' . urlencode($ip) . '?fields=status,country,city');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 2,
        CURLOPT_CONNECTTIMEOUT => 2,
    ]);
    $response = curl_exec($ch);
    curl_close($ch);

    if (is_string($response)) {
        $data = json_decode($response, true);
        if (is_array($data) && ($data['status'] ?? '') === 'success') {
            $result['country'] = $data['country'] ?? null;
            $result['city']    = $data['city'] ?? null;
        }
    }

    return $result;
}

/**
 * Safely truncate a string to a maximum DB column length (or return null).
 */
function clip(?string $value, int $max): ?string
{
    if ($value === null) {
        return null;
    }
    $value = trim($value);
    if ($value === '') {
        return null;
    }
    return function_exists('mb_substr') ? mb_substr($value, 0, $max) : substr($value, 0, $max);
}
