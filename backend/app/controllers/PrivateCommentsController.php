<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/EventParticipantsModel.php';

use App\Models\EventParticipantsModel;
use App\Models\NotificationsModel;
use App\Models\PrivateCommentsModel;
use Config\Database;

class PrivateCommentsController
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
            $privateComment = new PrivateCommentsModel();

            // Get ID parameter if it exists
            $eventId = isset($_GET['event_id']) ? $_GET['event_id'] : null;
            $scholarId = isset($_GET['scholar_id']) ? $_GET['scholar_id'] : null;
            $staffId = isset($_GET['staff_id']) ? $_GET['staff_id'] : null;
            $userType = isset($_GET['user_type']) ? $_GET['user_type'] : null;

            $rows = $privateComment->getPrivateComments($eventId);

            $result = [];

            if ($userType === 'scholar') {
                $result = $privateComment->getPrivateCommentsByScholarId($eventId, $scholarId);
            } elseif ($userType === 'staff') {
                foreach ($rows as $row) {
                    $result[$row['scholar_id']][] = $row;
                }
            }

            $response = array_values($result);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $response,
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
        try {
            $this->pdo->beginTransaction();

            // Get data from request body
            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Check if ID is provided
            if (!isset($data['event']['event_id']) || !isset($data['event']['scholar_id'])) {
                throw new \Exception('ID is required for update');
            }

            $eventId = $data['event']['event_id'];
            $scholarId = $data['event']['scholar_id'];
            $staffId = $data['event']['staff_id'];
            $reason = $data['event']['reason'] ?? '';
            $firstName = $data['event']['first_name'] ?? '';
            $lastName = $data['event']['last_name'] ?? '';
            $userType = $data['event']['user_type'] ?? '';

            // Process procedure data
            $eventParticipant = new EventParticipantsModel();
            $privateComment = new PrivateCommentsModel();
            $notification = new NotificationsModel();

            // if (!$eventParticipant->addReason($eventId, $scholarId, $reason)) {
            //     throw new \Exception('Failed to add');
            // }

            if (
                !$privateComment->addPrivateComment(
                    $eventId,
                    $scholarId,
                    $staffId,
                    $reason,
                    $firstName,
                    $lastName,
                )
            ) {
                throw new \Exception('Failed to add');
            }

            if ($userType === 'staff') {
                $notification->createScholarUnreadCommentsNotification($scholarId);
            } elseif ($userType === 'scholar') {
                $notification->createStaffUnreadCommentsNotification();
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Reason added successfully',
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
            if (!isset($data['event']['user_type'])) {
                throw new \Exception('User type is required for update');
            }

            $userType = $data['event']['user_type'];
            $eventId = $data['event']['event_id'];
            $scholarId = $data['event']['scholar_id'];

            $privateComment = new PrivateCommentsModel();

            if ($userType === 'staff') {
                if (!$privateComment->markScholarCommentsAsRead($eventId)) {
                    throw new \Exception('Failed to mark comments as read');
                }
            } elseif ($userType === 'scholar') {
                if (!$privateComment->markStaffCommentsAsRead($eventId, $scholarId)) {
                    throw new \Exception('Failed to mark comments as read');
                }
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Reason added successfully',
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

    private function handleDelete()
    {
        try {
            $this->pdo->beginTransaction();

            // Get ID parameter
            $id = isset($_GET['id']) ? $_GET['id'] : null;

            if (!$id) {
                throw new \Exception('ID is required for delete');
            }

            // Process delete
            $model = new PrivateCommentsModel();

            // Check if procedure exists
            $existingPrivateComment = $model->getPrivateCommentById($id);
            if (!$existingPrivateComment) {
                throw new \Exception('Private comment not found');
            }

            if (!$model->deletePrivateComment($id)) {
                throw new \Exception('Failed to delete private comment');
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Private comment deleted successfully',
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

$controller = new PrivateCommentsController();
$controller->processRequest();
?>
