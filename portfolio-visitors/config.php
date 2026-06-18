<?php
/**
 * config.php
 * -----------------------------------------------------------------------------
 * Central configuration for the portfolio analytics endpoint.
 *
 * Keep this file OUT of any public Git repository (it holds DB credentials).
 * On shared hosting it lives next to the endpoint, but the bundled .htaccess
 * blocks direct HTTP access to it.
 *
 * PHP 7.4.33 compatible.
 * -----------------------------------------------------------------------------
 */

declare(strict_types=1);

/* -----------------------------------------------------------------------------
 * 1. DATABASE CREDENTIALS
 *    Replace the placeholder values with the credentials from your hosting
 *    control panel (AwardSpace / atwebpages free hosting usually provides a
 *    host such as "fdb1234.awardspace.net").
 * ---------------------------------------------------------------------------- */
const DB_HOST    = 'localhost';          // e.g. 'fdbXXXX.awardspace.net'
const DB_NAME    = 'your_database_name';
const DB_USER    = 'your_database_user';
const DB_PASS    = 'your_database_password';
const DB_CHARSET = 'utf8mb4';

/* -----------------------------------------------------------------------------
 * 2. CORS — which front-end origins are allowed to send analytics.
 *    Add the exact origin(s) your portfolio is served from.
 *    Use ['*'] to allow any origin (fine here because no cookies/credentials
 *    are used — the endpoint is write-only analytics).
 * ---------------------------------------------------------------------------- */
const ALLOWED_ORIGINS = [
    'https://tahmeed-mahbub-rafid.atwebpages.com',
    'http://tahmeed-mahbub-rafid.atwebpages.com',
    'http://localhost',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
];

/* -----------------------------------------------------------------------------
 * 3. BEHAVIOUR FLAGS
 * ---------------------------------------------------------------------------- */
// Show detailed PHP errors in the JSON response. Turn OFF (false) in production.
const DEBUG_MODE = false;

// Optional: look up country/city from the visitor IP using the free ip-api.com
// service. Disabled by default to keep the endpoint fast and dependency-free.
const ENABLE_GEO_LOOKUP = false;
