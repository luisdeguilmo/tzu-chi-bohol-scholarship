<?php
namespace App\Controllers;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';

use App\Models\ApplicantModel;
use App\Models\SettingsModel;
use Config\Database;

class SettingsController
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
                // $this->handlePost();
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

    public function handleGet()
    {
        try {
            $this->pdo->beginTransaction();

            $settings = new SettingsModel();

            $passingScore = $settings->getPassingScore();

            $this->pdo->commit();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'passingScore' => $passingScore,
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

    private function handlePut()
    {
        try {
            // Clear any previous output
            ob_clean();

            $this->pdo->beginTransaction();

            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                throw new \Exception('No data provided or invalid JSON');
            }

            $settings = new SettingsModel();
            $applicantModel = new ApplicantModel();
            $settings = new SettingsModel();

            if (!$settings->createPassingScore($data)) {
                throw new \Exception('Failed to save score information');
            }

            $passingScore = $settings->getPassingScore();
            $applicants = $applicantModel->getApplicantsWhoTookExam();

            foreach ($applicants as $applicant) {
                if ($applicant['score'] >= $passingScore) {
                    if (!$applicantModel->updateStatusToExamPassed($applicant['application_id'])) {
                        throw new \Exception('Failed to update status');
                    }
                } else {
                    if (!$applicantModel->updateStatusToExamFailed($applicant['application_id'])) {
                        throw new \Exception('Failed to update status');
                    }
                }
            }

            $this->pdo->commit();

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Passing score set successfully',
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

$controller = new SettingsController();
$controller->processRequest();
?>
