<?php

namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/BatchModel.php';

use App\Models\ScholarOverviewDataModel;
use Config\Database;
use Middleware\Auth;

class ScholarOverviewDataController
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
                $this->getOverviewData();
                break;
            default:
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
                break;
        }
    }

    public function getOverviewData()
    {
        try {
            $id = Auth::id();
            $section = isset($_GET['section']) ? $_GET['section'] : null;

            if (!$id) {
                http_response_code(400);
                echo json_encode(['message' => 'Id is required']);
                return;
            }

            if (!$section) {
                http_response_code(400);
                echo json_encode(['message' => 'Section is required']);
                return;
            }

            $data = [];

            $overviewModel = new ScholarOverviewDataModel();

            if ($section === 'volunteer_activities') {
                $pendingActivities = $overviewModel->getNumberOfPendingActivities($id);
                $recordedActivities = $overviewModel->getNumberOfRecordedActivities($id);
                $notRecordedActivities = $overviewModel->getNumberOfNotRecordedActivities($id);
                $numberOfActivities = $overviewModel->getNumberOfActivities($id);
                $totalHours = $overviewModel->getCommunityServiceRenderedHours($id);

                $data = [
                    'pendingActivities' => $pendingActivities,
                    'recordedActivities' => $recordedActivities,
                    'notRecordedActivities' => $notRecordedActivities,
                    'numberOfActivities' => $numberOfActivities,
                    'totalHours' => $totalHours,
                ];
            } elseif ($section === 'events') {
                $numberOfEvents = $overviewModel->getNumberOfEvents($id);
                $attendedEvents = $overviewModel->getNumberOfAttendedEvents($id);
                $upcomingEvents = $overviewModel->getNumberOfUpcomingEvents($id);
                $totalHours = $overviewModel->getEventRenderedHours($id);

                $data = [
                    'numberOfEvents' => $numberOfEvents,
                    'upcomingEvents' => $upcomingEvents,
                    'attendedEvents' => $attendedEvents,
                    'totalHours' => $totalHours,
                ];
            }

            http_response_code(200);
            echo json_encode([
                'message' => 'Overview data fetched successfully',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'message' => 'An error occurred while fetching overview data',
                'error' => $e->getMessage(),
            ]);
        }
    }
}

$controller = new ScholarOverviewDataController();
$controller->processRequest();

?>
