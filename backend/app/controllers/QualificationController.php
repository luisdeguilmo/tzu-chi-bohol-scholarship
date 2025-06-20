<?php
namespace App\Controllers;
require_once __DIR__ . "/../../config/Database.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . "/../../vendor/autoload.php";

use App\Models\ScholarshipCriteriaModel;
use Config\Database;

class QualificationController {
    private $pdo;
    
    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }
    
    public function processRequest() {
        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            return;
        }
        
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        
        switch($requestMethod) {
            case 'GET':
                $this->handleGet();
                break;
            case 'POST':
                $this->handlePost();
                break;
            case 'PUT':
                $this->handlePut();
                break;
            case 'DELETE':
                $this->handleDelete();
                break;
            default:
                http_response_code(405);
                echo json_encode(array("message" => "Method not allowed"));
                break;
        }
    }
    
    private function handleGet() {
        try {
            $criteria = new ScholarshipCriteriaModel();
            
            // Get ID parameter if it exists
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            
            if ($id) {
                // Get specific qualification
                $result = $criteria->getQualificationById($id);
                
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
                        "message" => "Qualification not found"
                    ));
                }
            } else {
                // Get all qualifications
                $results = $criteria->getAllQualifications();
                
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
    
    private function handlePost() {
        try {
            $this->pdo->beginTransaction();
            
            // Handle data from both FormData and direct JSON
            if (isset($_POST['qualification'])) {
                // Handle data from FormData
                $data = json_decode($_POST['qualification'], true);
            } else {
                // Handle direct JSON input
                $data = json_decode(file_get_contents("php://input"), true);
            }
            
            file_put_contents("log.txt", json_encode($data) . PHP_EOL, FILE_APPEND);
            
            if (!$data) {
                throw new \Exception("No data provided");
            }
            
            // Process application data
            $criteria = new ScholarshipCriteriaModel();
            
            if (!$criteria->createQualification($data['qualification'])) {
                throw new \Exception("Failed to save qualification information");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(201);
            echo json_encode(array(
                "success" => true,
                "message" => "Qualification created successfully"
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
            
            // Get data from request body
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (!$data) {
                throw new \Exception("No data provided");
            }
            
            // Check if ID is provided
            if (!isset($data['qualification']['id'])) {
                throw new \Exception("ID is required for update");
            }
            
            $id = $data['qualification']['id'];
            
            // Process application data
            $criteria = new ScholarshipCriteriaModel();
            
            // Check if qualification exists
            $existingQualification = $criteria->getQualificationById($id);
            if (!$existingQualification) {
                throw new \Exception("Qualification not found");
            }
            
            if (!$criteria->updateQualification($id, $data['qualification'])) {
                throw new \Exception("Failed to update qualification information");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Qualification updated successfully"
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
    
    private function handleDelete() {
        try {
            $this->pdo->beginTransaction();
            
            // Get ID parameter
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            
            if (!$id) {
                throw new \Exception("ID is required for delete");
            }
            
            // Process delete
            $criteria = new ScholarshipCriteriaModel();
            
            // Check if qualification exists
            $existingQualification = $criteria->getQualificationById($id);
            if (!$existingQualification) {
                throw new \Exception("Qualification not found");
            }
            
            if (!$criteria->deleteQualification($id)) {
                throw new \Exception("Failed to delete qualification");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Qualification deleted successfully"
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
}

// Create and execute controller
$controller = new QualificationController();
$controller->processRequest();
?>