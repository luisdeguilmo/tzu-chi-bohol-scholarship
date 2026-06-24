<?php
// middleware/Auth.php

namespace Middleware;

require_once __DIR__ . '/../config/jwt.php';

use Config\Jwt;
use Firebase\JWT\JWT as FirebaseJWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Firebase\JWT\BeforeValidException;

class Auth
{
    private static ?object $payload = null;

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
