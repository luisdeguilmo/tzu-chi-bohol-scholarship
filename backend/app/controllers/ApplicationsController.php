<?php

// Add these lines at the top of your PHP file (applications.php)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

ob_start();
require_once __DIR__ . "/../../vendor/autoload.php"; 

use App\Models\ApplicationsModel;

try {
    $studentId = $_GET['applicationId'] ?? null;

    if (!$studentId) {
        http_response_code(400);
        echo json_encode(["error" => "Missing studentId"]);
        exit;
    }

    $application = new ApplicationsModel();
    $data = $application->getApplicationData($studentId);

    echo json_encode($data);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Something went wrong", "message" => $e->getMessage()]);
}
?>
