<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config/Database.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../Models/AuditLogModel.php';
require_once __DIR__ . '/../Models/ScholarshipCriteriaModel.php';
require_once __DIR__ . '/../Models/StaffAccountModel.php';

use App\Constants\Action;
use App\Models\AuditLogModel;
use App\Models\ScholarshipCriteriaModel;
use App\Models\StaffAccountModel;
use Config\Database;
use App\Middleware\Auth;

class StrandController
{
    private $pdo;
    private $auditLogModel;
    private $staffModel;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->auditLogModel = new AuditLogModel();
        $this->staffModel = new StaffAccountModel();
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
            case 'DELETE':
                $this->handleDelete();
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
            $criteria = new ScholarshipCriteriaModel();

            // Get ID parameter if it exists
            $id = isset($_GET['id']) ? $_GET['id'] : null;

            if ($id) {
                // Get specific qualification
                $result = $criteria->getStrandById($id);

                if ($result) {
                    http_response_code(200);
                    echo json_encode([
                        'success' => true,
                        'data' => $result,
                    ]);
                } else {
                    http_response_code(404);
                    echo json_encode([
                        'success' => false,
                        'message' => 'Strand not found',
                    ]);
                }
            } else {
                // Get all qualifications
                $results = $criteria->getAllStrands();

                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data' => $results,
                ]);
            }
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
            if (isset($_POST['strand'])) {
                // Handle data from FormData
                $data = json_decode($_POST['strand'], true);
            } else {
                // Handle direct JSON input
                $data = json_decode(file_get_contents('php://input'), true);
            }

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Process application data
            $criteria = new ScholarshipCriteriaModel();

            if (!$criteria->createStrand($data['strand'])) {
                throw new \Exception('Failed to save strand information');
            }

            $staffId = Auth::id();
            $staff = $this->staffModel->getStaffInfoById($staffId);

            if (
                !$this->auditLogModel->create([
                    'user_id' => $staffId,
                    'actor' => "{$staff['first_name']} {$staff['last_name']}",
                    'user_role' => 'staff',
                    'action' => Action::STRAND_CREATE,
                    'entity_type' => 'criteria',
                    'entity_id' => null,

                    'description' =>
                        $staff['first_name'] . ' ' . $staff['last_name'] . ' added a new strand.',

                    'old_values' => null,
                    'new_values' => ['strand' => $data['strand']['strand']],
                    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                ])
            ) {
                throw new \Exception('Failed to create audit log');
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Strand created successfully',
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
            if (!isset($data['strand']['id'])) {
                throw new \Exception('ID is required for update');
            }

            $id = $data['strand']['id'];

            // Process application data
            $criteria = new ScholarshipCriteriaModel();

            // Check if qualification exists
            $existingCourse = $criteria->getStrandById($id);
            if (!$existingCourse) {
                throw new \Exception('Strand not found');
            }

            if (!$criteria->updateStrand($id, $data['strand'])) {
                throw new \Exception('Failed to update strand information');
            }

            $staffId = Auth::id();
            $staff = $this->staffModel->getStaffInfoById($staffId);

            if (
                !$this->auditLogModel->create([
                    'user_id' => $staffId,
                    'actor' => "{$staff['first_name']} {$staff['last_name']}",
                    'user_role' => 'staff',
                    'action' => Action::STRAND_UPDATE,
                    'entity_type' => 'criteria',
                    'entity_id' => null,

                    'description' =>
                        $staff['first_name'] . ' ' . $staff['last_name'] . ' updated a strand.',

                    'old_values' => null,
                    'new_values' => ['strand' => $data['strand']['strand']],
                    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                ])
            ) {
                throw new \Exception('Failed to create audit log');
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Strand updated successfully',
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

    private function handleDelete()
    {
        try {
            $this->pdo->beginTransaction();

            // Get ID parameter
            $id = isset($_GET['id']) ? $_GET['id'] : null;

            if (!$id) {
                throw new \Exception('ID is required for delete');
            }

            // Process delete
            $criteria = new ScholarshipCriteriaModel();

            // Check if qualification exists
            $existingStrand = $criteria->getStrandById($id);
            if (!$existingStrand) {
                throw new \Exception('Strand not found');
            }

            if (!$criteria->deleteStrand($id)) {
                throw new \Exception('Failed to delete Strand');
            }

            $staffId = Auth::id();
            $staff = $this->staffModel->getStaffInfoById($staffId);

            if (
                !$this->auditLogModel->create([
                    'user_id' => $staffId,
                    'actor' => "{$staff['first_name']} {$staff['last_name']}",
                    'user_role' => 'staff',
                    'action' => Action::STRAND_DELETE,
                    'entity_type' => 'criteria',
                    'entity_id' => null,

                    'description' =>
                        $staff['first_name'] . ' ' . $staff['last_name'] . ' deleted a strand.',

                    'old_values' => null,
                    'new_values' => null,
                    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                ])
            ) {
                throw new \Exception('Failed to create audit log');
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Course deleted successfully',
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
$controller = new StrandController();
$controller->processRequest();
?>
