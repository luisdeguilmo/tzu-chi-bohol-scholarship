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


if (!$data) {
    throw new \Exception("No data provided");
}

$studentId = $data['studentIds'] ?? null;
$status = $data['status'] ?? null;
$batch = $data['batch'] ?? null;
$today = date("Y-m-d H:i:s"); 

if (!$studentId || !$status) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$successCount = 0;

try {
    
    $application = new ApplicationsModel();
    $application->updateApplicationStatus($studentId, $status, $batch, $today);

    foreach ($data['studentIds'] as $studentId) {
        try {
            // First update status
            if ($application->updateApplicationStatus($studentId, $status, $batch, $today)) {
                // Then create account
                $successCount++;
                echo json_encode(["message" => "Status updated successfully"]);
            } else {
                $errors[] = "Failed to update status for application ID: $applicationId";
            }
        } catch (\Exception $e) {
            $errors[] = "Error processing application ID $applicationId: " . $e->getMessage();
        }
    }

    if (!$successCount === 0) {
        echo json_encode(["message" => "Status updated successfully"]);
    }
    
    echo json_encode(["message" => "Status updated successfully"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Something went wrong", "message" => $e->getMessage()]);
    echo json_encode(["error" => "Something went wrong", "message" => $application]);
}
?>

            
            <!-- // Check if we have applicationIds
            if (!isset($data['applicationIds']) || empty($data['applicationIds'])) {
                throw new \Exception("Missing required field: applicationIds");
            }
            
            // Process multiple applicants
            $scholarAccount = new ScholarAccountModel();
            $successCount = 0;
            $errors = [];

            $today = date("Y-m-d H:i:s"); 
            
            foreach ($data['applicationIds'] as $applicationId) {
                try {
                    // First update status
                    if ($scholarAccount->updateApplicationStatusToScholar($applicationId)) {
                        // Then create account
                        if ($scholarAccount->createAccount($applicationId, $today)) {
                            $successCount++;
                        } else {
                            $errors[] = "Failed to create account for application ID: $applicationId";
                        }
                    } else {
                        $errors[] = "Failed to update status for application ID: $applicationId";
                    }
                } catch (\Exception $e) {
                    $errors[] = "Error processing application ID $applicationId: " . $e->getMessage();
                }
            }
            
            if ($successCount === 0) {
                throw new \Exception("Failed to create any scholar accounts");
            } -->