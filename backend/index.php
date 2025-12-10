<?php

require_once __DIR__ . '/vendor/autoload.php';

$page = $_GET['page'] ?? 'home';

// switch ($page) {
    // case 'activities':
    //     require_once __DIR__ . '/app/views/activities.php';
    //     break;
    // case 'application_files':
    //     require_once __DIR__ . '/app/views/application_files.php';
    //     break;
    // case 'applicants':
    //     require_once __DIR__ . '/app/views/applicants.php';
    //     break;
    // case 'applications':
    //     require_once __DIR__ . '/app/views/applications.php';
    //     break;
    // case 'coa':
    //     require_once __DIR__ . '/app/views/certificate-of-appearance.php';
    //     break;
    // default:
        require_once __DIR__ . '/app/views/response.php';
// }

echo 'PHP is working!';
?> 


<?php
// Enable error reporting for debugging (disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Simple router example:
$requestUri = $_SERVER['REQUEST_URI'];

if ($requestUri === '/' || $requestUri === '/index.php') {
    echo "Welcome to my PHP backend!";
} elseif ($requestUri === '/api/data') {
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Hello from the API!']);
} else {
    http_response_code(404);
    echo "404 Not Found";
}
?>
