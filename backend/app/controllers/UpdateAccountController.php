<?php
namespace App\Controllers;
require_once __DIR__ . "/../../config/Database.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . "/../../vendor/autoload.php";

use App\Models\ApplicationsModel;
use Config\Database;

class UpdateAccountController {
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
            case 'POST':
                $this->handlePost();
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
            
            // Get data from request body
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (!$data) {
                throw new \Exception("No data provided");
            }
            
            // Extract required fields
            $studentId = $data['studentId'] ?? null;
            $status = $data['status'] ?? null;
            $batch = $data['batch'] ?? null;
            
            // Validate required fields
            if (!$studentId || !$status || !$batch) {
                throw new \Exception("Missing required fields");
            }
            
            // Process application status update
            $application = new ApplicationsModel();
            
            if (!$application->updateApplicationStatus($studentId, $status, $batch)) {
                throw new \Exception("Failed to update application status");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Status updated successfully"
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
$controller = new UpdateAccountController();
$controller->processRequest();
?>