<?php

namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Services/FileUploadService.php';
require_once __DIR__ . '/../Services/ActivityService.php';
require_once __DIR__ . '/../Models/ActivityModel.php';
require_once __DIR__ . '/../Models/CertificateOfAppearanceModel.php';
require_once __DIR__ . '/../Services/PHPMailerBrevoService.php'; // Add this line

// Load environment variables
try {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
    $dotenv->safeLoad();
} catch (\Exception $e) {
    error_log('Could not load .env file: ' . $e->getMessage());
}

use App\Constants\Action;
use App\Models\ActivityModel;
use App\Models\AuditLogModel;
use App\Models\CertificateOfAppearanceModel;
use App\Models\NotificationsModel;
use App\Models\ScholarModel;
use App\Services\ActivityService;
use App\Services\PHPMailerBrevoService;
use Config\Database;
use App\Middleware\Auth;

class ActivityController
{
    private $pdo;
    private $activityService;
    private $scholarModel;
    private $notificationModel;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->activityService = new ActivityService($this->pdo);
        $this->notificationModel = new NotificationsModel();
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
                $this->createActivity();
                break;
            case 'PUT':
                $this->updateActivity();
                break;
            default:
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
                break;
        }
    }

    public function createActivity()
    {
        $requiredEnvVars = [
            'BREVO_API_KEY',
            'BREVO_SENDER_EMAIL',
            'ORG_NAME',
            'ORG_ADDRESS',
            'ORG_CONTACT',
        ];

        foreach ($requiredEnvVars as $var) {
            if (empty($_ENV[$var])) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => "Missing required environment variable: $var",
                ]);
                return;
            }
        }

        $emailService = new PHPMailerBrevoService(
            $_ENV['BREVO_API_KEY'],
            $_ENV['BREVO_SENDER_EMAIL'],
            $_ENV['ORG_NAME'],
            $_ENV['ORG_ADDRESS'],
            $_ENV['ORG_CONTACT'],
        );

        try {
            $this->pdo->beginTransaction();

            // Parse input data
            $data = $this->parseInputData();

            $auditLogModel = new AuditLogModel();

            if (!$data || !isset($data['activity'])) {
                throw new \Exception('No activity data provided');
            }

            // Extract files
            $files = $_FILES['files'] ?? null;
            $base64Files = $data['uploaded_files'] ?? null;

            $scholarId = Auth::id();
            $scholar = $this->scholarModel->getScholarById($scholarId);

            if (!$emailService->sendCommunityServiceSubmitted($scholar)) {
                throw new \Exception('Failed to send email');
            }

            // Create activity with files
            $activityId = $this->activityService->createActivityWithFiles(
                $scholarId,
                $data['activity'],
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
                    'entity_id' => $activityId,

                    'description' =>
                        $scholar['first_name'] .
                        ' ' .
                        $scholar['last_name'] .
                        ' submitted community service report.',

                    'old_values' => null,
                    'new_values' => ['status' => 'submitted'],
                    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                ])
            ) {
                throw new \Exception('Failed to create audit log');
            }

            if (
                !$this->notificationModel->createNotificationForSubmittedCommunityService($scholar)
            ) {
                throw new \Exception('Failed to create notification');
            }

            $this->pdo->commit();

            $this->sendResponse(201, [
                'success' => true,
                'message' => 'Activity created successfully',
                'activity_id' => $activityId,
            ]);
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            $this->sendResponse(400, [
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function updateActivity()
    {
        $this->pdo->beginTransaction();

        try {
            // Parse input data
            $data = $this->parseInputData();

            $auditLogModel = new AuditLogModel();

            if (!$data || !isset($data['activity'])) {
                throw new \Exception('No activity data provided');
            }

            // Extract files
            $files = $_FILES['files'] ?? null;
            $base64Files = $data['uploaded_files'] ?? null;

            $scholarId = Auth::id();
            $scholar = $this->scholarModel->getScholarById($scholarId);

            // Create activity with files
            $activity = $this->activityService->updateActivityWithFiles(
                $scholarId,
                $data['activity'],
                $data['existing_files'],
                $data['existing_files_removed'],
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
                    'entity_id' => $activity['activity_id'],

                    'description' =>
                        $scholar['first_name'] .
                        ' ' .
                        $scholar['last_name'] .
                        ' updated and submitted ' .
                        "{$activity['activity_name']}.",

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
                'message' => 'Activity created successfully',
                // 'activity_id' => $activityId,
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
        if (isset($_POST['activityData'])) {
            return json_decode($_POST['activityData'], true);
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
            $activityModel = new ActivityModel();

            // Get ID parameter if it exists
            $id = Auth::id();
            $tab = $_GET['tab'] ?? null;

            $activities = [];

            if ($tab === 'all') {
                $activities = $activityModel->getAllVolunteerActivitiesByScholarId($id, $tab);
            } elseif ($tab === 'this_month') {
                $activities = $activityModel->getAllVolunteerActivitiesByScholarId($id, $tab);
            } elseif ($tab === 'past') {
                $activities = $activityModel->getAllVolunteerActivitiesByScholarId($id, $tab);
            }

            $result = $activityModel->getAllActivitiesWithFiles($activities, $activityModel);

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

$controller = new ActivityController();
$controller->processRequest();
?>
