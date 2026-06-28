<?php

namespace App\Controllers;

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/ApplicationPeriodModel.php';
require_once __DIR__ . '/../Services/PHPMailerBrevoService.php';
require_once __DIR__ . '/../Middleware/Auth.php';

use App\Constants\Action;
use App\Models\ApplicationModel;
use App\Models\ApplicationPeriodModel;
use App\Models\AuditLogModel;
use App\Models\NotificationsModel;
use App\Models\ScholarModel;
use App\Models\ScholarsModel;
use App\Models\SchoolYearModel;
use App\Models\StaffAccountModel;
use App\Services\PHPMailerBrevoService;
use Config\Database;
use Middleware\Auth;

class ApplicationPeriodController
{
    private const REQUIRED_ENV_VARS = [
        'BREVO_EMAIL',
        'BREVO_SMTP_KEY',
        'ORG_NAME',
        'ORG_ADDRESS',
        'ORG_CONTACT',
    ];

    private \PDO $pdo;
    private $auditLogModel;
    private $staffModel;

    public function __construct()
    {
        // Set JSON content type once, here â€” not at file scope
        header('Content-Type: application/json');

        try {
            $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
            $dotenv->safeLoad();
        } catch (\Exception $e) {
            error_log('[ApplicationPeriodController] Could not load .env: ' . $e->getMessage());
        }

        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->auditLogModel = new AuditLogModel();
        $this->staffModel = new StaffAccountModel();
    }

    public function processRequest(): void
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? '';

        if ($method === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        switch ($method) {
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
                $this->handleDelete();
                break;
            default:
                $this->sendError(405, 'Method not allowed');
        }
    }

    // -------------------------------------------------------------------------
    // GET
    // -------------------------------------------------------------------------

    private function handleGet(): void
    {
        try {
            $applicationPeriod = new ApplicationPeriodModel();

            $id = isset($_GET['id']) ? $this->sanitizeId($_GET['id']) : null;
            $type = isset($_GET['type']) ? trim((string) $_GET['type']) : null;

            if ($id !== null) {
                $result = $applicationPeriod->getApplicationPeriodById($id);

                if (!$result) {
                    $this->sendError(404, 'Application period not found');
                    return;
                }

                $this->sendSuccess(200, ['data' => $result]);
                return;
            }

            $results = match ($type) {
                'new' => $applicationPeriod->getLatestNewApplicationPeriod(),
                'renewal' => $applicationPeriod->getLatestRenewalApplicationPeriod(),
                default => $applicationPeriod->getAllApplicationPeriods(),
            };

            $this->sendSuccess(200, [
                'data' => $results,
                'hasActiveNewApplicationPeriod' => $applicationPeriod->hasActiveNewApplicationPeriod(),
                'hasActiveRenewalApplicationPeriod' => $applicationPeriod->hasActiveRenewalApplicationPeriod(),
            ]);
        } catch (\Exception $e) {
            $this->logAndSendServerError($e);
        }
    }

