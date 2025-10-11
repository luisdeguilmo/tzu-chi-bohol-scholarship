<?php
namespace App\Controllers;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/ApplicantModel.php';
require_once __DIR__ . '/../Services/PHPMailerBrevoService.php'; // Add this line

// Load environment variables
try {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
    $dotenv->safeLoad();
} catch (\Exception $e) {
    error_log('Could not load .env file: ' . $e->getMessage());
}

use App\Models\ApplicantModel;
use App\Models\BatchModel;
use App\Services\PHPMailerBrevoService; // Update this line
use Config\Database;

class ApplicationManagementController
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
            case 'PUT':
                $this->handlePut();
                break;
            default:
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
                break;
        }
    }

    private function handlePut()
    {
        // Validate required environment variables
        $requiredEnvVars = [
            'BREVO_EMAIL',
            'BREVO_SMTP_KEY',
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
            $_ENV['BREVO_EMAIL'],
            $_ENV['BREVO_SMTP_KEY'],
            $_ENV['ORG_NAME'],
            $_ENV['ORG_ADDRESS'],
            $_ENV['ORG_CONTACT'],
        );

        try {
            $this->pdo->beginTransaction();

            $action = $_GET['action'] ?? null;
            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // if (empty($data['application_id'])) {
            //     throw new \Exception('Application ID is required');
            // }

            if (
                !in_array($action, [
                    'approve',
                    'reject',
                    'send_schedule',
                    'examination_passed',
                    'examination_failed',
                    'interview_passed',
                    'interview_failed',
                    'home_visitation_passed',
                    'home_visitation_failed',
                    'final_interview_passed',
                    'final_interview_failed',
                ])
            ) {
                throw new \Exception(
                    'Invalid action. Must be either "approve", "reject", "send_schedule", "examination_passed", or "examination_failed", "interview_passed", "interview_failed"',
                );
            }

            $applicant = new ApplicantModel();

            if ($action === 'approve') {
                if (!$emailService->sendApplicationApprovalEmail($data)) {
                    throw new \Exception('Application approved but failed to send approval email');
                }

                if (!$applicant->approveApplication($data)) {
                    throw new \Exception('Failed to approve application');
                }
            } elseif ($action === 'reject') {
                if (!$emailService->sendApplicationRejectionEmail($data)) {
                    throw new \Exception('Application rejected but failed to send rejection email');
                }

                if (!$applicant->rejectApplication($data)) {
                    throw new \Exception('Failed to reject application');
                }
            } elseif ($action === 'send_schedule') {
                foreach ($data['applicants'] as $applicant) {
                    if (
                        !$emailService->sendExaminationScheduleEmail(
                            $applicant,
                            $data['batch'],
                            $data['date'],
                            $data['time'],
                            $data['venue'],
                        )
                    ) {
                        throw new \Exception('Failed to send examination schedule email');
                    }
                }

                $batchModel = new BatchModel();

                if (!$batchModel->updateBatch($data['batch_id'])) {
                    throw new \Exception('Failed to update');
                }
            } elseif ($action === 'examination_passed') {
                foreach ($data['applicants'] as $applicant) {
                    if (!$emailService->sendExaminationPassedEmail($applicant)) {
                        throw new \Exception('Failed to send email');
                    }
                }
            } elseif ($action === 'examination_failed') {
                foreach ($data['applicants'] as $applicant) {
                    if (!$emailService->sendExaminationFailedEmail($applicant)) {
                        throw new \Exception('Failed to send email');
                    }
                }
            } elseif ($action === 'interview_passed') {
                if (!$emailService->sendInitialInterviewPassedEmail($data)) {
                    throw new \Exception('Failed to send email');
                }

                if (!$applicant->updateStatusToInitialInterviewPassed($data['application_id'])) {
                    throw new \Exception('Failed to update status');
                }
            } elseif ($action === 'interview_failed') {
                if (!$emailService->sendInitialInterviewFailedEmail($data)) {
                    throw new \Exception('Failed to send email');
                }

                if (!$applicant->updateStatusToInitialInterviewFailed($data['application_id'])) {
                    throw new \Exception('Failed to update status');
                }
            } elseif ($action === 'home_visitation_passed') {
                if (!$emailService->sendHomeVisitationPassedEmail($data)) {
                    throw new \Exception('Failed to send email');
                }

                if (!$applicant->updateStatusToHomeVisitationPassed($data['application_id'])) {
                    throw new \Exception('Failed to update status');
                }
            } elseif ($action === 'home_visitation_failed') {
                if (!$emailService->sendHomeVisitationFailedEmail($data)) {
                    throw new \Exception('Failed to send email');
                }

                if (!$applicant->updateStatusToHomeVisitationFailed($data['application_id'])) {
                    throw new \Exception('Failed to update status');
                }
            } elseif ($action === 'final_interview_passed') {
                if (!$emailService->sendFinalInterviewPassedEmail($data)) {
                    throw new \Exception('Failed to send email');
                }

                if (!$applicant->updateStatusToFinalInterviewPassed($data['application_id'])) {
                    throw new \Exception('Failed to update status');
                }
            } elseif ($action === 'final_interview_failed') {
                if (!$emailService->sendFinalInterviewFailedEmail($data)) {
                    throw new \Exception('Failed to send email');
                }

                if (!$applicant->updateStatusToFinalInterviewPassed($data['application_id'])) {
                    throw new \Exception('Failed to update status');
                }
            }

            $this->pdo->commit();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' =>
                    'Application ' . $action . 'd successfully and notification email sent',
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

$controller = new ApplicationManagementController();
$controller->processRequest();
?>
