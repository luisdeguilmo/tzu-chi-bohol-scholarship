<?php

namespace App\Controllers;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../models/ScholarDashboardDataModel.php';

use App\Models\ScholarDashboardDataModel;
use Config\Database;

class ScholarDashboardDataController
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
            $data = [];

            $dashboardData = new ScholarDashboardDataModel();

            $id = $_GET['id'] ?? null;
            $school_year = $_GET['school_year'] ?? null;

            $userName = $dashboardData->getUserName($id);
            $hasSubmitted = $dashboardData->isSubmittedLivingInfo($id);
            $renderedHours = $dashboardData->getRenderedHours($id);
            $attendedEvents = $dashboardData->getAttendedEvents($id);
            $numberOfUpcomingEvents = $dashboardData->getNumberOfUpcomingEvents();
            $numberOfCommunityServices = $dashboardData->getNumberOfCommunityServices($id);
            $renewalApplicationStatus = $dashboardData->getRenewalApplicationStatus(
                $id,
                $school_year,
            );

            $data = [
                'userName' => $userName,
                'hasSubmittedLivingInfo' => $hasSubmitted,
                'renderedHours' => $renderedHours,
                'attendedEvents' => $attendedEvents,
                'numberOfCommunityServices' => $numberOfCommunityServices,
                'numberOfUpcomingEvents' => $numberOfUpcomingEvents,
                'renewalApplicationStatus' => $renewalApplicationStatus,
            ];

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

$controller = new ScholarDashboardDataController();
$controller->processRequest();

?>