    private function handlePost(): void
    {
        try {
            $this->assertEnvVars();

            $data = $this->parseJsonBody();

            $application = $data['application'] ?? null;
            if (!$application) {
                $this->sendError(422, 'Missing required field: application');
                return;
            }

            $this->validateApplicationPayload($application);

            $emailService = $this->buildEmailService();

            $this->pdo->beginTransaction();

            $applicationPeriod = new ApplicationPeriodModel();
            $scholarsModel = new ScholarsModel();
            $scholarModel = new ScholarModel();
            $applicationModel = new ApplicationModel();
            $notification = new NotificationsModel();
            $schoolYear = new SchoolYearModel();

            if ($application['type'] === 'renewal') {
                $this->processRenewal(
                    $application,
                    $emailService,
                    $scholarModel,
                    $scholarsModel,
                    $applicationModel,
                    $notification,
                );
            }

            if (!$applicationPeriod->createApplicationPeriod($application)) {
                throw new \RuntimeException('Failed to save application period information');
            }

            if (!$schoolYear->getSchoolYear($application['schoolYear'])) {
                $schoolYear->createSchoolYear($application['schoolYear']);
            }

            $staffId = Auth::id();
            $staff = $this->staffModel->getStaffInfoById($staffId);

            if (
                !$this->auditLogModel->create([
                    'user_id' => $staffId,
                    'actor' => "{$staff['first_name']} {$staff['last_name']}",
                    'user_role' => 'staff',
                    'action' =>
                        $application['type'] === 'new'
                            ? Action::APPLICATION_PERIOD_CREATE
                            : Action::RENEWAL_APPLICATION_PERIOD_CREATE,
                    'entity_type' => 'application_period',
                    'entity_id' => null,
                    'description' => sprintf(
                        '%s %s created %s application period from %s to %s for S.Y. %s.',
                        $staff['first_name'],
                        $staff['last_name'],
                        $application['type'] === 'new' ? 'an' : 'a renewal',
                        $application['startDate'],
                        $application['endDate'],
                        $application['schoolYear'],
                    ),
                    'old_values' => null,
                    'new_values' => [
                        'application_period' => [
                            'start_date' => $application['startDate'],
                            'end_date' => $application['endDate'],
                            'school_year' => $application['schoolYear'],
                            'type' => $application['type'],
                            'status' => $application['status'],
                            'announcement_message' => $application['announcementMessage'],
                        ],
                    ],
                    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                ])
            ) {
                throw new \Exception('Failed to create audit log');
            }

            $this->pdo->commit();

            $this->sendSuccess(201, ['message' => 'Application period created successfully']);
        } catch (\InvalidArgumentException $e) {
            $this->rollbackIfActive();
            $this->sendError(422, $e->getMessage());
        } catch (\RuntimeException $e) {
            $this->rollbackIfActive();
            $this->sendError(400, $e->getMessage());
        } catch (\Exception $e) {
            $this->rollbackIfActive();
            $this->logAndSendServerError($e);
        }
    }

    private function handlePut(): void
    {
        try {
            $data = $this->parseJsonBody();

            $application = $data['application'] ?? null;
            if (!$application) {
                $this->sendError(422, 'Missing required field: application');
                return;
            }

            if (empty($application['id'])) {
                $this->sendError(422, 'ID is required for update');
                return;
            }

            $id = $this->sanitizeId($application['id']);

            $this->validateApplicationPayload($application);

            $this->pdo->beginTransaction();

            $applicationPeriod = new ApplicationPeriodModel();
            $schoolYear = new SchoolYearModel();

            $existing = $applicationPeriod->getApplicationPeriodById($id);
            if (!$existing) {
                $this->sendError(404, 'Application period not found');
                $this->rollbackIfActive();
                return;
            }

            if (!$applicationPeriod->updateApplicationPeriod($id, $application)) {
                throw new \RuntimeException('Failed to update application period information');
            }

            if (!$schoolYear->getSchoolYear($application['schoolYear'])) {
                $schoolYear->createSchoolYear($application['schoolYear']);
            }

            $staffId = Auth::id();
            $staff = $this->staffModel->getStaffInfoById($staffId);

            if (
                !$this->auditLogModel->create([
                    'user_id' => $staffId,
                    'actor' => "{$staff['first_name']} {$staff['last_name']}",
                    'user_role' => 'staff',
                    'action' =>
                        $application['type'] === 'new'
                            ? Action::APPLICATION_PERIOD_UPDATE
                            : Action::RENEWAL_APPLICATION_PERIOD_UPDATE,
                    'entity_type' => 'application_period',
                    'entity_id' => null,
                    'description' => sprintf(
                        '%s %s updated %s application period from %s to %s for S.Y. %s.',
                        $staff['first_name'],
                        $staff['last_name'],
                        $application['type'] === 'new' ? 'an' : 'a renewal',
                        $application['startDate'],
                        $application['endDate'],
                        $application['schoolYear'],
                    ),
                    'old_values' => [
                        'application_period' => [
                            'start_date' => $existing['start_date'],
                            'end_date' => $existing['end_date'],
                            'school_year' => $existing['school_year'],
                            'type' => $existing['type'],
                            'status' => $existing['status'],
                            'announcement_message' => $existing['announcement_message'],
                        ],
                    ],
                    'new_values' => [
                        'application_period' => [
                            'start_date' => $application['startDate'],
                            'end_date' => $application['endDate'],
                            'school_year' => $application['schoolYear'],
                            'type' => $application['type'],
                            'status' => $application['status'],
                            'announcement_message' => $application['announcementMessage'],
                        ],
                    ],
                    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                ])
            ) {
                throw new \Exception('Failed to create audit log');
            }

            $this->pdo->commit();

            $this->sendSuccess(200, ['message' => 'Application period updated successfully']);
        } catch (\InvalidArgumentException $e) {
            $this->rollbackIfActive();
            $this->sendError(422, $e->getMessage());
        } catch (\RuntimeException $e) {
            $this->rollbackIfActive();
            $this->sendError(400, $e->getMessage());
        } catch (\Exception $e) {
            $this->rollbackIfActive();
            $this->logAndSendServerError($e);
        }
    }

