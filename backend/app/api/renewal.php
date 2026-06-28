<?php

use App\Controllers\RenewalController;

$allowedMethods = ['POST', 'PUT', 'OPTIONS'];
$allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With'];

require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../Controllers/RenewalController.php';

$controller = new RenewalController();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
