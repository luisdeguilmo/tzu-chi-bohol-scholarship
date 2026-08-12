<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/ArchivedActivitiesModel.php';

use App\Models\ActivityModel;
use App\Models\ArchivedActivitiesModel;
use Config\Database;
use App\Middleware\Auth;

class ArchivedActivitiesController
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

    private function handlePut()
    {
        try {
            $this->pdo->beginTransaction();

            $data = json_decode(file_get_contents('php://input'), true);
            $id = Auth::id();

            // file_put_contents(__DIR__ . '/debug.log', 'Staff ID: ' . $id . PHP_EOL, FILE_APPEND);

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Process application data
            $archive = new ArchivedActivitiesModel();

            if (!$archive->archiveActivity($data, $id)) {
                throw new \Exception('Failed to archive activity');
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Activity archived successfully',
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
            $archived = new ArchivedActivitiesModel();
            $activityModel = new ActivityModel();

            // Get ID parameter if it exists
            $id = Auth::id();
            $tab = $_GET['tab'] ?? null;

            $result = [];
            $activities = [];

            if ($tab === 'all') {
                $result = $archived->getArchivedActivities($id, $tab);
            } elseif ($tab === 'volunteer_activities') {
                $result = $archived->getArchivedActivities($id, $tab);
            } elseif ($tab === 'events') {
                $result = $archived->getArchivedActivities($id, $tab);
            }

            // $result = $activityModel->getAllActivitiesWithFiles($activities, $activityModel);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
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

            $data = json_decode(file_get_contents('php://input'), true);
            $id = Auth::id();

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Process application data
            $archive = new ArchivedActivitiesModel();

            if (!$archive->unArchiveActivity($data, $id)) {
                throw new \Exception('Failed to unarchive activity');
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Activity unArchived successfully',
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

$controller = new ArchivedActivitiesController();
$controller->processRequest();
?>
