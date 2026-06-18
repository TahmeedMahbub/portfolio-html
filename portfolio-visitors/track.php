<?php
/**
 * track.php  —  Portfolio analytics collection endpoint
 * =============================================================================
 *
 *  HOSTED URL (where your front-end fetch() calls should be sent):
 *
 *      http://tahmeed-mahbub-rafid.atwebpages.com/portfolio-visitors/track.php
 *
 *  All requests are JSON POST. Every payload must include an "action" field and
 *  a "session_id" (a stable id you generate once per visitor in the browser and
 *  keep in localStorage). Server-side we auto-collect IP, browser, OS, device
 *  type, referrer, page URL, user agent and all timestamps.
 *
 *  ── SUPPORTED ACTIONS ──────────────────────────────────────────────────────
 *
 *  1) "visit"  → call once on every page load.
 *     Body:    { "action":"visit", "session_id":"abc", "page_url":"...",
 *                "referrer":"..." }
 *     Returns: { "ok":true, "visitor_id":12, "visit_id":34 }
 *     (Store visit_id in memory; you need it to close the session later.)
 *
 *  2) "section" → time spent looking at a page section.
 *     Body:    { "action":"section", "session_id":"abc",
 *                "section_name":"projects", "duration_seconds":12 }
 *
 *  3) "project" → time spent viewing a specific project.
 *     Body:    { "action":"project", "session_id":"abc",
 *                "project_name":"My App", "duration_seconds":20 }
 *
 *  4) "event"   → any custom interaction (click, download, etc.).
 *     Body:    { "action":"event", "session_id":"abc",
 *                "event_name":"cta_click", "event_value":"hire_me" }
 *
 *  5) "session_end" → call on page unload to finalise the session.
 *     Body:    { "action":"session_end", "session_id":"abc", "visit_id":34,
 *                "total_duration_seconds":95, "max_scroll_percent":80 }
 *
 *  PHP 7.4.33 compatible.
 * =============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/functions.php';

// ---------------------------------------------------------------------------
// 0. CORS + method guard
// ---------------------------------------------------------------------------
handle_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(['ok' => false, 'error' => 'Only POST is allowed.'], 405);
}

try {
    $input = json_input();

    $action     = isset($input['action']) ? (string) $input['action'] : '';
    $sessionId  = clip($input['session_id'] ?? null, 100);

    if ($action === '') {
        respond(['ok' => false, 'error' => 'Missing "action".'], 400);
    }
    if ($sessionId === null) {
        respond(['ok' => false, 'error' => 'Missing "session_id".'], 400);
    }

    // -----------------------------------------------------------------------
    // Auto-collected server-side context (never trusted from the client).
    // -----------------------------------------------------------------------
    $userAgent = clip($_SERVER['HTTP_USER_AGENT'] ?? '', 255) ?? '';
    $ua        = parse_user_agent($userAgent);
    $ip        = client_ip();
    $now       = date('Y-m-d H:i:s');

    // page_url / referrer: prefer client-supplied (the real page), fall back to
    // the HTTP Referer header.
    $pageUrl  = clip($input['page_url'] ?? ($_SERVER['HTTP_REFERER'] ?? null), 255);
    $referrer = clip($input['referrer'] ?? ($_SERVER['HTTP_REFERER'] ?? null), 255);

    $pdo = db();

    switch ($action) {

        // ===================================================================
        // VISIT — upsert visitor + open a new session row
        // ===================================================================
        case 'visit':
            $visitorId = upsert_visitor($pdo, $sessionId, $ip, $ua, $referrer, $now);

            // Open a session (one row per page visit).
            $stmt = $pdo->prepare(
                'INSERT INTO pf_sessions (visitor_id, page_url, started_at)
                 VALUES (:visitor_id, :page_url, :started_at)'
            );
            $stmt->execute([
                ':visitor_id' => $visitorId,
                ':page_url'   => $pageUrl,
                ':started_at' => $now,
            ]);
            $visitId = (int) $pdo->lastInsertId();

            respond(['ok' => true, 'visitor_id' => $visitorId, 'visit_id' => $visitId]);
            break;

        // ===================================================================
        // SECTION VIEW
        // ===================================================================
        case 'section':
            $visitorId   = resolve_visitor_id($pdo, $sessionId);
            $sectionName = clip($input['section_name'] ?? null, 100);
            if ($sectionName === null) {
                respond(['ok' => false, 'error' => 'Missing "section_name".'], 400);
            }

            $stmt = $pdo->prepare(
                'INSERT INTO pf_section_views (visitor_id, section_name, duration_seconds, viewed_at)
                 VALUES (:visitor_id, :section_name, :duration, :viewed_at)'
            );
            $stmt->execute([
                ':visitor_id'   => $visitorId,
                ':section_name' => $sectionName,
                ':duration'     => to_int($input['duration_seconds'] ?? 0),
                ':viewed_at'    => $now,
            ]);

            respond(['ok' => true]);
            break;

        // ===================================================================
        // PROJECT VIEW
        // ===================================================================
        case 'project':
            $visitorId   = resolve_visitor_id($pdo, $sessionId);
            $projectName = clip($input['project_name'] ?? null, 255);
            if ($projectName === null) {
                respond(['ok' => false, 'error' => 'Missing "project_name".'], 400);
            }

            $stmt = $pdo->prepare(
                'INSERT INTO pf_project_views (visitor_id, project_name, duration_seconds, viewed_at)
                 VALUES (:visitor_id, :project_name, :duration, :viewed_at)'
            );
            $stmt->execute([
                ':visitor_id'   => $visitorId,
                ':project_name' => $projectName,
                ':duration'     => to_int($input['duration_seconds'] ?? 0),
                ':viewed_at'    => $now,
            ]);

            respond(['ok' => true]);
            break;

        // ===================================================================
        // CUSTOM EVENT
        // ===================================================================
        case 'event':
            $visitorId  = resolve_visitor_id($pdo, $sessionId);
            $eventName  = clip($input['event_name'] ?? null, 100);
            if ($eventName === null) {
                respond(['ok' => false, 'error' => 'Missing "event_name".'], 400);
            }

            $stmt = $pdo->prepare(
                'INSERT INTO pf_events (visitor_id, event_name, event_value, created_at)
                 VALUES (:visitor_id, :event_name, :event_value, :created_at)'
            );
            $stmt->execute([
                ':visitor_id'  => $visitorId,
                ':event_name'  => $eventName,
                ':event_value' => clip($input['event_value'] ?? null, 255),
                ':created_at'  => $now,
            ]);

            respond(['ok' => true]);
            break;

        // ===================================================================
        // SESSION END — finalise duration / scroll / end time
        // ===================================================================
        case 'session_end':
            $visitId = to_int($input['visit_id'] ?? 0);
            if ($visitId <= 0) {
                respond(['ok' => false, 'error' => 'Missing "visit_id".'], 400);
            }

            // Constrain the update to the visitor that owns this session.
            $visitorId = resolve_visitor_id($pdo, $sessionId);

            $stmt = $pdo->prepare(
                'UPDATE pf_sessions
                    SET total_duration_seconds = :duration,
                        max_scroll_percent     = :scroll,
                        ended_at               = :ended_at
                  WHERE id = :id AND visitor_id = :visitor_id'
            );
            $stmt->execute([
                ':duration'   => to_int($input['total_duration_seconds'] ?? 0),
                ':scroll'     => max(0, min(100, to_int($input['max_scroll_percent'] ?? 0))),
                ':ended_at'   => $now,
                ':id'         => $visitId,
                ':visitor_id' => $visitorId,
            ]);

            respond(['ok' => true]);
            break;

        default:
            respond(['ok' => false, 'error' => 'Unknown action: ' . $action], 400);
    }

} catch (Throwable $e) {
    // Log full detail server-side; expose detail only when DEBUG_MODE is on.
    error_log('[portfolio-analytics] ' . $e->getMessage());
    $payload = ['ok' => false, 'error' => 'Server error.'];
    if (DEBUG_MODE) {
        $payload['detail'] = $e->getMessage();
    }
    respond($payload, 500);
}

/* ===========================================================================
 * Action helpers
 * ======================================================================== */

