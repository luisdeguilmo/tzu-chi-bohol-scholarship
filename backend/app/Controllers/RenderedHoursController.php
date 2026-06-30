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

use App\Constants\Action;
use App\Models\ActivityModel;
use App\Models\ApplicationModel;
use App\Models\AuditLogModel;
use App\Models\EventParticipantsModel;
use App\Models\NotificationsModel;
use App\Models\RecentActivityModel;
use App\Models\RenderedHoursHistoryModel;
use Config\Database;
use App\Models\RenderedHoursModel;
use App\Models\ScholarModel;
use App\Models\StaffAccountModel;
use App\Services\PHPMailerBrevoService;
use App\Middleware\Auth;

class RenderedHoursController
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
            case 'PATCH':
                $this->handlePatch();
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

            $hours = null;
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
            $_ENV['BREVO_API_KEY'],
            $_ENV['BREVO_SENDER_EMAIL'],
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
            $hoursModel = new RenderedHoursHistoryModel();

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

                    $hoursModel->createHistory([
                        'account_id' => $data['account_id'],
                        'transaction_type' => 'add',
                        'event_name' => $data['activity_name'],
                        'source_type' => 'duty',
                        'hours' => $data['rendered_hours'],
                    ]);

                    $staffId = Auth::id();
                    $staff = $this->staffModel->getStaffInfoById($staffId);

                    if (
                        !$this->auditLogModel->create([
                            'user_id' => $staffId,
                            'actor' => "{$staff['first_name']} {$staff['last_name']}",
                            'user_role' => 'staff',
                            'action' => Action::RECORD_RENDERED_HOURS,
                            'entity_type' => 'community service',
                            'entity_id' => null,
                            'description' => "{$staff['first_name']} {$staff['last_name']} recorded {$scholarInfo['first_name']} {$scholarInfo['last_name']}'s community service hours for '{$data['activity_name']}'.",
                            'old_values' => null,
                            'new_values' => [
                                'activity_name' => $data['activity_name'],
                                'activity_date' => $data['activity_date'],
                                'scholar' =>
                                    $scholarInfo['first_name'] . ' ' . $scholarInfo['last_name'],
                                'rendered_hours' => $data['rendered_hours'],
                            ],
                            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                        ])
                    ) {
                        throw new \Exception('Failed to create audit log');
                    }
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

                    $staffId = Auth::id();
                    $staff = $this->staffModel->getStaffInfoById($staffId);

                    if (
                        !$this->auditLogModel->create([
                            'user_id' => $staffId,
                            'actor' => "{$staff['first_name']} {$staff['last_name']}",
                            'user_role' => 'staff',
                            'action' => Action::REJECT_SUBMISSION,
                            'entity_type' => 'community service',
                            'entity_id' => null,
                            'description' => "{$staff['first_name']} {$staff['last_name']} rejected {$scholarInfo['first_name']} {$scholarInfo['last_name']}'s community service submission for '{$data['activity_name']}' due to the following: {$data['feedback']}.",
                            'old_values' => null,
                            'new_values' => [
                                'activity_name' => $data['activity_name'],
                                'activity_date' => $data['activity_date'],
                                'scholar' =>
                                    $scholarInfo['first_name'] . ' ' . $scholarInfo['last_name'],
                                'rendered_hours' => $data['rendered_hours'],
                            ],
                            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                        ])
                    ) {
                        throw new \Exception('Failed to create audit log');
                    }
                }
            } elseif ($dutyType === 'event') {
                $scholarNames = [];
                $scholarModel = new ScholarModel();

                foreach ($data['selected_scholars'] as $scholarId) {
                    if (
                        !$renderedHours->recordEventRenderedHours(
                            $scholarId,
                            $data['rendered_hours'],
                        )
                    ) {
                        throw new \Exception('Failed to record hours');
                    }

                    // if (!$renderedHours->recordHours($scholarId, $data['rendered_hours'])) {
                    //     throw new \Exception('Failed to record hours');
                    // }

                    if (!$renderedHours->recordHours($scholarId)) {
                        throw new \Exception('Failed to record hours');
                    }

                    if (!$renderedHours->AttendedEvents($scholarId)) {
                        throw new \Exception('Failed to record hours');
                    }

                    $recentActivity->createRecentEvent($scholarId, $data);

                    $scholar->setScholarAsAttended($data['event_id'], $scholarId);

                    $name = $scholarModel->getScholarById($scholarId);
                    $scholarNames[] = "{$name['first_name']} {$name['last_name']}";

                    $hoursModel->createHistory([
                        'account_id' => $scholarId,
                        'transaction_type' => 'add',
                        'event_name' => $data['event_name'],
                        'source_type' => 'event',
                        'hours' => $data['rendered_hours'],
                    ]);
                }

                // $scholarNames = $data['selected_scholars']->pluck('name')->implode(', ');

                $staffId = Auth::id();
                $staff = $this->staffModel->getStaffInfoById($staffId);
                $scholarList = implode(', ', $scholarNames);

                if (
                    !$this->auditLogModel->create([
                        'user_id' => $staffId,
                        'actor' => "{$staff['first_name']} {$staff['last_name']}",
                        'user_role' => 'staff',
                        'action' => Action::RECORD_RENDERED_HOURS,
                        'entity_type' => 'event',
                        'entity_id' => null,
                        'description' =>
                            "{$staff['first_name']} {$staff['last_name']} recorded rendered hours for event '{$data['event_name']}' for " .
                            count($scholarNames) .
                            " scholar(s): {$scholarList}. Hours: {$data['rendered_hours']}.",
                        'old_values' => null,
                        'new_values' => [
                            'event_name' => $data['event_name'],
                            'event_date' => $data['event_date'],
                            'scholars' => $scholarNames,
                            'rendered_hours' => $data['rendered_hours'],
                        ],
                        'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                    ])
                ) {
                    throw new \Exception('Failed to create audit log');
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

    public function handlePatch()
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
            $_ENV['BREVO_API_KEY'],
            $_ENV['BREVO_SENDER_EMAIL'],
            $_ENV['ORG_NAME'],
            $_ENV['ORG_ADDRESS'],
            $_ENV['ORG_CONTACT'],
        );

        try {
            $this->pdo->beginTransaction();

            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                throw new \Exception('No data provided');
            }

            $renderedHours = new RenderedHoursModel();
            $notification = new NotificationsModel();
            $hoursModel = new RenderedHoursHistoryModel();
            $applicationModel = new ApplicationModel();

            $account_id = $data['account_id'];
            $initial_rendered_hours = $data['initial_rendered_hours'];

            if (!$renderedHours->setInitialRenderedHours($account_id, $initial_rendered_hours)) {
                throw new \Exception('Failed to set initial rendered hours');
            }

            $applicationModel->setIsMigrationCompleted($account_id);

            if ($initial_rendered_hours > 0) {
                $hoursModel->createHistory([
                    'account_id' => $account_id,
                    'transaction_type' => 'initial',
                    'event_name' => 'Initial Rendered Hours',
                    'source_type' => 'rendered_hours',
                    'hours' => $initial_rendered_hours,
                ]);
            }

            $this->pdo->commit();

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Initial rendered hours added successfully',
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
