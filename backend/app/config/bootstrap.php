<?php
// config/bootstrap.php
// Loads .env and sets global error handling.
// Include this first in every entry point.

define('ROOT_PATH', dirname(__DIR__));

// Load .env file
$envFile = ROOT_PATH . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $key   = trim($key);
        $value = trim($value);
        if (!array_key_exists($key, $_ENV)) {
            $_ENV[$key] = $value;
            putenv("$key=$value");
        }
    }
}

// Error visibility based on environment
$env = $_ENV['APP_ENV'] ?? getenv('APP_ENV') ?? 'production';
if ($env === 'development') {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(0);
}

// Always return JSON on fatal errors
set_exception_handler(function (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    $env = $_ENV['APP_ENV'] ?? getenv('APP_ENV') ?? 'production';
    echo json_encode([
        'success' => false,
        'message' => $env === 'development' ? $e->getMessage() : 'An unexpected error occurred.',
    ]);
    exit();
});