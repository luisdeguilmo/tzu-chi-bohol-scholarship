<?php

namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../services/CoeAndGradesService.php';
require_once __DIR__ . '/../models/AuditLogModel.php';

use App\Constants\Action;
use App\Models\AuditLogModel;
use App\Models\CoeGradesModel;
use App\Models\NotificationsModel;
use App\Models\ScholarModel;
use App\Services\CoeAndGradesService;
use Config\Database;
use Middleware\Auth;

class CoeAndGradesController
{
    private $pdo;
    private $coeGradesService;
    private $scholarModel;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->coeGradesService = new CoeAndGradesService($this->pdo);
        $this->scholarModel = new ScholarModel();
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
                $this->createSubmission();
                break;
            case 'PUT':
                $this->updateSubmission();
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

    public function createSubmission()
    {
        // $requiredEnvVars = [
        //     'BREVO_EMAIL',
        //     'BREVO_SMTP_KEY',
        //     'ORG_NAME',
        //     'ORG_ADDRESS',
        //     'ORG_CONTACT',
        // ];

        // foreach ($requiredEnvVars as $var) {
        //     if (empty($_ENV[$var])) {
        //         http_response_code(500);
        //         echo json_encode([
        //             'success' => false,
        //             'message' => "Missing required environment variable: $var",
        //         ]);
        //         return;
        //     }
        // }

        // $emailService = new PHPMailerBrevoService(
        //     $_ENV['BREVO_EMAIL'],
        //     $_ENV['BREVO_SMTP_KEY'],
        //     $_ENV['ORG_NAME'],
        //     $_ENV['ORG_ADDRESS'],
        //     $_ENV['ORG_CONTACT'],
        // );

        try {
            $this->pdo->beginTransaction();

            $coeGradesModel = new CoeGradesModel();
            $notificationModel = new NotificationsModel();
            $auditLogModel = new AuditLogModel();

            // Parse input data
            $data = $this->parseInputData();

            if (!$data || !isset($data['submission'])) {
                throw new \Exception('No submission data provided');
            }

            // // Extract files
            $files = $_FILES['files'] ?? null;
            $base64Files = $data['uploaded_files'] ?? null;

            $scholarId = Auth::id();

            $scholar = $this->scholarModel->getScholarById($scholarId);

            // if (!$emailService->sendCoeGradesSubmitted($scholar)) {
            //     throw new \Exception('Failed to send email');
            // }

            if ($coeGradesModel->checkSubmission($data['submission'], $scholarId)) {
                $this->sendResponse(201, [
                    'success' => false,
                    'message' =>
                        'You already submitted your Certificate of Enrollment and grades for this semester.',
                ]);
                exit();
            }

            // Create submission with files
            $id = $this->coeGradesService->createSubmissionWithFiles(
                $data['submission'],
                $scholarId,
                $files,
                $base64Files,
            );

            if (
                !$auditLogModel->create([
                    'user_id' => $scholarId,
                    'actor' => "{$scholar['first_name']} {$scholar['last_name']}",
                    'user_role' => 'scholar',
                    'action' => Action::DOCUMENT_SUBMITTED,
                    'entity_type' => 'document',
                    'entity_id' => $id,

                    'description' =>
                        $scholar['first_name'] .
                        ' ' .
                        $scholar['last_name'] .
                        ' submitted Certificate of Enrollment and Grades.',

                    'old_values' => null,
                    'new_values' => ['status' => 'submitted'],
                    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                ])
            ) {
                throw new \Exception('Failed to create audit log');
            }

            if (!$notificationModel->createNotificationForSubmittedCoeGrades($scholar)) {
                throw new \Exception('Failed to create notification');
            }

            $this->pdo->commit();

            $this->sendResponse(201, [
                'success' => true,
                'message' => 'COE and grades submitted successfully',
            ]);
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            $this->sendResponse(400, [
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function updateSubmission()
    {
        $this->pdo->beginTransaction();

        try {
            // Parse input data
            $data = $this->parseInputData();

            if (!$data || !isset($data['submission'])) {
                throw new \Exception('No submission data provided');
            }

            $coeGradesModel = new CoeGradesModel();
            $auditLogModel = new AuditLogModel();

            // Extract files
            $files = $_FILES['files'] ?? null;
            $base64Files = $data['uploaded_files'] ?? null;

            $scholarId = Auth::id();

            $scholar = $this->scholarModel->getScholarById($scholarId);

            if (
                $coeGradesModel->checkSubmission($data['submission'], $scholarId) &&
                $data['submission']['semester'] !== $data['submission']['current_semester']
            ) {
                $this->sendResponse(201, [
                    'success' => false,
                    'message' =>
                        'You already submitted your Certificate of Enrollment and grades for this semester.',
                ]);
                exit();
            }

            // Update submission with files
            $id = $this->coeGradesService->updateSubmissionWithFiles(
                $scholarId,
                $data['submission'],
                $data['existing_files'],
                $data['removed_files'],
                $files,
                $base64Files,
            );

            if (
                !$auditLogModel->create([
                    'user_id' => $scholarId,
                    'actor' => "{$scholar['first_name']} {$scholar['last_name']}",
                    'user_role' => 'scholar',
                    'action' => Action::DOCUMENT_UPDATED,
                    'entity_type' => 'document',
                    'entity_id' => $id,

                    'description' =>
                        $scholar['first_name'] .
                        ' ' .
                        $scholar['last_name'] .
                        ' updated and submitted Certificate of Enrollment and Grades.',

                    'old_values' => null,
                    'new_values' => ['status' => 'updated'],
                    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                ])
            ) {
                throw new \Exception('Failed to create audit log');
            }

            $this->pdo->commit();

            $this->sendResponse(201, [
                'success' => true,
                'message' => 'COE and grades updated successfully',
                // 'submission_id' => $id,
            ]);
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            $this->sendResponse(400, [
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function parseInputData()
    {
        if (isset($_POST['submissionData'])) {
            return json_decode($_POST['submissionData'], true);
        }

        return json_decode(file_get_contents('php://input'), true);
    }

    private function sendResponse($statusCode, $data)
    {
        http_response_code($statusCode);
        echo json_encode($data);
    }

    private function handleGet()
    {
        try {
            $coeGradesModel = new CoeGradesModel();

            // Get ID parameter if it exists
            $id = null;
            $auth_id = Auth::id();
            $scholar_id = $_GET['scholar_id'];
            $tab = $_GET['tab'] ?? null;
            $year_level = $_GET['year_level'] ?? null;

            if ($coeGradesModel->getCoeGradesById($auth_id)) {
                $id = $auth_id;
            } else {
                $id = $scholar_id;
            }

            $result = [];
            $submissions = [];

            if ($tab === 'all') {
                $submissions = $coeGradesModel->getAllCoeAndGradesByScholarId(
                    $id,
                    $tab,
                    $year_level,
                );
            } elseif ($tab === 'this_school_year') {
                $submissions = $coeGradesModel->getAllCoeAndGradesByScholarId(
                    $id,
                    $tab,
                    $year_level,
                );
            } elseif ($tab === 'past') {
                $submissions = $coeGradesModel->getAllCoeAndGradesByScholarId(
                    $id,
                    $tab,
                    $year_level,
                );
            }

            $result = $coeGradesModel->getAllCoeAndGradesWithFiles($submissions, $coeGradesModel);

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
}

$controller = new CoeAndGradesController();
$controller->processRequest();
?>