    private function handleDelete(): void
    {
        try {
            if (empty($_GET['id'])) {
                $this->sendError(422, 'ID is required');
                return;
            }

            $id = $this->sanitizeId($_GET['id']);

            $this->pdo->beginTransaction();

            $applicationPeriod = new ApplicationPeriodModel();

            $application = $applicationPeriod->getApplicationPeriodById($id);

            if (!$application) {
                $this->sendError(404, 'Application period not found');
                $this->rollbackIfActive();
                return;
            }

            $type = $application['type'] ?? '';
            $start_date = $application['start_date'] ?? '';
            $end_date = $application['end_date'] ?? '';
            $school_year = $application['school_year'] ?? '';

            if (!$applicationPeriod->deleteApplicationPeriod($id)) {
                throw new \RuntimeException('Unable to delete application period');
            }

            $staffId = Auth::id();
            $staff = $this->staffModel->getStaffInfoById($staffId);

            if (
                !$this->auditLogModel->create([
                    'user_id' => $staffId,
                    'actor' => "{$staff['first_name']} {$staff['last_name']}",
                    'user_role' => 'staff',
                    'action' =>
                        $application['type'] === 'new'
                            ? Action::APPLICATION_PERIOD_DELETE
                            : Action::RENEWAL_APPLICATION_PERIOD_DELETE,
                    'entity_type' => 'application_period',
                    'entity_id' => null,

                    'description' => sprintf(
                        '%s %s deleted %s application period from %s to %s for S.Y. %s.',
                        $staff['first_name'],
                        $staff['last_name'],
                        $type === 'new' ? 'an' : 'a renewal',
                        $start_date,
                        $end_date,
                        $school_year,
                    ),

                    'old_values' => null,
                    'new_values' => null,
                    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                ])
            ) {
                throw new \Exception('Failed to create audit log');
            }

            $this->pdo->commit();

            $this->sendSuccess(200, ['message' => 'Application period successfully deleted']);
        } catch (\InvalidArgumentException $e) {
            $this->rollbackIfActive();
            $this->sendError(422, $e->getMessage());
        } catch (\RuntimeException $e) {
            $this->rollbackIfActive();
            $this->sendError(400, $e->getMessage());
        } catch (\Exception $e) {
            $this->rollbackIfActive();
            $this->logAndSendServerError($e);
        }
    }

