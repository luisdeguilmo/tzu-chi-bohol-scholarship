<?php
// cleanup_sessions.php
//
// Cron script — sweeps the user_sessions table of rows that are no longer
// valid, so the table doesn't grow unbounded with abandoned sessions.
//
// Intended to run via crontab, NOT via a web request. Suggested schedule:
//   * * * * * /usr/bin/php /path/to/cleanup_sessions.php >> /var/log/session_cleanup.log 2>&1
//
// Deletes two categories of rows:
//   1. Heartbeat-stale  — tab was closed / browser killed. Detected by
//      last_heartbeat going quiet for longer than HEARTBEAT_STALE_SECONDS.
//   2. Idle-expired      — session outlived the inactivity window without
//      being caught by Auth::authenticate() on a live request (e.g. the
//      user simply never came back). Detected by last_activity.

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../config/Database.php';

use Config\Database;

// Reject execution over the web — this is a CLI-only maintenance script.
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    echo "Forbidden: this script may only be run from the command line.\n";
    exit(1);
}

const HEARTBEAT_STALE_SECONDS = 90;       // tab presumed closed after this long without a heartbeat
const IDLE_EXPIRE_SECONDS     = 1800;     // must match Auth::INACTIVITY_TIMEOUT_SECONDS

function logLine(string $message): void
{
    $ts = date('Y-m-d H:i:s');
    echo "[$ts] $message\n";
}

try {
    $db  = new Database();
    $pdo = $db->getConnection();

    // ── 1. Heartbeat-stale sessions ─────────────────────────────────────
    // Only applies to rows that have a heartbeat on record at all — a
    // session that has never sent one (e.g. an API/non-browser client)
    // shouldn't be swept by this rule.
    $stmt = $pdo->prepare(
        'DELETE FROM user_sessions
         WHERE last_heartbeat IS NOT NULL
           AND last_heartbeat < (NOW() - INTERVAL :heartbeat_stale SECOND)',
    );
    $stmt->execute(['heartbeat_stale' => HEARTBEAT_STALE_SECONDS]);
    $heartbeatDeleted = $stmt->rowCount();

    logLine("Removed {$heartbeatDeleted} session(s) stale by heartbeat (>"
        . HEARTBEAT_STALE_SECONDS . "s without a ping).");

    // ── 2. Idle-expired sessions ─────────────────────────────────────────
    // Safety net for sessions that outlived the inactivity window without
    // ever making another request (so Auth::authenticate() never got a
    // chance to catch and delete them itself).
    $stmt = $pdo->prepare(
        'DELETE FROM user_sessions
         WHERE last_activity < (NOW() - INTERVAL :idle_expire SECOND)',
    );
    $stmt->execute(['idle_expire' => IDLE_EXPIRE_SECONDS]);
    $idleDeleted = $stmt->rowCount();

    logLine("Removed {$idleDeleted} session(s) expired by inactivity (>"
        . IDLE_EXPIRE_SECONDS . "s since last activity).");

    logLine('Cleanup complete. Total removed: ' . ($heartbeatDeleted + $idleDeleted));

    exit(0);
} catch (\Throwable $e) {
    error_log('[cleanup_sessions.php] ' . $e->getMessage());
    logLine('ERROR: ' . $e->getMessage());
    exit(1);
}