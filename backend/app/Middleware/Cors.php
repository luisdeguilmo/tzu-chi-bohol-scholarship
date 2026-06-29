<?php

namespace App\Middleware;

class Cors
{
    public static function handle(): void
    {
        $allowedOrigins = array_filter(
            array_map(
                'trim',
                explode(',', $_ENV['ALLOWED_ORIGIN'] ?? (getenv('ALLOWED_ORIGIN') ?? '')),
            ),
        );

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

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
