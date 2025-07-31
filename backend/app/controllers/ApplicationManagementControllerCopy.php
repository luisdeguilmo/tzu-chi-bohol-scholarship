<?php
namespace App\Controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/ApplicantModel.php';
require_once __DIR__ . '/../Services/PHPMailerBrevoService.php'; // Add this line

// Load environment variables
try {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
    $dotenv->safeLoad();
} catch (\Exception $e) {
    error_log("Could not load .env file: " . $e->getMessage());
}

use App\Models\ApplicantModel;
use App\Services\PHPMailerBrevoService; // Update this line
use Config\Database;

class ApplicationManagementController {
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->logToConsole("ApplicationManagementController initialized");
    }

    private function logToConsole($message, $type = 'log') {
        // Escape the message for JavaScript output
        $escapedMessage = json_encode($message);
        $timestamp = date('Y-m-d H:i:s');
        
        // Output JavaScript that will log to browser console
        echo "<script>console.{$type}('[PHP Controller - {$timestamp}] ' + {$escapedMessage});</script>";
        
        // Also log to PHP error log for server-side debugging
        error_log("[ApplicationManagementController] " . $message);
    }

    public function processRequest() {
        $this->logToConsole("Processing request: " . $_SERVER['REQUEST_METHOD']);
        
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            $this->logToConsole("Handling OPTIONS request");
            http_response_code(200);
            return;
        }

        $requestMethod = $_SERVER['REQUEST_METHOD'];

        switch ($requestMethod) {
            case "PUT":
                $this->logToConsole("Handling PUT request");
                $this->handlePut();
                break;
            default:
                $this->logToConsole("Method not allowed: " . $requestMethod, 'warn');
                http_response_code(405);
                echo json_encode(array("message" => "Method not allowed"));
                break;
        }
    }

    private function handlePut() {
        $this->logToConsole("Starting handlePut method");
        
        // Validate required environment variables
        // $requiredEnvVars = ['BREVO_EMAIL', 'BREVO_SMTP_KEY', 'ORG_NAME', 'ORG_ADDRESS', 'ORG_CONTACT'];
        // foreach ($requiredEnvVars as $var) {
        //     if (empty(getenv($var))) {
        //         http_response_code(500);
        //         echo json_encode(array(
        //             "success" => false,
        //             "message" => "Missing required environment variable: $var"
        //         ));
        //         return;
        //     }
        // }

        $this->logToConsole("Initializing email service");
        $emailService = new PHPMailerBrevoService(
            "8e0b3a001@smtp-brevo.com",
            "GWC79FOwnjMR0Yg8",
            "d",
            "d",
            "d"
        );

        try {
            $this->logToConsole("Starting database transaction");
            $this->pdo->beginTransaction();
            
            $action = $_GET['action'] ?? null;
            $data = json_decode(file_get_contents("php://input"), true);
            
            $this->logToConsole("Action: " . ($action ?? 'null'));
            $this->logToConsole("Data received: " . json_encode($data));
            
            if (!$data) {
                throw new \Exception("No data provided");
            }

            if (empty($data['application_id'])) {
                throw new \Exception('Application ID is required');
            }

            if (!in_array($action, ['approve', 'reject'])) {
                throw new \Exception('Invalid action. Must be either "approve" or "reject"');
            }
            
            $this->logToConsole("Validation passed. Application ID: " . $data['application_id']);
            
            $applicant = new ApplicantModel();

            if ($action === 'approve') {
                $this->logToConsole("Processing application approval");
                
                
                
                
                if (!$emailService->sendApplicationApprovalEmail($data)) {
                    throw new \Exception("Application approved but failed to send approval email");
                }

                $this->logToConsole("Approval process completed successfully", 'info');

                if (!$applicant->approveApplication($data)) {
                    throw new \Exception("Failed to approve application");
                }

                $this->logToConsole("Application approved in database, sending approval email");
                
                
                
                
            } else if ($action === 'reject') {
                $this->logToConsole("Processing application rejection");
                
                if (!$applicant->rejectApplication($data)) {
                    throw new \Exception("Failed to reject application");
                }
                
                $this->logToConsole("Application rejected in database, sending rejection email");
                
                if (!$emailService->sendApplicationRejectionEmail($data)) {
                    throw new \Exception("Application rejected but failed to send rejection email");
                }
                
                $this->logToConsole("Rejection process completed successfully", 'info');
            }
            
            $this->logToConsole("Committing database transaction");
            $this->pdo->commit();
            
            $successMessage = "Application " . $action . "d successfully and notification email sent";
            $this->logToConsole($successMessage, 'info');
            
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => $successMessage
            ));
            
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();
            $this->logToConsole("Error occurred: " . $errorMessage, 'error');
            
            if ($this->pdo->inTransaction()) {
                $this->logToConsole("Rolling back database transaction", 'warn');
                $this->pdo->rollBack();
            }
            
            http_response_code(400);
            echo json_encode(array(
                "success" => false,
                "message" => $errorMessage
            ));
        }
    }
}

$controller = new ApplicationManagementController();
$controller->processRequest();
?>