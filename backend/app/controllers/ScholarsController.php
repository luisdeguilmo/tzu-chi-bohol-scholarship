<?php
namespace App\Controllers;
require_once __DIR__ . "/../../config/Database.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . "/../../vendor/autoload.php";

use App\Models\ScholarsModel;
use Config\Database;

class ScholarsController {
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
          
            default:
                http_response_code(405);
                echo json_encode(array("message" => "Method not allowed"));
                break;
        }
    }
    
    private function handleGet() {
        try {
            $scholar = new ScholarsModel();
            
            // Get ID parameter if it exists
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            $tab = $_GET['tab'] ?? null;
            $status = $_GET['status'] ?? null;
            $school_year = $_GET['school_year'] ?? null;
            $sort = $_GET['sort'] ?? null;
            
            $results = [];
            
            if ($tab === 'all') {
                $results = $scholar->getAllScholars($status, $school_year, $sort);
            } else if ($tab === 'new') {
                $results = $scholar->getNewScholars($status, $school_year, $sort);
            } else if ($tab === 'old') {
                $results = $scholar->getOldScholars($status, $school_year, $sort);
            }
            
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
}

// Create and execute controller
$controller = new ScholarsController();
$controller->processRequest();
?>