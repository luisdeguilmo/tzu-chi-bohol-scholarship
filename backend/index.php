<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/app/Controllers/FileController.php';
require_once __DIR__ . '/app/Controllers/ProfileController.php';
require_once __DIR__ . '/app/Services/SupabaseStorageService.php';

$route = $_GET['route'] ?? '';
$id = $_GET['id'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

switch ($route) {
    case 'file/view':
        if (ob_get_length()) {
            ob_end_clean();
        }
        (new FileController())->view();
        exit();

    case 'profile':
        if (ob_get_length()) {
            ob_end_clean();
        }
        (new ProfileController())->view();
        exit();

    default:
        // require_once __DIR__ . '/app/api/response.php';
        http_response_code(405);
        echo json_encode(['message' => 'PHP is working!']);
        break;
}
