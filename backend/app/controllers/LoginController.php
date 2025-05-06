<?php
namespace App\Controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/LoginModel.php';

use App\Models\LoginModel;
use Config\Database;

class LoginController {
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
            case "POST":
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
            // Get POST data
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (!$data || !isset($data['email']) || !isset($data['password'])) {
                http_response_code(400);
                echo json_encode(array(
                    "success" => false,
                    "message" => "Email and password are required"
                ));
                return;
            }
            
            $criteria = new LoginModel();
            // $result = $criteria->getCredential($data['email'], $data['password']);

            if ($data['type'] == 'Scholar') {
                $result = $criteria->getScholarCredential($data['email'], $data['password']);
            } elseif ($data['type'] == 'Admin') {
                $result = $criteria->getAdminCredential($data['email'], $data['password']);
            } elseif ($data['type'] == 'Staff') {
                $result = $criteria->getStaffCredential($data['email'], $data['password']);
            } 
            
            if ($result) {
                http_response_code(200);
                echo json_encode(array(
                    "success" => true,
                    "data" => $result
                ));
            } else {
                http_response_code(401);
                echo json_encode(array(
                    "success" => false,
                    "message" => "Invalid credentials"
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

// Instantiate and run the controller
$controller = new LoginController();
$controller->processRequest();
?>