    private function processRenewal(
        array $application,
        PHPMailerBrevoService $emailService,
        ScholarModel $scholarModel,
        ScholarsModel $scholarsModel,
        ApplicationModel $applicationModel,
        NotificationsModel $notification,
    ): void {
        $scholars = $scholarModel->getAllScholars();
        $emailFailures = [];

        foreach ($scholars as $scholar) {
            if (!$emailService->sendRenewalApplicationEmail($scholar, $application)) {
                $emailFailures[] = $scholar['email'] ?? ($scholar['id'] ?? 'unknown');
            }
        }

        if (!empty($emailFailures)) {
            error_log(
                '[ApplicationPeriodController] Renewal email failures for: ' .
                    implode(', ', $emailFailures),
            );
            // Treat email failures as fatal â€” rollback will occur upstream
            throw new \RuntimeException(
                'Failed to send renewal emails to ' . count($emailFailures) . ' scholar(s)',
            );
        }

        if (!$notification->createRenewalApplicationPeriodNotification($application)) {
            throw new \RuntimeException('Failed to create renewal notification');
        }

        $currentSchoolYear = $application['schoolYear'];

        $prevNewScholars = $applicationModel->getNewScholarsFromPreviousSchoolYear(
            $currentSchoolYear,
        );
        $prevOldScholars = $applicationModel->getOldScholarsFromPreviousSchoolYear(
            $currentSchoolYear,
        );

        foreach ((array) $prevNewScholars as $prevScholar) {
            $scholarsModel->setScholarsAsNotRenewed($prevScholar['application_id']);
        }

        foreach ((array) $prevOldScholars as $prevScholar) {
            $scholarsModel->setScholarsAsNotRenewed($prevScholar['scholar_id']);
        }

        $applicationModel->setApplicationStatusAsNotRenewed();
        $scholarsModel->resetLivingInfoAndTransportInfoSubmission();
    }

    // -------------------------------------------------------------------------
    // Validation helpers
    // -------------------------------------------------------------------------

    /**
     * @throws \InvalidArgumentException
     */
    private function validateApplicationPayload(array $application): void
    {
        $required = ['type', 'schoolYear'];

        foreach ($required as $field) {
            if (empty($application[$field])) {
                throw new \InvalidArgumentException("Missing required application field: {$field}");
            }
        }

        $allowedTypes = ['new', 'renewal'];
        if (!in_array($application['type'], $allowedTypes, true)) {
            throw new \InvalidArgumentException(
                'Invalid application type. Allowed: ' . implode(', ', $allowedTypes),
            );
        }
    }

    private function assertEnvVars(): void
    {
        $missing = [];
        foreach (self::REQUIRED_ENV_VARS as $var) {
            if (empty($_ENV[$var])) {
                $missing[] = $var;
            }
        }

        if (!empty($missing)) {
            error_log('[ApplicationPeriodController] Missing env vars: ' . implode(', ', $missing));
            throw new \RuntimeException(
                'Server configuration error: missing environment variable(s): ' .
                    implode(', ', $missing),
            );
        }
    }

    private function buildEmailService(): PHPMailerBrevoService
    {
        return new PHPMailerBrevoService(
            $_ENV['BREVO_EMAIL'],
            $_ENV['BREVO_SMTP_KEY'],
            $_ENV['ORG_NAME'],
            $_ENV['ORG_ADDRESS'],
            $_ENV['ORG_CONTACT'],
        );
    }

    private function parseJsonBody(): array
    {
        $raw = file_get_contents('php://input');

        if ($raw === false || trim($raw) === '') {
            throw new \InvalidArgumentException('Request body is empty');
        }

        $data = json_decode($raw, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \InvalidArgumentException('Invalid JSON: ' . json_last_error_msg());
        }

        if (!is_array($data)) {
            throw new \InvalidArgumentException('Request body must be a JSON object');
        }

        return $data;
    }

    private function sanitizeId(mixed $raw): int
    {
        $id = filter_var($raw, FILTER_VALIDATE_INT);

        if ($id === false || $id <= 0) {
            throw new \InvalidArgumentException('ID must be a positive integer');
        }

        return $id;
    }

    private function rollbackIfActive(): void
    {
        if ($this->pdo->inTransaction()) {
            $this->pdo->rollBack();
        }
    }

    private function sendSuccess(int $statusCode, array $payload): void
    {
        http_response_code($statusCode);
        echo json_encode(array_merge(['success' => true], $payload));
    }

    private function sendError(int $statusCode, string $message): void
    {
        http_response_code($statusCode);
        echo json_encode(['success' => false, 'message' => $message]);
    }

    private function logAndSendServerError(\Exception $e): void
    {
        error_log(
            '[ApplicationPeriodController] Unhandled exception: ' .
                $e->getMessage() .
                ' in ' .
                $e->getFile() .
                ':' .
                $e->getLine(),
        );
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'An internal server error occurred',
        ]);
    }
}

$controller = new ApplicationPeriodController();
$controller->processRequest();
