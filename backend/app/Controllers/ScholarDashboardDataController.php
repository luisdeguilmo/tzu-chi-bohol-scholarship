<?php

namespace App\Controllers;

header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/ScholarDashboardDataModel.php';

use App\Models\ScholarDashboardDataModel;
use App\Models\ScholarsModel;
use Config\Database;
use Middleware\Auth;

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
            $scholarModel = new ScholarsModel();

            $id = Auth::id();

            $userName = $dashboardData->getUserName($id);
            $hasSubmitted = $dashboardData->isSubmittedLivingInfo($id);
            $renderedHours = $dashboardData->getRenderedHours($id);
            $attendedEvents = $dashboardData->getAttendedEvents($id);
            $numberOfUpcomingEvents = $dashboardData->getNumberOfUpcomingEvents();
            $numberOfCommunityServices = $dashboardData->getNumberOfCommunityServices($id);
            $renewalApplicationStatus = $dashboardData->getRenewalApplicationStatus($id);

            $status = [];

            if ($renewalApplicationStatus) {
                if ($renewalApplicationStatus === null) {
                    $status = [
                        'status' => 'not_submitted',
                    ];
                } elseif (
                    $renewalApplicationStatus['is_application_approved'] === 0 &&
                    $renewalApplicationStatus['is_application_rejected'] === 0
                ) {
                    $status = [
                        'status' => 'pending',
                        'created_at' => $renewalApplicationStatus['created_at'],
                    ];
                } elseif ($renewalApplicationStatus['is_application_approved'] === 1) {
                    $status = [
                        'status' => 'approved',
                        'created_at' => $renewalApplicationStatus['created_at'],
                    ];
                } elseif ($renewalApplicationStatus['is_application_rejected'] === 1) {
                    $status = [
                        'status' => 'rejected',
                        'created_at' => $renewalApplicationStatus['created_at'],
                    ];
                }
            } else {
                $status = [
                    'status' => 'not_submitted',
                ];
            }

            $data = [
                'userName' => $userName,
                'hasSubmittedLivingInfo' => $hasSubmitted,
                'renderedHours' => $renderedHours,
                'attendedEvents' => $attendedEvents,
                'numberOfCommunityServices' => $numberOfCommunityServices,
                'numberOfUpcomingEvents' => $numberOfUpcomingEvents,
                'renewalApplicationStatus' => $status,
            ];

            $scholarModel->resetCommunityServiceAndEventRenderedHours();

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
