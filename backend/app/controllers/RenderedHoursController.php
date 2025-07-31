<?php
namespace App\Controllers;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/RenderedHoursModel.php';
require_once __DIR__ . '/../Models/ActivityModel.php';

use App\Models\ActivityModel;
use App\Models\EventParticipantsModel;
use Config\Database;
use App\Models\RenderedHoursModel;

class RenderedHoursController {
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function ProcessRequest() {
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
                echo json_encode(array("message" => "Method not allowed"));
                break;
        }
    }

    public function handleGet() {
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
            echo json_encode(array(
                'success' => true,
                'renderedHours' => $hours
            ));
        } catch (\Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            http_response_code(400);
            echo json_encode(array(
                'success' => false,
                'message' => $e->getMessage()
            ));
        }
    }

    public function handlePut() {
        try {
            $this->pdo->beginTransaction();

            $data = json_decode(file_get_contents('php://input'), true);
            $dutyType = $_GET['duty_type'] ?? null;
            // $scholarIds = $_GET['selected_scholars'] ?? null;

            if (!$data) {
                throw new \Exception('No data provided');
            }

            $renderedHours = new RenderedHoursModel();
            $activity = new ActivityModel();
            $scholar = new EventParticipantsModel();

            $account_id = $data['account_id'];

            if ($dutyType === "community_service") {
                if (!$renderedHours->recordHours($data['account_id'], $data['rendered_hours'])) {
                    throw new \Exception('Failed to record hours');
                }

                $activity->updateActivityStatus($data);
            } else if ($dutyType === "event") {
                foreach ($data['selected_scholars'] as $scholarId) {
                    if (!$renderedHours->recordHours($scholarId, $data['rendered_hours'])) {
                        throw new \Exception('Failed to record hours');
                    }

                    $scholar->setScholarAsAttended($data["event_id"], $scholarId);
                }
            }

            $this->pdo->commit();

            http_response_code(201);
            echo json_encode(array(
                'success' => true,
                'message' => 'Recorded successfully'
            ));
        } catch (\Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            http_response_code(400);
            echo json_encode(array(
                'success' => false,
                'message' => $e->getMessage()
            ));
        }
    }
}

$controller = new RenderedHoursController();
$controller->ProcessRequest();

?>