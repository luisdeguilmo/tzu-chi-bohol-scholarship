<?php
// Ratelimiter.php
namespace App\Services;

use Config\Database;
use PDO;
use PDOException;

/**
 * Sliding-window rate limiter backed by MySQL.
 *
 * Strategy
 * ────────
 * Every login attempt is recorded in `login_attempts`.
 * Before each attempt the row count inside the current window is checked.
 * If the count meets or exceeds the configured maximum the request is
 * rejected with a 429 and a Retry-After header value is returned.
 *
 * The identifier stored in the table is SHA-256(ip + "|" + email) so no
 * raw PII is persisted.
 *
 * Configuration (via constructor or ENV overrides)
 * ────────────────────────────────────────────────
 *   RATE_LIMIT_MAX_ATTEMPTS   – attempts allowed per window  (default  5)
 *   RATE_LIMIT_WINDOW_SECONDS – rolling window in seconds    (default 900 = 15 min)
 *   RATE_LIMIT_LOCKOUT_SECONDS – hard lockout after max hits (default 900 = 15 min)
 */
class RateLimiter
{
    private $pdo;

    private int $maxAttempts;
    private int $windowSeconds;
    private int $lockoutSeconds;

    // ── Constructor ────────────────────────────────────────────────────────

    public function __construct(
        ?PDO $pdo = null,
        int $maxAttempts = 5,
        int $windowSeconds = 900,
        int $lockoutSeconds = 900,
    ) {
        $this->pdo = $pdo ?? (new Database())->getConnection();

        // ENV vars override constructor defaults so operators can tune
        // without touching source code.
        $this->maxAttempts = (int) ($_ENV['RATE_LIMIT_MAX_ATTEMPTS'] ?? $maxAttempts);
        $this->windowSeconds = (int) ($_ENV['RATE_LIMIT_WINDOW_SECONDS'] ?? $windowSeconds);
        $this->lockoutSeconds = (int) ($_ENV['RATE_LIMIT_LOCKOUT_SECONDS'] ?? $lockoutSeconds);
    }

    // ── Public API ─────────────────────────────────────────────────────────

    /**
     * Check whether the caller is currently rate-limited.
     *
     * Returns an array:
     *   ['limited' => false]
     *   ['limited' => true, 'retry_after' => <seconds>, 'message' => '...']
     */
    public function check(string $ip, string $email): array
    {
        $identifier = $this->makeIdentifier($ip, $email);
        $count = $this->countRecentAttempts($identifier);

        if ($count >= $this->maxAttempts) {
            $retryAfter = $this->secondsUntilNextWindow($identifier);

            return [
                'limited' => true,
                'retry_after' => $retryAfter,
                'message' => sprintf(
                    'Too many login attempts. Please try again in %d minute(s).',
                    (int) ceil($retryAfter / 60),
                ),
            ];
        }

        return ['limited' => false];
    }

    /**
     * Record a failed login attempt.
     * Call this only after a genuine authentication failure.
     */
    public function recordFailure(string $ip, string $email): void
    {
        $identifier = $this->makeIdentifier($ip, $email);

        $stmt = $this->pdo->prepare(
            'INSERT INTO login_attempts (identifier, attempted_at)
             VALUES (?, NOW())',
        );

        $stmt->execute([$identifier]);

        $this->pruneOldAttempts($identifier);
    }

    /**
     * Clear all recorded attempts for this identifier on a successful login.
     */
    public function clearOnSuccess(string $ip, string $email): void
    {
        $identifier = $this->makeIdentifier($ip, $email);

        $stmt = $this->pdo->prepare(
            'DELETE FROM login_attempts
             WHERE identifier = ?',
        );

        $stmt->execute([$identifier]);
    }

    // ── Private helpers ────────────────────────────────────────────────────

    /**
     * Build a non-reversible identifier so no raw PII is stored.
     */
    private function makeIdentifier(string $ip, string $email): string
    {
        return hash('sha256', $ip . '|' . mb_strtolower(trim($email)));
    }

    /**
     * Count attempts within the current sliding window.
     */
    private function countRecentAttempts(string $identifier): int
    {
        $stmt = $this->pdo->prepare(
            'SELECT COUNT(*) AS cnt
             FROM login_attempts
             WHERE identifier  = ?
             AND attempted_at >= NOW() - INTERVAL ? SECOND',
        );

        $stmt->execute([$identifier, $this->windowSeconds]);

        return (int) $stmt->fetchColumn();
    }

    /**
     * Return how many seconds until the oldest attempt in the window ages out.
     * Used for the Retry-After header.
     */
    // private function secondsUntilNextWindow(string $identifier): int
    // {
    //     $stmt = $this->pdo->prepare(
    //         'SELECT MIN(attempted_at) AS oldest
    //          FROM login_attempts
    //          WHERE identifier  = ?
    //          AND attempted_at >= NOW() - INTERVAL ? SECOND',
    //     );

    //     $stmt->execute([$identifier, $this->windowSeconds]);

    //     $oldest = $stmt->fetchColumn();

    //     if (!$oldest) {
    //         return $this->lockoutSeconds;
    //     }

    //     $elapsed = time() - strtotime($oldest);

    //     return max(0, $this->lockoutSeconds - $elapsed);
    // }

    private function secondsUntilNextWindow(string $identifier): int
    {
        $stmt = $this->pdo->prepare(
            'SELECT UNIX_TIMESTAMP(MIN(attempted_at)) AS oldest_timestamp
         FROM login_attempts
         WHERE identifier = ?
           AND attempted_at >= DATE_SUB(NOW(), INTERVAL ? SECOND)',
        );
        $stmt->execute([$identifier, $this->windowSeconds]);

        $oldestTimestamp = $stmt->fetchColumn();

        if (!$oldestTimestamp) {
            return $this->lockoutSeconds; // fallback
        }

        $releaseTime = $oldestTimestamp + $this->windowSeconds;
        return max(0, $releaseTime - time());
    }

    /**
     * Delete rows older than the window to keep the table lean.
     * Runs after every recorded failure; the MySQL scheduled event acts
     * as a secondary safety net.
     */
    private function pruneOldAttempts(string $identifier): void
    {
        $stmt = $this->pdo->prepare(
            'DELETE FROM login_attempts
             WHERE identifier  = ?
             AND attempted_at < NOW() - INTERVAL ? SECOND',
        );

        $stmt->execute([$identifier, $this->windowSeconds]);
    }
}
