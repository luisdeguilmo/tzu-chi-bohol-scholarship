<?php
// ob_start();

namespace App\Controllers;
// require_once __DIR__ . "/../../vendor/autoload.php"; 
require_once __DIR__ . "/../../config/Database.php";
require_once __DIR__ . "/../services/FileUploadService.php";
require_once __DIR__ . "/../services/ActivityService.php";
require_once __DIR__ . "/../models/ActivityModel.php";
require_once __DIR__ . "/../models/CertificateOfAppearanceModel.php";

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

use \App\Models\ActivityModel;
use \App\Models\CertificateOfAppearanceModel;
use App\Services\ActivityService;
use Config\Database;

class ActivityController {
    private $pdo;
    private $activityService;
    
    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->activityService = new ActivityService($this->pdo);
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
                $this->createActivity();
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
    
    public function createActivity() {
        $this->pdo->beginTransaction();
        
        try {
            // Parse input data
            $data = $this->parseInputData();
            
            if (!$data || !isset($data['activity'])) {
                throw new \Exception("No activity data provided");
            }
            
            // Extract files
            $files = $_FILES['files'] ?? null;
            $base64Files = $data['uploaded_files'] ?? null;
            
            // Create activity with files
            $activityId = $this->activityService->createActivityWithFiles(
                $data['activity'], 
                $files, 
                $base64Files
            );
            
            $this->pdo->commit();
            
            $this->sendResponse(201, [
                "success" => true,
                "message" => "Activity created successfully",
                "activity_id" => $activityId
            ]);
            
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            $this->sendResponse(400, [
                "success" => false,
                "message" => $e->getMessage()
            ]);
        }
    }
    
    private function parseInputData() {
        if (isset($_POST['activityData'])) {
            return json_decode($_POST['activityData'], true);
        }
        
        return json_decode(file_get_contents("php://input"), true);
    }
    
    private function sendResponse($statusCode, $data) {
        http_response_code($statusCode);
        echo json_encode($data);
    }

    private function handleGet() {
        try {
            $activity = new ActivityModel();
            
            // Get ID parameter if it exists
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            $tab = $_GET['tab'] ?? null; 
            
            if ($id && $tab === null) {
                // Get specific procedure
                $result = $activity->getActivityById($id);
                
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
                        "message" => "Activity not found"
                    ));
                }
            } else if ($id === null && $tab === 'this_month') {
                $results = $activity->getCurrentMonthActivities();
                
                http_response_code(200);
                echo json_encode(array(
                    "success" => true,
                    "data" => $results
                ));
            } else {
                $results = $activity->getAllActivities();
                
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

$controller = new ActivityController();
$controller->processRequest();
?>