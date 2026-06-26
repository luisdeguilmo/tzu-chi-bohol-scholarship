<?php

require_once __DIR__ . '/../controllers/ApplicationController.php';

use App\Controllers\ApplicationController;

$allowedMethods = ['GET', 'OPTIONS'];
$allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With'];

require_once __DIR__ . '/../../config/bootstrap.php';

header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Router
$id = $_GET['id'] ?? null;
$type = $_GET['type'] ?? null;

$controller = new ApplicationController();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($type === '2x2-picture') {
        $controller->getProfilePicture64($id);
        exit();
    }

    if ($type === 'requirements') {
        $controller->getRequirements64($id);
        exit();
    }
}
