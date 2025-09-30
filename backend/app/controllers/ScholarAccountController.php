<?php
namespace App\Controllers;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

date_default_timezone_set('Asia/Manila');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/ScholarAccountModel.php';
require_once __DIR__ . '/../Services/PHPMailerBrevoService.php'; // Add this line

// Load environment variables
try {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
    $dotenv->safeLoad();
} catch (\Exception $e) {
    error_log('Could not load .env file: ' . $e->getMessage());
}

use App\Models\ScholarAccountModel;
use App\Services\PHPMailerBrevoService;
use Config\Database;

class ScholarAccountController
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
            if (isset($_POST['applicationIds'])) {
                // Handle data from FormData
                $data = $_POST;
            } else {
                // Handle direct JSON input
                $data = json_decode(file_get_contents('php://input'), true);
            }

            // Optional logging
            // file_put_contents("log.txt", json_encode($data) . PHP_EOL, FILE_APPEND);

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Check if we have applicationIds
            if (!isset($data['applicationIds']) || empty($data['applicationIds'])) {
                throw new \Exception('Missing required field: applicationIds');
            }

            // Process multiple applicants
            $scholarAccount = new ScholarAccountModel();
            $successCount = 0;
            $errors = [];

            $scholars = [];

            foreach ($data['applicationIds'] as $applicationId) {
                try {
                    $scholar = $scholarAccount->getPendingScholarById($applicationId);
                    if ($scholar) {
                        $scholars[] = $scholar;
                    } else {
                        $errors[] = "No pending scholar found for application ID: $applicationId";
                    }
                } catch (\Exception $e) {
                    $errors[] =
                        "Error fetching scholar for application ID $applicationId: " .
                        $e->getMessage();
                }
            }

            $today = date('Y-m-d H:i:s');

            foreach ($scholars as $scholar) {
                try {
                    if ($emailService->sendAccountCredentialsEmail($scholar)) {
                        $scholarAccount->createAccount($scholar['application_id'], $today);
                        $scholarAccount->updateApplicationStatus(
                            $scholar['application_id'],
                            'scholar',
                        );
                        $successCount++;
                    } else {
                        $errors[] = "Failed to create account for application ID: $applicationId";
                    }
                } catch (\Exception $e) {
                    $errors[] =
                        "Error processing application ID $applicationId: " . $e->getMessage();
                }
            }

            if ($successCount === 0) {
                throw new \Exception('Failed to create any scholar accounts');
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => "Successfully created $successCount scholar account(s)",
                'errorsCount' => count($errors),
                'errors' => $errors,
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
            $model = new ScholarAccountModel();

            // Get ID parameter if it exists
            $application_status = isset($_GET['application_status'])
                ? $_GET['application_status']
                : null;

            if ($application_status === 'created') {
                // Get specific scholar
                $result = $model->getCreatedAccounts() ?? [];

                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data' => $result,
                ]);
            } elseif ($application_status === 'pending') {
                $results = $model->getPendingScholars();

                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data' => $results,
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

    private function handlePut()
    {
        try {
            $this->pdo->beginTransaction();

            $data = json_decode(file_get_contents('php://input'), true);
            $action = $_GET['action'] ?? null;

            if (!$data || !isset($data['scholarId'])) {
                throw new \Exception('Missing required field: scholar_id');
            }

            $model = new ScholarAccountModel();

            if ($action === 'activate') {
                if (!$model->updateAccountStatus($data['scholarId'], 'active')) {
                    throw new \Exception('Failed to activate account');
                }
            } elseif ($action === 'deactivate') {
                if (!$model->updateAccountStatus($data['scholarId'], 'deactivated')) {
                    throw new \Exception('Failed to deactivate account');
                }
            }

            $this->pdo->commit();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Account status updated successfully',
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

$controller = new ScholarAccountController();
$controller->processRequest();
?>
