<?php
namespace App\Controllers;
require_once __DIR__ . "/../../config/Database.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . "/../../vendor/autoload.php";

use App\Models\ScholarshipCriteriaModel;
use Config\Database;

class CourseController {
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
            case 'POST':
                $this->handlePost();
                break;
            case 'PUT':
                $this->handlePut();
                break;
            case 'DELETE':
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
            $criteria = new ScholarshipCriteriaModel();
            
            // Get ID parameter if it exists
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            
            if ($id) {
                // Get specific qualification
                $result = $criteria->getCourseById($id);
                
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
                        "message" => "Course not found"
                    ));
                }
            } else {
                // Get all qualifications
                $results = $criteria->getAllCourses();
                
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
            if (isset($_POST['course'])) {
                // Handle data from FormData
                $data = json_decode($_POST['course'], true);
            } else {
                // Handle direct JSON input
                $data = json_decode(file_get_contents("php://input"), true);
            }
            
            file_put_contents("log.txt", json_encode($data) . PHP_EOL, FILE_APPEND);
            
            if (!$data) {
                throw new \Exception("No data provided");
            }
            
            // Process application data
            $criteria = new ScholarshipCriteriaModel();
            
            if (!$criteria->createCourse($data['course'])) {
                throw new \Exception("Failed to save course information");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(201);
            echo json_encode(array(
                "success" => true,
                "message" => "Course created successfully"
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
            if (!isset($data['course']['id'])) {
                throw new \Exception("ID is required for update");
            }
            
            $id = $data['course']['id'];
            
            // Process application data
            $criteria = new ScholarshipCriteriaModel();
            
            // Check if qualification exists
            $existingCourse = $criteria->getCourseById($id);
            if (!$existingCourse) {
                throw new \Exception("Course not found");
            }
            
            if (!$criteria->updateCourse($id, $data['course'])) {
                throw new \Exception("Failed to update course information");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Course updated successfully"
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
            $criteria = new ScholarshipCriteriaModel();
            
            // Check if qualification exists
            $existingCourse = $criteria->getCourseById($id);
            if (!$existingCourse) {
                throw new \Exception("Course not found");
            }
            
            if (!$criteria->deleteCourse($id)) {
                throw new \Exception("Failed to delete course");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Course deleted successfully"
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
$controller = new CourseController();
$controller->processRequest();
?>