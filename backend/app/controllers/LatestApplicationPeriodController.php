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

class LatestApplicationPeriodController {
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
            default:
                http_response_code(405);
                echo json_encode(array("message" => "Method not allowed"));
                break;
        }
    }

    private function handleGet() {
        try {
            $applicationPeriod = new ApplicationPeriodModel();          
                // Get the latest application period
            $latestPeriod = $applicationPeriod->getLatestApplicationPeriod();
            
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "data" => $latestPeriod,
                "hasActiveApplicationPeriod" => $applicationPeriod->hasActiveApplicationPeriod()
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

$controller = new LatestApplicationPeriodController();
$controller->processRequest();
?>