<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
date_default_timezone_set('Asia/Manila');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Just exit with 200 OK status
    exit(0);
}

ob_start();
require_once __DIR__ . "/../../vendor/autoload.php"; 

use App\Models\ApplicationsModel;

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$studentId = $data['studentId'] ?? null;
$status = $data['status'] ?? null;
$batch = $data['batch'] ?? null;
$today = date("Y-m-d H:i:s"); 

if (!$studentId || !$status) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

try {
    $application = new ApplicationsModel();
    $application->updateApplicationStatus($studentId, $status, $batch, $today);
    
    echo json_encode(["message" => "Status updated successfully"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Something went wrong", "message" => $e->getMessage()]);
    echo json_encode(["error" => "Something went wrong", "message" => $application]);
}
?>