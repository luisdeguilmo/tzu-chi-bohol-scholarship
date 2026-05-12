<?php

namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/BatchModel.php';

use App\Models\AdminDashboardDataModel;
use App\Models\SchoolYearModel;
use Config\Database;

class AdminDashboardDataController
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

            $dashboardData = new AdminDashboardDataModel();
            $schoolYear = new SchoolYearModel();

            $school_year = $schoolYear->getActiveSchoolYear();

            $numberOfAllScholars = $dashboardData->getNumberOfAllScholars();
            $numberOfPendingScholars = $dashboardData->getNumberOfPendingScholars();
            $numberOfActiveScholars = $dashboardData->getNumberOfActiveScholars();
            $numberOfDeactivatedScholars = $dashboardData->getNumberOfDeactivatedScholars();
            $numberOfNotRenewedScholars = $dashboardData->getNumberOfNotRenewedScholars();
            $numberOfAllStaff = $dashboardData->getNumberOfAllStaffs();
            $scholarsByProgram = $dashboardData->getScholarsByProgram($school_year);
            $applicationsSubmittedAndApplicationsApproved = $dashboardData->getApplicationsSubmittedAndApplicationsApproved(
                $school_year,
            );
            $approvedAndRejectedByStage = $dashboardData->getApprovedAndRejectedByStage(
                $school_year,
            );
            $eventAttendanceData = $dashboardData->getEventAttendanceData();
            $communityServiceHoursCompletionData = $dashboardData->getCommunityServiceHoursCompletion();

            $data = [
                'totalScholars' => $numberOfAllScholars,
                'pendingScholars' => $numberOfPendingScholars,
                'activeScholars' => $numberOfActiveScholars,
                'deactivatedScholars' => $numberOfDeactivatedScholars,
                'notRenewedScholars' => $numberOfNotRenewedScholars,
                'totalStaff' => $numberOfAllStaff,
                'totalUsers' => $numberOfAllScholars + $numberOfAllStaff,
                'scholarsByProgram' => $scholarsByProgram,
                'applicationsSubmittedAndApplicationsApproved' => $applicationsSubmittedAndApplicationsApproved,
                'approvedAndRejectedByStage' => $approvedAndRejectedByStage,
                'eventAttendanceData' => $eventAttendanceData,
                'communityServiceHoursCompletionData' => $communityServiceHoursCompletionData,
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

$controller = new AdminDashboardDataController();
$controller->processRequest();

?>
