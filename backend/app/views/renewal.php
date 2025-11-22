<?php

use App\Controllers\RenewalController;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require_once __DIR__ . '/../controllers/RenewalController.php';

$controller = new RenewalController();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // $data = json_decode($_POST['applicationData'], true);

    // $data = [];

    if (isset($_POST['applicationData'])) {
        $data = json_decode($_POST['applicationData'], true);
    } else {
        $data = json_decode(file_get_contents('php://input'), true);
    }

    if ($data['application_info']['application_type'] === 'renew') {
        $controller->createApplication();
        exit();
    } elseif ($data['application_info']['application_type'] === 'resubmit') {
        $controller->updateApplication();
        exit();
    }
}

?>
