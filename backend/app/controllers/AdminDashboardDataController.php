<?php 

namespace App\Controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/BatchModel.php';

use App\Models\AdminDashboardDataModel;
use Config\Database;

class AdminDashboardDataController {

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
                $this->getOverviewData();
                break;
            default:
                http_response_code(405);
                echo json_encode(array("message" => "Method not allowed"));
                break;
        }
    }
   
    public function getOverviewData() {
        try {
            $data = [];

            $dashboardData = new AdminDashboardDataModel();

            $id = $_GET['id'] ?? null;

            $numberOfAllScholars = $dashboardData->getNumberOfAllScholars();
            $numberOfPendingScholars = $dashboardData->getNumberOfPendingScholars();
            $numberOfActiveScholars = $dashboardData->getNumberOfActiveScholars();
            $numberOfDeactivatedScholars = $dashboardData->getNumberOfDeactivatedScholars();
            $numberOfAllStaff = $dashboardData->getNumberOfAllStaffs();

             $data = [
                    'totalScholars' => $numberOfAllScholars,
                    'pendingScholars' => $numberOfPendingScholars,
                    'activeScholars' => $numberOfActiveScholars,
                    'deactivatedScholars' => $numberOfDeactivatedScholars,
                    'totalStaff' => $numberOfAllStaff,
                    'totalUsers' => $numberOfAllScholars + $numberOfAllStaff,
                ];

            http_response_code(200);
            echo json_encode(array(
                "message" => "Overview data fetched successfully",
                "data" => $data
            ));
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(array( 
                "message" => "An error occurred while fetching overview data",
                "error" => $e->getMessage()
            ));
        }
    }
}

$controller = new AdminDashboardDataController();
$controller->processRequest(); 

?>