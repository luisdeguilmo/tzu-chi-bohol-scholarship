<?php 
namespace App\Controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/StaffAccountModel.php';

use App\Models\StaffAccountModel;
use Config\Database;

class StaffAccountController {
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
            $criteria = new StaffAccountModel();
            
            // Get ID parameter if it exists
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            
            if ($id) {
                // Get specific procedure
                $result = $criteria->getStaffById($id);
                
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
                        "message" => "Staff not found"
                    ));
                }
            } else {
                $results = $criteria->getAllStaffs();
                
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
            if (isset($_POST['staff'])) {
                // Handle data from FormData
                $data = json_decode($_POST['staff'], true);
            } else {
                // Handle direct JSON input
                $data = json_decode(file_get_contents("php://input"), true);
            }
            
            if (!$data) {
                throw new \Exception("No data provided");
            }
            
            // Process procedure data
            $criteria = new StaffAccountModel();
            
            if (!$criteria->createStaff($data['staff'])) {
                throw new \Exception("Failed to save staff information");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(201);
            echo json_encode(array(
                "success" => true,
                "message" => "Staff account created successfully"
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
            if (!isset($data['staff']['id'])) {
                throw new \Exception("ID is required for update");
            }
            
            $id = $data['staff']['id'];
            
            // Process procedure data
            $criteria = new StaffAccountModel();
            
            // Check if procedure exists
            $existingProcedure = $criteria->getStaffById($id);
            if (!$existingProcedure) {
                throw new \Exception("Staff not found");
            }
            
            if (!$criteria->updateStaff($id, $data['staff'])) {
                throw new \Exception("Failed to update staff information");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Staff updated successfully"
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
            $criteria = new StaffAccountModel();
            
            // Check if procedure exists
            $existingProcedure = $criteria->getStaffById($id);
            if (!$existingProcedure) {
                throw new \Exception("Staff not found");
            }
            
            if (!$criteria->deleteStaff($id)) {
                throw new \Exception("Failed to delete staff");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Staff deleted successfully"
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

$controller = new StaffAccountController();
$controller->processRequest();
?>