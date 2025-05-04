<?php

require_once __DIR__ . '/../controllers/ApplicationController.php';

use App\Controllers\ApplicationController;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Router
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// Example: http://localhost:8000/backend/api/applications
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$controller = new ApplicationController();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller->createApplication();
    exit();
}

// Default if method is not supported
http_response_code(405);
echo json_encode(["message" => "Method not allowed"]);

?>