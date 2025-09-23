<?php 
namespace App\Controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/ApplicationPeriodModel.php';
require_once __DIR__ . '/../Models/NotificationsModel.php';
require_once __DIR__ . '/../Services/PHPMailerBrevoService.php'; // Add this line

// Load environment variables
try {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
    $dotenv->safeLoad();
} catch (\Exception $e) {
    error_log("Could not load .env file: " . $e->getMessage());
}

use App\Models\EventsModel;
use App\Models\NotificationsModel;
use App\Models\ScholarModel;
use App\Models\ScholarOverviewDataModel;
use App\Services\PHPMailerBrevoService;
use Config\Database;

class EventsController {
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function processRequest() {
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            return;
        }

        $requestMethod = $_SERVER['REQUEST_METHOD'];

        switch ($requestMethod) {
            case "GET":
                $this->handleGet();
                break;
            case "POST":
                $this->handlePost();
                break;
            case "PUT":
                // $this->handlePut();
                break;
            default:
                http_response_code(405);
                echo json_encode(array("message" => "Method not allowed"));
                break;
        }
    }

    private function handleGet() {
        try {
            $events = new EventsModel();
            $joinedScholars = new ScholarOverviewDataModel();
            
            // Get ID parameter if it exists
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            $tab = $_GET['tab'] ?? null;
            $year = $_GET['year'] ?? null;
            $status = $_GET['status'] ?? null;
            $sortBy = $_GET['sort_by'] ?? null;
            $iScholar = $_GET['is_scholar'] ?? null;
            $isStaff = $_GET['is_staff'] ?? null;

            $result = [];

            if ($tab !== 'recent' && $iScholar) {
                $result = $events->getEventsByTabAndScholarId($tab, $id, $joinedScholars);
            } else if ($tab === 'recent') {
                $result = $events->getRecentEvents();
            } else if ($isStaff) {
                $result = $events->getEventsOnStaff($year, $status, $sortBy, $joinedScholars);
            }

            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "data" => $result,
            ));
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(array(
                "success" => false,
                "message" => $e->getMessage()
            ));
        }
    }
    
    private function handlePost() {
        $requiredEnvVars = ['BREVO_EMAIL', 'BREVO_SMTP_KEY', 'ORG_NAME', 'ORG_ADDRESS', 'ORG_CONTACT'];

        foreach ($requiredEnvVars as $var) {
            if (empty($_ENV[$var])) {
                http_response_code(500);
                echo json_encode(array(
                    "success" => false,
                    "message" => "Missing required environment variable: $var"
                ));
                return;
            }
        }

        $emailService = new PHPMailerBrevoService(
            $_ENV['BREVO_EMAIL'],
            $_ENV['BREVO_SMTP_KEY'],
            $_ENV['ORG_NAME'],
            $_ENV['ORG_ADDRESS'],
            $_ENV['ORG_CONTACT']
        );

        try {
            $this->pdo->beginTransaction();
            
            // Handle data from both FormData and direct JSON
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (!$data) {
                throw new \Exception("No data provided");
            }
            
            // Process application period data
            $event = new EventsModel();
            $notification = new NotificationsModel();
            $scholarModel = new ScholarModel();

            $eventId = $event->createEvent($data['event']);
            
            if (!$eventId) {
                throw new \Exception("Failed to save event information");
            }

            if ($data['event']['event_type'] === 'mandatory') {
                if (!$event->makeAllScholarsAsParticipants($eventId)) {
                    throw new \Exception("Failed to save event information");
                }
            }

            $scholars = $scholarModel->getAllScholars();

            foreach ($scholars as $scholar) {
                if (!$emailService->sendNewEventEmail($scholar, $data['event'])) {
                    throw new \Exception("Failed to send email");
                }
            }
            
            if (!$notification->createEventNotification($data['event'])) {
                throw new \Exception("Failed to create notification");
            }
            
            $this->pdo->commit();
            
            // Return success response
            http_response_code(201);
            echo json_encode(array(
                "success" => true,
                "message" => "Event created successfully"
            ));
        } catch (\Exception $e) {
            // Roll back transaction on error
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            
            http_response_code(400);
            echo json_encode(array(
                "success" => false,
                "message" => $e->getMessage()
            ));
        }
    }
    
    // private function handlePut() {
    //     try {
    //         $this->pdo->beginTransaction();
            
    //         // Get data from request body
    //         $data = json_decode(file_get_contents("php://input"), true);
            
    //         if (!$data) {
    //             throw new \Exception("No data provided");
    //         }
            
    //         // Check if ID is provided
    //         if (!isset($data['application']['id'])) {
    //             throw new \Exception("ID is required for update");
    //         }
            
    //         $id = $data['application']['id'];
            
    //         // Process application period data
    //         $applicationPeriod = new EventsModel();
            
    //         // Check if application period exists
    //         $existingApplicationPeriod = $applicationPeriod->getApplicationPeriodById($id);
    //         if (!$existingApplicationPeriod) {
    //             throw new \Exception("Application period not found");
    //         }
            
    //         // Get the latest application period
    //         $latestPeriod = $applicationPeriod->getLatestApplicationPeriod();
            
    //         // Check if this is the latest application period
    //         if (!$latestPeriod || $id != $latestPeriod['id']) {
    //             throw new \Exception("Only the most recent application period can be edited");
    //         }
            
    //         if (!$applicationPeriod->updateEvent($id, $data['application'])) {
    //             throw new \Exception("Failed to update application period information");
    //         }
            
    //         $this->pdo->commit();
            
    //         // Return success response
    //         http_response_code(200);
    //         echo json_encode(array(
    //             "success" => true,
    //             "message" => "Application period updated successfully"
    //         ));
    //     } catch (\Exception $e) {
    //         // Roll back transaction on error
    //         if ($this->pdo->inTransaction()) {
    //             $this->pdo->rollBack();
    //         }
            
    //         http_response_code(400);
    //         echo json_encode(array(
    //             "success" => false,
    //             "message" => $e->getMessage()
    //         ));
    //     }
    // }
}

$controller = new EventsController();
$controller->processRequest();
?>