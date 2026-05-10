<?php
// middleware/Cors.php
// Call Cors::handle() at the very top of every API entry point.

namespace Middleware;

class Cors
{
    public static function handle(): void
    {
        $allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            $_ENV['ALLOWED_ORIGIN'] ?? getenv('ALLOWED_ORIGIN') ?? '',
        ];

        $origin = $_SERVER['ALLOWED_ORIGIN'] ?? '';

        if (in_array($origin, $allowedOrigins, true)) {
            header("Access-Control-Allow-Origin: $origin");
        }

        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }
}