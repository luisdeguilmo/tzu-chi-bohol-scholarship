<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/BatchModel.php';

use App\Constants\Action;
use App\Models\AuditLogModel;
use App\Models\EducationModel;
use App\Models\ScholarModel;
use App\Models\ScholarsModel;
use App\Models\SchoolTransportInfoModel;
use Config\Database;
use Middleware\Auth;

class SchoolTransportInfoController
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
            default:
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
                break;
        }
    }

    private function handleGet()
    {
        try {
            $model = new SchoolTransportInfoModel();

            // Get ID parameter if it exists
            $id = Auth::id();

            $results = $model->getTransportInfoById($id);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $results,
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

            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                throw new \Exception('No data provided or invalid JSON');
            }

            $transportModel = new SchoolTransportInfoModel();
            $scholarsModel = new ScholarsModel();
            $educationModel = new EducationModel();
            $scholarId = Auth::id();

            $isExist = $transportModel->checkTransportInfoRecord($scholarId);

            if ($isExist) {
                if (!$transportModel->update($data, $scholarId)) {
                    throw new \Exception('Failed to update school transport information');
                }
            } else {
                if (!$transportModel->create($data, $scholarId)) {
                    throw new \Exception('Failed to save school transport information');
                }

                if (!$educationModel->updateSchoolAndCourse($data, $scholarId)) {
                    throw new \Exception('Failed to update school and course');
                }
            }

            $scholarModel = new ScholarModel();
            $scholarsModel->setIsSubmittedTransportInfo($scholarId);
            $scholar = $scholarModel->getScholarById($scholarId);
            $auditLogModel = new AuditLogModel();

            if (
                !$auditLogModel->create([
                    'user_id' => $scholarId,
                    'actor' => "{$scholar['first_name']} {$scholar['last_name']}",
                    'user_role' => 'scholar',
                    'action' => Action::FORM_SUBMITTED,
                    'entity_type' => 'form',
                    'entity_id' => null,

                    'description' =>
                        $scholar['first_name'] .
                        ' ' .
                        $scholar['last_name'] .
                        ' submitted scholar information form.',

                    'old_values' => null,
                    'new_values' => ['status' => 'submitted'],
                    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                ])
            ) {
                throw new \Exception('Failed to create audit log');
            }

            $this->pdo->commit();

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'School transport information created successfully',
            ]);
        } catch (\Exception $e) {
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

$controller = new SchoolTransportInfoController();
$controller->processRequest();
?>
