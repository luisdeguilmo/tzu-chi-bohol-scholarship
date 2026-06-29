<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/ScholarshipCriteriaModel.php';

use App\Constants\Action;
use App\Models\AuditLogModel;
use App\Models\ScholarshipCriteriaModel;
use App\Models\StaffAccountModel;
use Config\Database;
use App\Middleware\Auth;

class ProcedureController
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
                // Get specific procedure
                $result = $criteria->getProcedureById($id);

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
                        'message' => 'Procedure not found',
                    ]);
                }
            } else {
                $results = $criteria->getAllProcedures();

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
            if (isset($_POST['procedure'])) {
                // Handle data from FormData
                $data = json_decode($_POST['procedure'], true);
            } else {
                // Handle direct JSON input
                $data = json_decode(file_get_contents('php://input'), true);
            }

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Process procedure data
            $criteria = new ScholarshipCriteriaModel();

            if (!$criteria->createProcedure($data['procedure'])) {
                throw new \Exception('Failed to save procedure information');
            }

            $staffId = Auth::id();
            $staff = $this->staffModel->getStaffInfoById($staffId);

            if (
                !$this->auditLogModel->create([
                    'user_id' => $staffId,
                    'actor' => "{$staff['first_name']} {$staff['last_name']}",
                    'user_role' => 'staff',
                    'action' => Action::PROCEDURE_CREATE,
                    'entity_type' => 'criteria',
                    'entity_id' => null,

                    'description' =>
                        $staff['first_name'] . ' ' . $staff['last_name'] . ' added a new procedure.',

                    'old_values' => null,
                    'new_values' => ['procedure' => $data['procedure']],
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
                'message' => 'Procedure created successfully',
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
            if (!isset($data['procedure']['id'])) {
                throw new \Exception('ID is required for update');
            }

            $id = $data['procedure']['id'];

            // Process procedure data
            $criteria = new ScholarshipCriteriaModel();

            // Check if procedure exists
            $existingProcedure = $criteria->getProcedureById($id);
            if (!$existingProcedure) {
                throw new \Exception('Procedure not found');
            }

            if (!$criteria->updateProcedure($id, $data['procedure'])) {
                throw new \Exception('Failed to update procedure information');
            }

            $staffId = Auth::id();
            $staff = $this->staffModel->getStaffInfoById($staffId);

            if (
                !$this->auditLogModel->create([
                    'user_id' => $staffId,
                    'actor' => "{$staff['first_name']} {$staff['last_name']}",
                    'user_role' => 'staff',
                    'action' => Action::PROCEDURE_UPDATE,
                    'entity_type' => 'criteria',
                    'entity_id' => null,

                    'description' =>
                        $staff['first_name'] . ' ' . $staff['last_name'] . ' updated a procedure.',

                    'old_values' => null,
                    'new_values' => ['procedure' => $data['procedure']['procedure']],
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
                'message' => 'Procedure updated successfully',
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

            // Check if procedure exists
            $existingProcedure = $criteria->getProcedureById($id);
            if (!$existingProcedure) {
                throw new \Exception('Procedure not found');
            }

            if (!$criteria->deleteProcedure($id)) {
                throw new \Exception('Failed to delete procedure');
            }

            $staffId = Auth::id();
            $staff = $this->staffModel->getStaffInfoById($staffId);

            if (
                !$this->auditLogModel->create([
                    'user_id' => $staffId,
                    'actor' => "{$staff['first_name']} {$staff['last_name']}",
                    'user_role' => 'staff',
                    'action' => Action::PROCEDURE_DELETE,
                    'entity_type' => 'criteria',
                    'entity_id' => null,

                    'description' =>
                        $staff['first_name'] . ' ' . $staff['last_name'] . ' deleted a procedure.',

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
                'message' => 'Procedure deleted successfully',
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

$controller = new ProcedureController();
$controller->processRequest();
?>
