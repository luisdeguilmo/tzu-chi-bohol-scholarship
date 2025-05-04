<?php 
namespace App\Controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . '/../../config/Database.php';

use App\Models\ApplicationsModel;
use Config\Database;

class BatchExaminationController {
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
                $this->handlePut();
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
            if (isset($_POST['applicantIds'])) {
                // Handle data from FormData
                $data = $_POST;
            } else {
                // Handle direct JSON input
                $data = json_decode(file_get_contents("php://input"), true);
            }
            
            file_put_contents("log.txt", json_encode($data) . PHP_EOL, FILE_APPEND);
            
            if (!$data) {
                throw new \Exception("No data provided");
            }
            
            // Check if we have applicantIds and batch
            if (!isset($data['applicantIds']) || !isset($data['batch'])) {
                throw new \Exception("Missing required fields: applicantIds or batch");
            }
            
            // Process multiple applicants
            $applicationInfo = new ApplicationsModel();
            $successCount = 0;
            
            foreach ($data['applicantIds'] as $applicantId) {
                if ($applicationInfo->assignApplicants($applicantId, $data['batch'])) {
                    $successCount++;
                }
            }
            
            if ($successCount === 0) {
                throw new \Exception("Failed to add batch information to any applicant");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(201);
            echo json_encode(array(
                "success" => true,
                "message" => "Batch added successfully to {$successCount} applicant(s)"
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

    private function handlePut() {
        try {
            $this->pdo->beginTransaction();
            
            // Handle data from both FormData and direct JSON
            if (isset($_POST['id'])) {
                // Handle data from FormData
                $data = $_POST; // No need to json_decode if it's directly in $_POST
            } else {
                // Handle direct JSON input
                $data = json_decode(file_get_contents("php://input"), true);
            }
            
            file_put_contents("log.txt", json_encode($data) . PHP_EOL, FILE_APPEND);
            
            if (!$data) {
                throw new \Exception("No data provided");
            }
            
            // Process application data
            $applicationInfo = new ApplicationsModel();
            
            if (!$applicationInfo->markAsUnassigned($data['id'])) {
                throw new \Exception("Failed to add batch information");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(201);
            echo json_encode(array(
                "success" => true,
                "message" => "Batch added successfully to application_info"
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
            $criteria = new ApplicationsModel();
            
            // Get ID parameter if it exists
            $id = isset($_GET['batch']) ? $_GET['batch'] : null;
            
            if ($id) {
                // Get specific procedure
                $result = $criteria->getApplicantsByBatch($id);
                
                if ($result) {
                    http_response_code(200);
                    echo json_encode(array(
                        "success" => true,
                        "data" => $result
                    ));
                } else {
                    echo json_encode(array(
                        "message" => "Batch not found",
                        "data" => $result
                    ));
                }
            } else {
                $results = $criteria->getBatches();
                
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

$controller = new BatchExaminationController();
$controller->processRequest();
?>