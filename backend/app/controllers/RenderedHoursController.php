<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/RenderedHoursModel.php';
require_once __DIR__ . '/../Models/ActivityModel.php';
require_once __DIR__ . '/../Services/PHPMailerBrevoService.php'; // Add this line

// Load environment variables
try {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
    $dotenv->safeLoad();
} catch (\Exception $e) {
    error_log('Could not load .env file: ' . $e->getMessage());
}

use App\Models\ActivityModel;
use App\Models\EventParticipantsModel;
use App\Models\NotificationsModel;
use App\Models\RecentActivityModel;
use Config\Database;
use App\Models\RenderedHoursModel;
use App\Models\ScholarModel;
use App\Services\PHPMailerBrevoService;

class RenderedHoursController
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function ProcessRequest()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        $requestMethod = $_SERVER['REQUEST_METHOD'];

        switch ($requestMethod) {
            case 'PUT':
                $this->handlePut();
                break;

            case 'GET':
                $this->handleGet();
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

            $renderedHours = new RenderedHoursModel();
            $scholarId = isset($_GET['account_id']) ? (int) $_GET['account_id'] : null;

            if ($scholarId && !$renderedHours->getScholarById($scholarId)) {
                throw new \Exception('Scholar not found');
            }

            if ($scholarId) {
                $hours = $renderedHours->getScholarRenderedHoursById($scholarId);
            }

            $this->pdo->commit();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'renderedHours' => $hours,
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

    public function handlePut()
    {
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

            $data = json_decode(file_get_contents('php://input'), true);
            $dutyType = $_GET['duty_type'] ?? null;
            $action = $_GET['action'] ?? null;

            if (!$data) {
                throw new \Exception('No data provided');
            }

            $renderedHours = new RenderedHoursModel();
            $activity = new ActivityModel();
            $scholar = new EventParticipantsModel();
            $notification = new NotificationsModel();
            $recentActivity = new RecentActivityModel();
            $scholarModel = new ScholarModel();

            $account_id = $data['account_id'];

            if ($dutyType === 'community_service') {
                if ($action === 'approve') {
                    $scholarInfo = $scholarModel->getScholarById($data['account_id']);

                    // if (!$emailService->sendActivityRecordedEmail($scholarInfo, $data)) {
                    //     throw new \Exception('Failed to send email');
                    // }

                    if (
                        !$renderedHours->recordCommunityServiceRenderedHours(
                            $data['account_id'],
                            $data['rendered_hours'],
                        )
                    ) {
                        throw new \Exception('Failed to record hours');
                    }

                    if (!$renderedHours->recordHours($data['account_id'])) {
                        throw new \Exception('Failed to record hours');
                    }

                    if (!$renderedHours->addCommunityServiceEntry($data)) {
                        throw new \Exception('Failed to add community service hours');
                    }

                    $activity->updateActivityStatus($data);
                    $notification->createActivityNotification($data);
                    $recentActivity->createRecentCommunityService($data);
                } elseif ($action === 'reject') {
                    $scholarInfo = $scholarModel->getScholarById($data['account_id']);
                    $activityRenderedHours = $activity->getRenderedHoursById($data['id']);

                    // if (!$emailService->sendActivityRecordedEmail($scholarInfo, $data)) {
                    //     throw new \Exception('Failed to send email');
                    // }

                    if (
                        !$renderedHours->revokeRecordedCommunityServiceRenderedHours(
                            $data['account_id'],
                            $activityRenderedHours,
                        )
                    ) {
                        throw new \Exception('Failed to record hours');
                    }

                    $activity->revertRenderedHours($data['id']);

                    if (!$renderedHours->recordHours($data['account_id'])) {
                        throw new \Exception('Failed to record hours');
                    }

                    $activity->markAsNotRecordedWithFeedback($data);
                    $notification->createActivityNotification($data);
                    $recentActivity->removeRecentActivityById($data['id']);
                    $renderedHours->removeCommunityServiceEntry($data['id']);
                }
            } elseif ($dutyType === 'event') {
                foreach ($data['selected_scholars'] as $scholarId) {
                    if (
                        !$renderedHours->recordEventRenderedHours(
                            $scholarId,
                            $data['rendered_hours'],
                        )
                    ) {
                        throw new \Exception('Failed to record hours');
                    }

                    if (!$renderedHours->recordHours($scholarId, $data['rendered_hours'])) {
                        throw new \Exception('Failed to record hours');
                    }

                    if (!$renderedHours->recordHours($scholarId)) {
                        throw new \Exception('Failed to record hours');
                    }

                    if (!$renderedHours->AttendedEvents($scholarId)) {
                        throw new \Exception('Failed to record hours');
                    }

                    $recentActivity->createRecentEvent($scholarId, $data);

                    $scholar->setScholarAsAttended($data['event_id'], $scholarId);
                }
            }

            $this->pdo->commit();

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Recorded successfully',
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

$controller = new RenderedHoursController();
$controller->ProcessRequest();

?>