/**
 * Insert a new visitor or update an existing one (matched by session_id).
 * Increments visit_count and refreshes last_seen on returning visitors.
 *
 * @param array{browser:string,os:string,device_type:string} $ua
 * @return int  visitor id
 */
function upsert_visitor(PDO $pdo, string $sessionId, string $ip, array $ua, ?string $referrer, string $now): int
{
    $stmt = $pdo->prepare('SELECT id FROM pf_visitors WHERE session_id = :sid LIMIT 1');
    $stmt->execute([':sid' => $sessionId]);
    $existingId = $stmt->fetchColumn();

    if ($existingId !== false) {
        $update = $pdo->prepare(
            'UPDATE pf_visitors
                SET visit_count = visit_count + 1,
                    last_seen   = :last_seen,
                    visitor_ip  = :ip
              WHERE id = :id'
        );
        $update->execute([
            ':last_seen' => $now,
            ':ip'        => $ip,
            ':id'        => $existingId,
        ]);
        return (int) $existingId;
    }

    $geo = geo_lookup($ip);

    $insert = $pdo->prepare(
        'INSERT INTO pf_visitors
            (session_id, visitor_ip, visit_count, country, city, device_type,
             browser, os, referrer, first_seen, last_seen)
         VALUES
            (:session_id, :ip, 1, :country, :city, :device_type,
             :browser, :os, :referrer, :first_seen, :last_seen)'
    );
    $insert->execute([
        ':session_id'  => $sessionId,
        ':ip'          => $ip,
        ':country'     => $geo['country'],
        ':city'        => $geo['city'],
        ':device_type' => $ua['device_type'],
        ':browser'     => $ua['browser'],
        ':os'          => $ua['os'],
        ':referrer'    => $referrer,
        ':first_seen'  => $now,
        ':last_seen'   => $now,
    ]);

    return (int) $pdo->lastInsertId();
}

/**
 * Resolve an existing visitor id from a session_id.
 * Creates a minimal visitor row if one does not exist yet (so that section /
 * event calls never fail just because "visit" was missed).
 */
function resolve_visitor_id(PDO $pdo, string $sessionId): int
{
    $stmt = $pdo->prepare('SELECT id FROM pf_visitors WHERE session_id = :sid LIMIT 1');
    $stmt->execute([':sid' => $sessionId]);
    $id = $stmt->fetchColumn();

    if ($id !== false) {
        return (int) $id;
    }

    // Fallback: create a bare visitor using current request context.
    $now = date('Y-m-d H:i:s');
    $ua  = parse_user_agent(clip($_SERVER['HTTP_USER_AGENT'] ?? '', 255) ?? '');
    return upsert_visitor($pdo, $sessionId, client_ip(), $ua, null, $now);
}

/**
 * Coerce any incoming value to a non-negative integer.
 *
 * @param mixed $value
 */
function to_int($value): int
{
    return (int) max(0, (int) $value);
}
