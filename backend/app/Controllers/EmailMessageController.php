<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config/Database.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Models\CollegeUniversityManagementModel;
use App\Models\EmailMessageModel;
use App\Models\ScholarshipCriteriaModel;
use Config\Database;

class EmailMessageController
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function processRequest()
    {
        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            return;
        }

        $requestMethod = $_SERVER['REQUEST_METHOD'];

        switch ($requestMethod) {
            case 'GET':
                $this->handleGet();
                break;
            case 'POST':
                $this->handlePost();
                break;
            case 'PUT':
                $this->handlePut();
                break;
            default:
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
                break;
        }
    }

    private function handleGet()
    {
        try {
            $model = new EmailMessageModel();

            // Get ID parameter if it exists
            // $id = isset($_GET['id']) ? $_GET['id'] : null;
            $stage = $_GET['stage'] ? $_GET['stage'] : null;

            $result = [];

            $passedMessage = $model->getPassedMessage($stage);
            $failedMessage = $model->getFailedMessage($stage);

            $result = [
                'passedMessage' => $passedMessage,
                'failedMessage' => $failedMessage,
            ];

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function handlePost()
    {
        try {
            $this->pdo->beginTransaction();

            // Handle data from both FormData and direct JSON
            if (isset($_POST['college_university'])) {
                // Handle data from FormData
                $data = json_decode($_POST['college_university'], true);
            } else {
                // Handle direct JSON input
                $data = json_decode(file_get_contents('php://input'), true);
            }

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Process application data
            $model = new CollegeUniversityManagementModel();

            if (!$model->create($data['college_university'])) {
                throw new \Exception('Failed to save course information');
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Email messages created successfully',
            ]);
        } catch (\Exception $e) {
            // Roll back transaction on error
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function handlePut()
    {
        try {
            $this->pdo->beginTransaction();

            // Get data from request body
            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Check if ID is provided
            if (!isset($data['stage'])) {
                throw new \Exception('Stage is required for update');
            }

            $stage = $data['stage'];

            // Process application data
            $model = new EmailMessageModel();

            if (!$model->updatePassedMessage($data)) {
                throw new \Exception('Failed to update message');
            }

            if (!$model->updateFailedMessage($data)) {
                throw new \Exception('Failed to update message');
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Email messages updated successfully',
            ]);
        } catch (\Exception $e) {
            // Roll back transaction on error
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }
}

// Create and execute controller
$controller = new EmailMessageController();
$controller->processRequest();
?>
