<?php
// Authservice.php
namespace App\Services;

use App\Models\ScholarModel;
use App\Models\SchoolYearModel;
use App\Models\UserAccountModel;
use Config\Database;
use Config\Jwt;
use DateTime;
use Firebase\JWT\JWT as FirebaseJWT;
use PDO;
use PDOException;

class AuthService
{
    private PDO $pdo;
    private RateLimiter $rateLimiter;

    // ── Blocked account statuses ───────────────────────────────────────────

    private const BLOCKED_STATUSES = ['graduated', 'terminated', 'suspended'];

    // ── Constructor ────────────────────────────────────────────────────────

    public function __construct(?RateLimiter $rateLimiter = null)
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->rateLimiter = $rateLimiter ?? new RateLimiter($this->pdo);
    }

    // ── Public API ─────────────────────────────────────────────────────────

    /**
     * Attempt to authenticate a user.
     *
     * Returns a result array:
     *   ['success' => true,  'token' => '...', 'user' => [...]]
     *   ['success' => false, 'message' => '...', 'status' => 4xx|5xx]
     *
     * The caller (login.php) is responsible for sending the HTTP response.
     */
    public function login(string $email, string $password, string $userType): array
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

        try {
            /*
             * Rate-limit check — before touching user credentials
             */
            $rateCheck = $this->rateLimiter->check($ip, $email);

            if ($rateCheck['limited']) {
                $this->logAuth('LOGIN BLOCKED - rate limited', $email, $userType);
                return array_merge(
                    $this->failure($rateCheck['message'], 429),
                    ['retry_after' => $rateCheck['retry_after']],
                );
            }

            $user = $this->fetchUser($email, $userType);

            // Always run password_verify() to reduce timing differences
            $dummyHash = '$2y$10$7wWf3P6J0J9Y7k3h4Yj5Oe9u9uH4x2K5W3g3s9q8f7d6e5c4b3a2';
            $hashToCheck = $user['password'] ?? $dummyHash;
            $passwordOk = password_verify($password, $hashToCheck);

            if (!$user || !$passwordOk) {
                $this->rateLimiter->recordFailure($ip, $email);
                $this->logAuth('LOGIN FAILED - bad credentials', $email, $userType);
                return $this->failure('Invalid credentials.', 401);
            }

            $this->rehashIfNeeded($user, $password);

            $tempCheck = $this->checkTemporaryPassword($user);
            if ($tempCheck !== null) {
                $this->rateLimiter->recordFailure($ip, $email);
                return $tempCheck;
            }

            if (in_array($user['status'], self::BLOCKED_STATUSES, true)) {
                $this->logAuth('LOGIN FAILED - inactive account', $email, $userType);
                return $this->failure('Your account is inactive. Contact the administrator.', 403);
            }

            /*
             * Successful login — clear failure counter
             */
            $this->rateLimiter->clearOnSuccess($ip, $email);

            $name = $this->fetchName($userType, $user['account_id']);
            $jwt = $this->buildJwt($user);

            $this->logAuth('LOGIN SUCCESS', $email, $userType);

            $additionalData = $this->loadAdditionalData($user);

            return [
                'success' => true,
                'token' => $jwt,
                'user' => [
                    'user_id'        => $user['account_id'],
                    'email'          => $user['email'],
                    'type'           => $user['type'],
                    'scholar_type'   => $additionalData['scholar_type'],
                    'account_status' => $user['status'],
                    'first_name'     => $name['first_name'] ?? null,
                    'last_name'      => $name['last_name'] ?? null,
                    'name'           => $name['name'] ?? null,
                    'profile'        => $additionalData['profile'],
                ],
            ];
        } catch (PDOException $e) {
            error_log($e->getMessage());
            $this->logAuth('LOGIN ERROR - DATABASE', $email, $userType);
            return $this->failure('Internal server error.', 500);
        }
    }

    // ── Private helpers ────────────────────────────────────────────────────

    /**
     * Fetch the user row from the database.
     */
    private function fetchUser(string $email, string $userType): array|false
    {
        $stmt = $this->pdo->prepare(
            'SELECT
                account_id,
                email,
                status,
                password,
                type,
                is_temporary,
                temp_password_expires_at
             FROM users
             WHERE email = ?
             AND type = ?
             LIMIT 1',
        );

        $stmt->execute([$email, $userType]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Upgrade the password hash in the database if the cost factor changed.
     */
    private function rehashIfNeeded(array $user, string $plainPassword): void
    {
        if (!password_needs_rehash($user['password'], PASSWORD_DEFAULT)) {
            return;
        }

        $newHash = password_hash($plainPassword, PASSWORD_DEFAULT);

        $stmt = $this->pdo->prepare(
            'UPDATE users
             SET password = ?
             WHERE account_id = ?',
        );

        $stmt->execute([$newHash, $user['account_id']]);
    }

    /**
     * Return a failure result if the temporary password has expired,
     * or null if the account is not under a temporary password restriction.
     */
    private function checkTemporaryPassword(array $user): ?array
    {
        if ((int) $user['is_temporary'] !== 1) {
            return null;
        }

        if (
            empty($user['temp_password_expires_at']) ||
            new DateTime() > new DateTime($user['temp_password_expires_at'])
        ) {
            return $this->failure(
                'This temporary password has expired. Please contact your administrator.',
                401,
            );
        }

        return null;
    }

    /**
     * Fetch the display name for the authenticated user based on their role.
     */
    private function fetchName(string $userType, int $accountId): array
    {
        $queries = [
            'scholar' => 'SELECT first_name, last_name FROM scholars WHERE account_id = ? LIMIT 1',
            'staff'   => 'SELECT first_name, last_name FROM staff   WHERE account_id = ? LIMIT 1',
            'admin'   => 'SELECT name                 FROM admin    WHERE id          = ? LIMIT 1',
        ];

        if (!isset($queries[$userType])) {
            return [];
        }

        $stmt = $this->pdo->prepare($queries[$userType]);
        $stmt->execute([$accountId]);

        return $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
    }

    /**
     * Build and sign a JWT for the authenticated user.
     */
    private function buildJwt(array $user): string
    {
        $now = time();

        $payload = [
            'iss'            => $_ENV['ALLOWED_ORIGIN'] ?? 'app',
            'iat'            => $now,
            'nbf'            => $now,
            'exp'            => $now + Jwt::expiry(),
            'jti'            => bin2hex(random_bytes(16)),
            'user_id'        => $user['account_id'],
            'type'           => $user['type'],
            'account_status' => $user['status'],
        ];

        return FirebaseJWT::encode($payload, Jwt::secret(), 'HS256');
    }

    /**
     * Load profile and scholar-type data after a successful login.
     */
    private function loadAdditionalData(array $user): array
    {
        $accountModel    = new UserAccountModel();
        $scholarModel    = new ScholarModel();
        $schoolYearModel = new SchoolYearModel();

        $schoolYear = $schoolYearModel->getActiveSchoolYear();

        $profile = $accountModel->getAccountProfile(
            $user['type'] === 'scholar' ? 'applications' : 'users',
            $user['account_id'],
            $accountModel,
        );

        $scholarType = $scholarModel->getScholarType($user['account_id'], $schoolYear);

        return [
            'profile'     => $profile,
            'scholar_type' => $scholarType,
        ];
    }

    // ── Logging ────────────────────────────────────────────────────────────

    private function logAuth(string $message, ?string $email = null, ?string $userType = null): void
{
    $ts   = date('Y-m-d H:i:s');
    $ip   = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $line = "[$ts] [IP: $ip]";

    if ($email) {
        $line .= " [Email: $email]";
    }

    if ($userType) {
        $line .= " [Type: $userType]";
    }

    $line .= " $message";

    // Write to the PHP/server error log
    error_log($line);
}

    // ── Result builders ────────────────────────────────────────────────────

    private function failure(string $message, int $status): array
    {
        return [
            'success' => false,
            'message' => $message,
            'status'  => $status,
        ];
    }
}
