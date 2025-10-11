<?php
namespace App\Controllers;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';

use App\Models\ApplicantModel;
use App\Models\AwardingModel;
use App\Models\OrientationModel;
use Config\Database;

class AwardingController
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
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
                // $this->handleDelete();
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

            file_put_contents('log.txt', json_encode($data) . PHP_EOL, FILE_APPEND);

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Check if we have applicantIds and batch
            if (!isset($data['applicantIds']) || !isset($data['batch'])) {
                throw new \Exception('Missing required fields: applicantIds or batch');
            }

            // Process multiple applicants
            $applicationInfo = new OrientationModel();
            $successCount = 0;

            foreach ($data['applicantIds'] as $applicantId) {
                if ($applicationInfo->assignApplicants($applicantId, $data['batch'])) {
                    $successCount++;
                }
            }

            if ($successCount === 0) {
                throw new \Exception('Failed to add batch information to any applicant');
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

            if (!$data) {
                throw new \Exception('No data provided');
            }

            $status = $data['status'] ?? null;

            // Process application data
            $model = new AwardingModel();

            if ($status === 'pending') {
                if (!$model->updateStatusToPending($data)) {
                    throw new \Exception('Failed to update allowance status');
                }
            } elseif ($status === 'attended') {
                if (!$model->updateStatusToAttended($data)) {
                    throw new \Exception('Failed to update allowance status');
                }
            } elseif ($status === 'not_attended') {
                if (!$model->updateStatusToNotAttended($data)) {
                    throw new \Exception('Failed to update allowance status');
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
            $model = new AwardingModel();

            // Get ID parameter if it exists
            $status = $_GET['status'] ?? null;
            $sort = $_GET['sort'] ?? null;

            $result = [];

            $result = $model->getApplicants($status, $sort);

            if ($result) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data' => $result,
                ]);
            } else {
                echo json_encode([
                    'message' => 'Batch not found',
                    'data' => $result,
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

$controller = new AwardingController();
$controller->processRequest();
?>
