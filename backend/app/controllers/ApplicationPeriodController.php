<?php 
namespace App\Controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/ApplicationPeriodModel.php';

use App\Models\ApplicationPeriodModel;
use Config\Database;

class ApplicationPeriodController {
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
            default:
                http_response_code(405);
                echo json_encode(array("message" => "Method not allowed"));
                break;
        }
    }

    private function handleGet() {
        try {
            $applicationPeriod = new ApplicationPeriodModel();
            
            // Get ID parameter if it exists
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            
            if ($id) {
                // Get specific application period
                $result = $applicationPeriod->getApplicationPeriodById($id);
                
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
                        "message" => "Application period not found"
                    ));
                }
            } else {
                $results = $applicationPeriod->getAllApplicationPeriods();
                
                // Get the latest application period
                $latestPeriod = $applicationPeriod->getLatestApplicationPeriod();
                
                // Add 'editable' flag to each result
                foreach ($results as &$result) {
                    $result['editable'] = ($latestPeriod && $result['id'] == $latestPeriod['id']);
                }
                
                http_response_code(200);
                echo json_encode(array(
                    "success" => true,
                    "data" => $results,
                    "hasActiveApplicationPeriod" => $applicationPeriod->hasActiveApplicationPeriod()
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
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (!$data) {
                throw new \Exception("No data provided");
            }
            
            // Process application period data
            $applicationPeriod = new ApplicationPeriodModel();
            
            if (!$applicationPeriod->createApplicationPeriod($data['application'])) {
                throw new \Exception("Failed to save application period information");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(201);
            echo json_encode(array(
                "success" => true,
                "message" => "Application period created successfully"
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
            if (!isset($data['application']['id'])) {
                throw new \Exception("ID is required for update");
            }
            
            $id = $data['application']['id'];
            
            // Process application period data
            $applicationPeriod = new ApplicationPeriodModel();
            
            // Check if application period exists
            $existingApplicationPeriod = $applicationPeriod->getApplicationPeriodById($id);
            if (!$existingApplicationPeriod) {
                throw new \Exception("Application period not found");
            }
            
            // Get the latest application period
            $latestPeriod = $applicationPeriod->getLatestApplicationPeriod();
            
            // Check if this is the latest application period
            if (!$latestPeriod || $id != $latestPeriod['id']) {
                throw new \Exception("Only the most recent application period can be edited");
            }
            
            if (!$applicationPeriod->updateApplicationPeriod($id, $data['application'])) {
                throw new \Exception("Failed to update application period information");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Application period updated successfully"
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

$controller = new ApplicationPeriodController();
$controller->processRequest();
?>