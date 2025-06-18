<?php 
namespace App\Controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/BatchModel.php';

use App\Models\ActivityModel;
use Config\Database;

class ScholarVolunteerActivityController {
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
                // $this->handlePost();
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

//    private function handlePost() {
//     try {
//         // Clear any previous output
//         ob_clean();
        
//         $this->pdo->beginTransaction();

//         $id = isset($_GET['id']) ? $_GET['id'] : null;
        
//         if (!$id) {
//             throw new \Exception("ID is required");
//         }
        
//         $data = json_decode(file_get_contents("php://input"), true);
        
//         if (!$data) {
//             throw new \Exception("No data provided or invalid JSON");
//         }
        
//         $criteria = new BatchModel();
        
//         if (!$criteria->createSchedule($data, $id)) {
//             throw new \Exception("Failed to save schedule information");
//         }
        
//         $this->pdo->commit();
        
//         http_response_code(201);
//         echo json_encode(array(
//             "success" => true,
//             "message" => "Schedule created successfully"
//         ));
//     } catch (\Exception $e) {
//         if ($this->pdo->inTransaction()) {
//             $this->pdo->rollBack();
//         }
        
//         http_response_code(400);
//         echo json_encode(array(
//             "success" => false,
//             "message" => $e->getMessage()
//         ));
//     }
// }

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
            } else if ($id === null && $tab === 'pending') {
                $results = $activity->getScholarWithCurrentMonthActivities($tab);
                
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

    // private function handleDelete() {
    //     try {
    //         $this->pdo->beginTransaction();
            
    //         // Get ID parameter
    //         $id = isset($_GET['id']) ? $_GET['id'] : null;
            
    //         if (!$id) {
    //             throw new \Exception("ID is required for delete");
    //         }
            
    //         // Process delete
    //         $criteria = new BatchModel();
            
    //         // Check if qualification exists
    //         $existingQualification = $criteria->getBatchById($id);
    //         if (!$existingQualification) {
    //             throw new \Exception("Batch not found");
    //         }
            
    //         if (!$criteria->deleteBatch($id)) {
    //             throw new \Exception("Failed to delete batch");
    //         }
            
    //         $this->pdo->commit();
            
    //         // Return success response
    //         http_response_code(200);
    //         echo json_encode(array(
    //             "success" => true,
    //             "message" => "Batch deleted successfully"
    //         ));
    //     } catch (\Exception $e) {
    //         // Roll back transaction on error
    //         if ($this->pdo->inTransaction()) {
    //             $this->pdo->rollBack();
    //         }
            
    //         http_response_code(400);
    //         echo json_encode(array(
    //             "success" => false,
    //             "message" => $e->getMessage()
    //         ));
    //     }
    // }

}

$controller = new ScholarVolunteerActivityController();
$controller->processRequest();
?>