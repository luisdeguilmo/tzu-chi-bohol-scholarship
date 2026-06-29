<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/EventParticipantsModel.php';

use App\Constants\Action;
use App\Models\AuditLogModel;
use App\Models\EventParticipantsModel;
use App\Models\ScholarModel;
use Config\Database;
use Exception;
use App\Middleware\Auth;

class EventParticipantsController
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
            $eventId = isset($_GET['event_id']) ? (int) $_GET['event_id'] : null;
            $scholarId = Auth::id(); // Changed from user_id

            if (!$eventId || $eventId <= 0) {
                throw new Exception('Valid Event ID is required');
            }

            $eventParticipant = new EventParticipantsModel();

            // Check if event exists first
            $eventExists = $eventParticipant->checkEventExists($eventId);
            if (!$eventExists) {
                throw new Exception('Event not found');
            }

            if ($scholarId) {
                // Check if user is a participant (using the boolean method)
                $isParticipant = $eventParticipant->checkUserParticipation($eventId, $scholarId);

                if ($isParticipant) {
                    // Get participant data if needed
                    $participantData = $eventParticipant->checkUserParticipation(
                        $eventId,
                        $scholarId,
                    );

                    http_response_code(200);
                    echo json_encode([
                        'success' => true,
                        'data' => $participantData,
                    ]);
                } else {
                    http_response_code(200);
                    echo json_encode([
                        'success' => false,
                        'message' => 'User is not a participant in this event',
                    ]);
                }
            } else {
                // Get all participants for the event
                $participants = $eventParticipant->getParticipantsById($eventId);

                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data' => $participants,
                    'count' => count($participants),
                ]);
            }
        } catch (\Exception $e) {
            http_response_code(400); // Changed from 500 to 400 for client errors
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

            // Get POST data
            $data = json_decode(file_get_contents('php://input'), true);

            if (!isset($data['event_id'])) {
                throw new Exception('Event ID is required');
            }

            $scholarModel = new ScholarModel();
            $auditLogModel = new AuditLogModel();

            $eventId = $data['event_id'];
            $eventName = $data['event_name'];
            $scholarId = Auth::id();

            $scholar = $scholarModel->getScholarById($scholarId);

            $event = new EventParticipantsModel();

            if (!$event->addParticipant($eventId, $scholarId)) {
                throw new Exception('Failed to add participant to event');
            }

            if (
                !$auditLogModel->create([
                    'user_id' => $scholarId,
                    'actor' => "{$scholar['first_name']} {$scholar['last_name']}",
                    'user_role' => 'scholar',
                    'action' => Action::EVENT_JOINED,
                    'entity_type' => 'event',
                    'entity_id' => $eventId,

                    'description' => "{$scholar['first_name']} {$scholar['last_name']} joined the event {$eventName}.",

                    'old_values' => null,
                    'new_values' => ['status' => 'joined'],
                    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                ])
            ) {
                throw new \Exception('Failed to create audit log');
            }

            $this->pdo->commit();

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Schedule created successfully',
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
            $data = json_decode(file_get_contents('php://input'), true);

            if (!isset($data['event_id'])) {
                throw new Exception('Event ID is required');
            }

            $scholarModel = new ScholarModel();
            $auditLogModel = new AuditLogModel();

            $eventId = $data['event_id'];
            $eventName = $data['event_name'];
            $scholarId = Auth::id();

            $scholar = $scholarModel->getScholarById($scholarId);

            $event = new EventParticipantsModel();

            // Check if event exists
            $existingEvent = $event->getParticipantsById($eventId);
            if (!$existingEvent) {
                throw new \Exception('Event not found');
            }

            // Check if participant exists in this event
            $participantExists = $event->checkUserParticipation($eventId, $scholarId);
            if (!$participantExists) {
                throw new \Exception('Participant not found in this event');
            }

            if (!$event->removeParticipant($eventId, $scholarId)) {
                throw new Exception('Failed to remove participant from event');
            }

            if (
                !$auditLogModel->create([
                    'user_id' => $scholarId,
                    'actor' => "{$scholar['first_name']} {$scholar['last_name']}",
                    'user_role' => 'scholar',
                    'action' => Action::EVENT_CANCELED,
                    'entity_type' => 'event',
                    'entity_id' => $eventId,

                    'description' => "{$scholar['first_name']} {$scholar['last_name']} canceled their registration for {$eventName}.",

                    'old_values' => null,
                    'new_values' => ['status' => 'canceled'],
                    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                ])
            ) {
                throw new \Exception('Failed to create audit log');
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Participant removed successfully',
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

$controller = new EventParticipantsController();
$controller->processRequest();
?>
