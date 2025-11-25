<?php

require_once __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Global CORS origin
$allowedOrigin = $_ENV['ALLOWED_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $allowedOrigin");

// Determine allowed headers (set per API file or use default)
if (!isset($allowedHeaders)) {
    $allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With'];
}
header('Access-Control-Allow-Headers: ' . implode(', ', $allowedHeaders));

// Determine allowed methods (set per API file or use default)
if (!isset($allowedMethods)) {
    $allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
}
header('Access-Control-Allow-Methods: ' . implode(', ', $allowedMethods));

// Handle preflight (OPTIONS) requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
