<?php 
namespace App\Controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

date_default_timezone_set('Asia/Manila');

require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/ScholarAccountModel.php';

use App\Models\ScholarAccountModel;
use Config\Database;

class ScholarAccountController {
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function processRequest() {
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            return;
        }

        $requestMethod = $_SERVER['REQUEST_METHOD'];

        switch ($requestMethod) {
            case "GET":
                $this->handleGet();
                break;
            case "POST":
                $this->handlePost();
                break;
            case "PUT":
                // $this->handlePut();
                break;
            case "DELETE":
                // $this->handleDelete();
                break;
            default:
                http_response_code(405);
                echo json_encode(array("message" => "Method not allowed"));
                break;
        }
    }

    private function handlePost() {
        try {
            $this->pdo->beginTransaction();
            
            // Handle data from both FormData and direct JSON
            if (isset($_POST['applicationIds'])) {
                // Handle data from FormData
                $data = $_POST;
            } else {
                // Handle direct JSON input
                $data = json_decode(file_get_contents("php://input"), true);
            }
            
            // Optional logging
            // file_put_contents("log.txt", json_encode($data) . PHP_EOL, FILE_APPEND);
            
            if (!$data) {
                throw new \Exception("No data provided");
            }
            
            // Check if we have applicationIds
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
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(201);
            echo json_encode(array(
                "success" => true,
                "message" => "Successfully created $successCount scholar account(s)",
                "errorsCount" => count($errors),
                "errors" => $errors
            ));
        } catch (\Exception $e) {
            // Roll back transaction on error
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            
            http_response_code(400);
            echo json_encode(array(
                "success" => false,
                "message" => $e->getMessage()
            ));
        }
    }

    private function handleGet() {
        try {
            $model = new ScholarAccountModel();
            
            // Get ID parameter if it exists
            $application_status = isset($_GET['application_status']) ? $_GET['application_status'] : null;
            
            if (!$application_status) {
                // Get specific scholar
                $result = $model->getCreatedAccounts();
                
                if ($result) {
                    http_response_code(200);
                    echo json_encode(array(
                        "success" => true,
                        "data" => $result
                    ));
                } else {
                    http_response_code(404);
                    echo json_encode(array(
                        "success" => false,
                        "message" => "Scholar not found"
                    ));
                }
            } else {
                $results = $model->getPendingScholars($application_status);
                
                http_response_code(200);
                echo json_encode(array(
                    "success" => true,
                    "data" => $results
                ));
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(array(
                "success" => false,
                "message" => $e->getMessage()
            ));
        }
    } 
}

$controller = new ScholarAccountController();
$controller->processRequest();
?>