<?php
// config/jwt.php
namespace Config;

use Firebase\JWT\JWT as FirebaseJWT;
use Firebase\JWT\Key;

class Jwt
{
    private static bool $envLoaded = false;
    private static mixed $payload = null;

    private static function loadEnv(): void
    {
        if (self::$envLoaded) {
            return;
        }

        try {
            $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
            $dotenv->safeLoad();
            self::$envLoaded = true;
        } catch (\Exception $e) {
            error_log('Could not load .env file: ' . $e->getMessage());
        }
    }

    public static function secret(): string
    {
        self::loadEnv();

        $secret = $_ENV['JWT_SECRET'] ?? getenv('JWT_SECRET');
        if (!$secret || strlen($secret) < 32) {
            error_log('CRITICAL: JWT_SECRET is missing or too short.');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Server configuration error.']);
            exit();
        }
        return $secret;
    }

    public static function validate(): void
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? ($headers['authorization'] ?? null);

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            self::abort(401, 'No token provided.');
        }

        $token = trim(substr($authHeader, 7));

        try {
            self::$payload = FirebaseJWT::decode($token, new Key(self::secret(), 'HS256'));
        } catch (\Exception $e) {
            self::abort(401, 'Invalid or expired token.');
        }
    }

    public static function id(): int|string
    {
        if (!self::$payload) {
            self::validate();
        }

        if (!self::$payload) {
            self::abort(401, 'Unauthenticated.');
        }

        return self::$payload->user_id;
    }

    private static function abort(int $code, string $message): void
    {
        http_response_code($code);
        echo json_encode(['success' => false, 'message' => $message]);
        exit();
    }

    public static function expiry(): int
    {
        self::loadEnv();

        return (int) ($_ENV['JWT_EXPIRY'] ?? (getenv('JWT_EXPIRY') ?? 86400));
    }
}
