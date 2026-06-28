<?php

use App\Controllers\ApplicationController;

$allowedMethods = ['POST', 'OPTIONS'];
$allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With'];

require_once __DIR__ . '/../../config/bootstrap.php';
header('Content-Type: application/json');

require_once __DIR__ . '/../Controllers/ApplicationController.php';

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
