<?php 
namespace App\Controllers;

header("Content-Type: application/json");

require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../models/RecentActivityModel.php';

use App\Models\RecentActivityModel;
use Config\Database;
use Middleware\Auth;

class RecentActivityController {
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
            default:
                http_response_code(405);
                echo json_encode(array("message" => "Method not allowed"));
                break;
        }
    }

    private function handleGet() {
        try {
            $recent_activity = new RecentActivityModel();

            $id = Auth::id();

            if (!$id) {
                throw new \Exception('ID is required.');
            }

            $results = $recent_activity->getRecentActivities($id);
            
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "data" => $results
            ));
            
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
                 
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (!$data) {
                throw new \Exception("No data provided");
            }
            
            // Process application data
            $recent_activity = new RecentActivityModel();
            
            if (!$recent_activity->createRecentCommunityService($data)) {
                throw new \Exception("Failed to add activity");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(201);
            echo json_encode(array(
                "success" => true,
                "message" => "Activity successfully added"
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

$controller = new RecentActivityController();
$controller->processRequest();
?>