<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/ApplicationPeriodModel.php';
require_once __DIR__ . '/../Services/PHPMailerBrevoService.php'; // Add this line

// Load environment variables
try {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
    $dotenv->safeLoad();
} catch (\Exception $e) {
    error_log('Could not load .env file: ' . $e->getMessage());
}

use App\Models\ApplicationModel;
use App\Models\ApplicationPeriodModel;
use App\Models\NotificationsModel;
use App\Models\ScholarModel;
use App\Models\ScholarsModel;
use App\Models\SchoolYearModel;
use App\Services\PHPMailerBrevoService;
use Config\Database;
class ApplicationPeriodController
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
                $this->handleDelete();
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
            $applicationPeriod = new ApplicationPeriodModel();

            // Get ID parameter if it exists
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            $type = $_GET['type'] ?? null;

            if ($id) {
                // Get specific application period
                $result = $applicationPeriod->getApplicationPeriodById($id);

                if ($result) {
                    http_response_code(200);
                    echo json_encode([
                        'success' => true,
                        'data' => $result,
                    ]);
                } else {
                    http_response_code(404);
                    echo json_encode([
                        'success' => false,
                        'message' => 'Application period not found',
                    ]);
                }
            } else {
                $results = null;

                if ($type === 'new') {
                    $results = $applicationPeriod->getLatestNewApplicationPeriod();
                } elseif ($type === 'renewal') {
                    $results = $applicationPeriod->getLatestRenewalApplicationPeriod();
                } else {
                    $results = $applicationPeriod->getAllApplicationPeriods();
                }

                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data' => $results,
                    'hasActiveNewApplicationPeriod' => $applicationPeriod->hasActiveNewApplicationPeriod(),
                    'hasActiveRenewalApplicationPeriod' => $applicationPeriod->hasActiveRenewalApplicationPeriod(),
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

    private function handlePost()
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

            // Handle data from both FormData and direct JSON
            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Process application period data
            $applicationPeriod = new ApplicationPeriodModel();
            $scholarsModel = new ScholarsModel();
            $scholarModel = new ScholarModel();
            $applicationModel = new ApplicationModel();
            $notification = new NotificationsModel();
            $schoolYear = new SchoolYearModel();

            if ($data['application']['type'] === 'renewal') {
                $scholars = $scholarModel->getAllScholars();

                foreach ($scholars as $scholar) {
                    if (
                        !$emailService->sendRenewalApplicationEmail($scholar, $data['application'])
                    ) {
                        throw new \Exception('Failed to send email');
                    }
                }

                if (
                    !$notification->createRenewalApplicationPeriodNotification($data['application'])
                ) {
                    throw new \Exception('Failed to create notification');
                }

                $prevNewScholars = $applicationModel->getNewScholarsFromPreviousSchoolYear();
                $prevOldScholars = $applicationModel->getOldScholarsFromPreviousSchoolYear();

                if ($prevNewScholars) {
                    foreach ($prevNewScholars as $prevScholar) {
                        $scholarsModel->setScholarsAsNotRenewed($prevScholar['application_id']);
                    }
                }

                if ($prevOldScholars) {
                    foreach ($prevOldScholars as $prevScholar) {
                        $scholarsModel->setScholarsAsNotRenewed($prevScholar['scholar_id']);
                    }
                }

                $applicationModel->setApplicationStatusAsNotRenewed();
                $scholarsModel->resetLivingInfoAndTransportInfoSubmission();
            }

            if (!$applicationPeriod->createApplicationPeriod($data['application'])) {
                throw new \Exception('Failed to save application period information');
            }

            if (!$schoolYear->getSchoolYear($data['application']['schoolYear'])) {
                $schoolYear->createSchoolYear($data['application']['schoolYear']);
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Application period created successfully',
            ]);
        } catch (\Exception $e) {
            // Roll back transaction on error\
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

            // Get data from request body
            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Check if ID is provided
            if (!isset($data['application']['id'])) {
                throw new \Exception('ID is required for update');
            }

            $id = $data['application']['id'];

            // Process application period data
            $applicationPeriod = new ApplicationPeriodModel();
            $schoolYear = new SchoolYearModel();

            // Check if application period exists
            $existingApplicationPeriod = $applicationPeriod->getApplicationPeriodById($id);
            if (!$existingApplicationPeriod) {
                throw new \Exception('Application period not found');
            }

            // Get the latest application period
            // $latestPeriod = $applicationPeriod->getLatestApplicationPeriod();

            // // Check if this is the latest application period
            // if (!$latestPeriod || $id != $latestPeriod['id']) {
            //     throw new \Exception('Only the most recent application period can be edited');
            // }

            if (!$applicationPeriod->updateApplicationPeriod($id, $data['application'])) {
                throw new \Exception('Failed to update application period information');
            }

            if (!$schoolYear->getSchoolYear($data['application']['schoolYear'])) {
                $schoolYear->createSchoolYear($data['application']['schoolYear']);
            }

            $scholarsModel = new ScholarsModel();
            $applicationModel = new ApplicationModel();

            // if ($data['application']['type'] === 'renewal') {
            //     $prevNewScholars = $applicationModel->getNewScholarsFromPreviousSchoolYear();
            //     $prevOldScholars = $applicationModel->getOldScholarsFromPreviousSchoolYear();

            //     if ($prevNewScholars) {
            //         foreach ($prevNewScholars as $prevScholar) {
            //             $scholarsModel->setScholarsAsNotRenewed($prevScholar['application_id']);
            //         }
            //     }

            //     if ($prevOldScholars) {
            //         foreach ($prevOldScholars as $prevScholar) {
            //             $scholarsModel->setScholarsAsNotRenewed($prevScholar['scholar_id']);
            //         }
            //     }

            //     $applicationModel->setApplicationStatusAsNotRenewed();
            // }

            $this->pdo->commit();

            // Return success response
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Application period updated successfully',
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

    public function handleDelete()
    {
        try {
            $this->pdo->beginTransaction();

            $id = (int) $_GET['id'] ?? null;

            $applicationPeriod = new ApplicationPeriodModel();

            if (!$applicationPeriod->getApplicationPeriodById($id)) {
                throw new \Exception('ID is required');
            }

            if (!$applicationPeriod->deleteApplicationPeriod($id)) {
                throw new \Exception('Unable to delete application period');
            }

            $this->pdo->commit();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Application period successfully deleted',
            ]);
        } catch (\Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();

                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => $e->getMessage(),
                ]);
            }
        }
    }
}

$controller = new ApplicationPeriodController();
$controller->processRequest();
?>
