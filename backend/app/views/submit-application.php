<?php

use App\Controllers\ApplicationController;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

require_once __DIR__ . '/../controllers/ApplicationController.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$controller = new ApplicationController();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller->createApplication();
    exit();
}

?>
