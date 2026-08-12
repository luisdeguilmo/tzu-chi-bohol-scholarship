<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';

use App\Constants\Action;
use App\Models\ApplicantModel;
use App\Models\AuditLogModel;
use App\Models\OrientationModel;
use App\Models\PersonalModel;
use App\Models\SchoolYearModel;
use App\Models\StaffAccountModel;
use Config\Database;
use App\Middleware\Auth;

class OrientationController
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
            default:
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
                break;
        }
    }

    private function handlePost()
    {
        try {
            $this->pdo->beginTransaction();

            // Handle data from both FormData and direct JSON
            if (isset($_POST['applicantIds'])) {
                // Handle data from FormData
                $data = $_POST;
            } else {
                // Handle direct JSON input
                $data = json_decode(file_get_contents('php://input'), true);
            }

            // file_put_contents('log.txt', json_encode($data) . PHP_EOL, FILE_APPEND);

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Check if we have applicantIds and batch
            if (!isset($data['applicantIds']) || !isset($data['batch'])) {
                throw new \Exception('Missing required fields: applicantIds or batch');
            }

            // Process multiple applicants
            $applicationInfo = new OrientationModel();
            $personal = new PersonalModel();
            $successCount = 0;
            $applicant_names = [];

            foreach ($data['applicantIds'] as $applicantId) {
                if ($applicationInfo->assignApplicants($applicantId, $data['batch'])) {
                    $successCount++;
                }

                $name = $personal->getPersonalInformation($applicantId);
                $applicant_names[] = "{$name['first_name']} {$name['last_name']}";
            }

            if ($successCount === 0) {
                throw new \Exception('Failed to add batch information to any applicant');
            }

            $staffId = Auth::id();
            $staff = $this->staffModel->getStaffInfoById($staffId);
            $applicant_list = implode(', ', $applicant_names);

            if (
                !$this->auditLogModel->create([
                    'user_id' => $staffId,
                    'actor' => "{$staff['first_name']} {$staff['last_name']}",
                    'user_role' => 'staff',
                    'action' => Action::APPLICANT_BATCH_ASSIGN,
                    'entity_type' => 'orientation',
                    'entity_id' => null,
                    'description' =>
                        "{$staff['first_name']} {$staff['last_name']} assigned " .
                        count($applicant_names) .
                        " applicants to batch '{$data['batch']}' for the orientation: {$applicant_list}.",
                    'old_values' => null,
                    'new_values' => [
                        'batch' => $data['batch'],
                        'applicants' => $applicant_names,
                    ],
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
                'message' => "Batch added successfully to {$successCount} applicant(s)",
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

            // Handle data from both FormData and direct JSON
            if (isset($_POST['id'])) {
                // Handle data from FormData
                $data = $_POST; // No need to json_decode if it's directly in $_POST
            } else {
                // Handle direct JSON input
                $data = json_decode(file_get_contents('php://input'), true);
            }

            // file_put_contents('log.txt', json_encode($data) . PHP_EOL, FILE_APPEND);

            if (!$data) {
                throw new \Exception('No data provided');
            }

            $status = $data['status'] ?? null;

            // Process application data
            $model = new OrientationModel();
            $personal = new PersonalModel();

            if ($status === 'pending') {
                if (!$model->updateStatusToPending($data)) {
                    throw new \Exception('Failed to update allowance status');
                }
            } elseif ($status === 'attended') {
                if (!$model->updateStatusToAttended($data)) {
                    throw new \Exception('Failed to update allowance status');
                }

                $data = $personal->getPersonalInformation($data['account_id']);
                $staffId = Auth::id();
                $staff = $this->staffModel->getStaffInfoById($staffId);

                if (
                    !$this->auditLogModel->create([
                        'user_id' => $staffId,
                        'actor' => "{$staff['first_name']} {$staff['last_name']}",
                        'user_role' => 'staff',
                        'action' => Action::ORIENTATION_MARK_ATTENDED,
                        'entity_type' => 'orientation',
                        'entity_id' => null,
                        'description' => "{$staff['first_name']} {$staff['last_name']} marked {$data['first_name']} {$data['last_name']} as attended the orientation.",
                        'old_values' => null,
                        'new_values' => [
                            'applicant' => "{$data['first_name']} {$data['last_name']}",
                        ],
                        'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                    ])
                ) {
                    throw new \Exception('Failed to create audit log');
                }
            } elseif ($status === 'not_attended') {
                if (!$model->updateStatusToNotAttended($data)) {
                    throw new \Exception('Failed to update allowance status');
                }

                $data = $personal->getPersonalInformation($data['account_id']);
                $staffId = Auth::id();
                $staff = $this->staffModel->getStaffInfoById($staffId);

                if (
                    !$this->auditLogModel->create([
                        'user_id' => $staffId,
                        'actor' => "{$staff['first_name']} {$staff['last_name']}",
                        'user_role' => 'staff',
                        'action' => Action::ORIENTATION_MARK_NOT_ATTENDED,
                        'entity_type' => 'orientation',
                        'entity_id' => null,
                        'description' => "{$staff['first_name']} {$staff['last_name']} marked {$data['first_name']} {$data['last_name']} as not attended the orientation.",
                        'old_values' => null,
                        'new_values' => [
                            'applicant' => "{$data['first_name']} {$data['last_name']}",
                        ],
                        'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                    ])
                ) {
                    throw new \Exception('Failed to create audit log');
                }
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Batch added successfully to application_info',
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

    private function handleGet()
    {
        try {
            $criteria = new OrientationModel();
            $application = new ApplicantModel();
            $schoolYearModel = new SchoolYearModel();
            $activeSchoolYear = $schoolYearModel->getActiveSchoolYear();

            // Get ID parameter if it exists
            $id = isset($_GET['batch']) ? $_GET['batch'] : null;
            // $hasScore = isset($_GET['score']) ? $_GET['score'] : null;
            $status = $_GET['status'] ?? null;
            $sort = $_GET['sort'] ?? null;

            $result = [];
            $data = [];

            if ($id == 'all') {
                $result = $criteria->getBatches($status, $sort, $activeSchoolYear);
            } elseif ($id . str_contains($id, 'Batch')) {
                $result = $criteria->getApplicantsByBatch($status, $sort, $id, $activeSchoolYear);
            }

            $data = $application->getApplicantsWithProfile(null, $result, $application);

            if ($result) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data' => $data,
                ]);
            } else {
                echo json_encode([
                    'message' => 'Batch not found',
                    'data' => $data,
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
}

$controller = new OrientationController();
$controller->processRequest();
?>
