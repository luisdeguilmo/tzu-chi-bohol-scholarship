<?php
// middleware/Auth.php

namespace App\Middleware;

require_once __DIR__ . '/../Config/Jwt.php';

use App\Config\Jwt;
use Firebase\JWT\JWT as FirebaseJWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Firebase\JWT\BeforeValidException;
use PDO;
use UnexpectedValueException;
use Config\Database;

class Auth
{
    private static ?object $payload = null;

    private const INACTIVITY_TIMEOUT_SECONDS = 1800; // 30 minutes

    public static function authenticate(): array
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (!preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            self::reject('Missing or malformed Authorization header.', 401);
        }

        try {
            $decoded = FirebaseJWT::decode($matches[1], new Key(Jwt::secret(), 'HS256'));
        } catch (ExpiredException $e) {
            self::reject('Session expired. Please log in again.', 401);
        } catch (SignatureInvalidException | UnexpectedValueException $e) {
            self::reject('Invalid token.', 401);
        }

        $jti = $decoded->jti ?? null;

        if (!$jti) {
            self::reject('Invalid token.', 401);
        }

        $pdo = (new Database())->getConnection();

        $stmt = $pdo->prepare('SELECT last_activity FROM user_sessions WHERE jti = ? LIMIT 1');
        $stmt->execute([$jti]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$session) {
            // Logged out elsewhere, or never recorded — treat as invalid
            self::reject('Session not found. Please log in again.', 401);
        }

        $idleSeconds = time() - strtotime($session['last_activity']);

        if ($idleSeconds > self::INACTIVITY_TIMEOUT_SECONDS) {
            $del = $pdo->prepare('DELETE FROM user_sessions WHERE jti = ?');
            $del->execute([$jti]);

            self::reject('You have been logged out due to inactivity.', 401);
        }

        // Sliding window — any authenticated request resets the idle clock
        $update = $pdo->prepare('UPDATE user_sessions SET last_activity = NOW() WHERE jti = ?');
        $update->execute([$jti]);

        return (array) $decoded;
    }

    private static function reject(string $message, int $status): never
    {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => $message]);
        exit();
    }

    /**
     * Validate the Bearer token and load the current user into Auth::$payload.
     * Call this at the top of any protected endpoint.
     *
     * @param array $roles  Allowed roles, e.g. ['scholar'] or ['staff', 'admin'].
     *                      Empty array means any authenticated user is allowed.
     */
    public static function require(array $roles = []): void
    {
        $token = self::extractBearerToken();

        if (!$token) {
            self::abort(401, 'Unauthenticated. No token provided.');
        }

        try {
            $decoded = FirebaseJWT::decode($token, new Key(Jwt::secret(), 'HS256'));
            self::$payload = $decoded;
        } catch (ExpiredException) {
            self::abort(401, 'Token expired. Please log in again.');
        } catch (SignatureInvalidException) {
            self::abort(401, 'Invalid token signature.');
        } catch (BeforeValidException) {
            self::abort(401, 'Token not yet valid.');
        } catch (\Exception $e) {
            self::abort(401, 'Invalid token.');
        }

        // Validate required payload fields exist
        if (empty(self::$payload->user_id) || empty(self::$payload->type)) {
            self::abort(401, 'Malformed token payload.');
        }

        // Role check
        if (!empty($roles) && !in_array(self::$payload->type, $roles, true)) {
            self::abort(403, 'Forbidden. Insufficient permissions.');
        }
    }

    /**
     * Returns the authenticated user's account_id.
     * Equivalent to Laravel's Auth::id().
     * Never trust user_id from request body â€” always use this.
     */
    public static function id(): int|string
    {
        return Jwt::id();
    }

    /**
     * Returns the authenticated user's role/type.
     * e.g. 'scholar', 'staff', 'admin'
     */
    public static function type(): string
    {
        if (!self::$payload) {
            self::abort(401, 'Unauthenticated.');
        }
        return self::$payload->type;
    }

    /**
     * Returns the full decoded JWT payload as a stdClass object.
     */
    public static function user(): object
    {
        if (!self::$payload) {
            self::abort(401, 'Unauthenticated.');
        }
        return self::$payload;
    }

    /**
     * Check if the current user has a specific role.
     */
    public static function is(string $role): bool
    {
        return self::$payload?->type === $role;
    }

    /**
     * Check if the current user's ID matches a given ID.
     * Use this to prevent users from accessing other users' resources.
     */
    public static function owns(int|string $resourceOwnerId): bool
    {
        return (string) self::id() === (string) $resourceOwnerId;
    }
    
    private static function extractBearerToken(): ?string
    {
        // Standard Authorization header
        $header =
            $_SERVER['HTTP_AUTHORIZATION'] ??
            ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ??
                (apache_request_headers()['Authorization'] ?? ''));

        if (preg_match('/Bearer\s+(.+)/i', $header, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }

    private static function abort(int $status, string $message): never
    {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => $message]);
        exit();
    }
}
