<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/NotificationsModel.php';
require_once __DIR__ . '/../Services/PHPMailerBrevoService.php'; // Add this line

// Load environment variables
try {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
    $dotenv->safeLoad();
} catch (\Exception $e) {
    error_log('Could not load .env file: ' . $e->getMessage());
}

use App\Models\NotificationsModel;
use App\Models\ScholarModel;
use App\Services\PHPMailerBrevoService;
use Config\Database;
use Middleware\Auth;

class NotificationsController
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
            $notification = new NotificationsModel();

            $id = Auth::id();

            if (!$id) {
                throw new \Exception('ID is required.');
            }

            $results = $notification->getAllNotifications($id);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $results,
            ]);
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

            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Process application data
            $scholarModel = new ScholarModel();
            $notification = new NotificationsModel();

            $scholars = $scholarModel->getAllScholars();

            foreach ($scholars as $scholar) {
                if (!$emailService->sendNewEventEmail($scholar, $data)) {
                    throw new \Exception('Failed to send email');
                }
            }

            if (!$notification->createEventNotification($data)) {
                throw new \Exception('Failed to create notification');
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Notification created successfully',
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

    public function handlePut()
    {
        try {
            $this->pdo->beginTransaction();

            $id = isset($_GET['id']) ? $_GET['id'] : null;
            $userId = Auth::id();

            // Process application data
            $notification = new NotificationsModel();

            if (!$notification->markAsRead($userId, $id)) {
                throw new \Exception('Failed to update notification');
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Notification updated successfully',
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

    private function handleDelete()
    {
        try {
            $this->pdo->beginTransaction();

            // Get ID parameter
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            $userId = Auth::id();
            $type = isset($_GET['type']) ? $_GET['type'] : null;

            if (!$id) {
                throw new \Exception('ID is required for delete');
            }

            $notification = new NotificationsModel();

            if ($type === 'community_service') {
                if (!$notification->deleteNotification($id)) {
                    throw new \Exception('Failed to notification');
                }

                if (!$notification->deleteUserNotification($id)) {
                    throw new \Exception('Failed to notification');
                }
            } elseif ($type === 'event') {
                if (!$notification->deleteUserEventNotification($userId, $id)) {
                    throw new \Exception('Failed to notification');
                }
            } elseif ($type === 'application_period') {
                if (!$notification->deleteUserEventNotification($userId, $id)) {
                    throw new \Exception('Failed to notification');
                }
            } elseif ($type === 'pending_scholars') {
                if (!$notification->deleteUserEventNotification($userId, $id)) {
                    throw new \Exception('Failed to notification');
                }
            } elseif ($type === 'private_comments') {
                if (!$notification->deleteUserEventNotification($userId, $id)) {
                    throw new \Exception('Failed to notification');
                }
            } elseif ($type === 'coe_grades') {
                if (!$notification->deleteUserEventNotification($userId, $id)) {
                    throw new \Exception('Failed to notification');
                }
            } else {
                throw new \Exception('Invalid type specified');
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Notification deleted successfully',
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
}

$controller = new NotificationsController();
$controller->processRequest();
?>
