<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config/Database.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Constants\Action;
use App\Models\AuditLogModel;
use App\Models\ScholarshipCriteriaModel;
use App\Models\StaffAccountModel;
use Config\Database;
use App\Middleware\Auth;

class CourseVisibilityController
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
            $criteria = new ScholarshipCriteriaModel();

            // Get ID parameter if it exists
            $id = isset($_GET['id']) ? $_GET['id'] : null;

            if ($id) {
                // Get specific qualification
                $result = $criteria->getCourseById($id);

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
                        'message' => 'Course not found',
                    ]);
                }
            } else {
                // Get all qualifications
                $results = $criteria->getAllVisibleCourses();

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
            if (!isset($data['course']['id'])) {
                throw new \Exception('ID is required for update');
            }

            $id = $data['course']['id'];

            // Process application data
            $criteria = new ScholarshipCriteriaModel();

            // Check if qualification exists
            $existingCourse = $criteria->getCourseById($id);
            if (!$existingCourse) {
                throw new \Exception('Course not found');
            }

            if (!$criteria->updateCourseVisibility($id, $data['course'])) {
                throw new \Exception('Failed to update course information');
            }

            $staffId = Auth::id();
            $staff = $this->staffModel->getStaffInfoById($staffId);

            if (
                !$this->auditLogModel->create([
                    'user_id' => $staffId,
                    'actor' => "{$staff['first_name']} {$staff['last_name']}",
                    'user_role' => 'staff',
                    'action' => Action::COURSE_UPDATED,
                    'entity_type' => 'criteria',
                    'entity_id' => null,

                    'description' =>
                        $staff['first_name'] . ' ' . $staff['last_name'] . ' updated a course.',

                    'old_values' => null,
                    'new_values' => [
                        'course' => [
                            'name' => $data['course']['course'],
                            'is_visible' => $data['course']['is_visible'],
                        ],
                    ],
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
                'message' => 'Course updated successfully',
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
$controller = new CourseController();
$controller->processRequest();
?>
