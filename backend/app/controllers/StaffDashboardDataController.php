<?php

namespace App\Controllers;

date_default_timezone_set('Asia/Manila');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/BatchModel.php';

use App\Models\NotificationsModel;
use App\Models\ScholarAccountModel;
use App\Models\ScholarOverviewDataModel;
use App\Models\ScholarsModel;
use App\Models\StaffDashboardDataModel;
use Config\Database;

class StaffDashboardDataController
{
    private $pdo;
    private $currentYear;
    private $currentDateTime;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->currentYear = date('Y');
        $this->currentDateTime = date('Y-m-d H:i:s');
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

            $dashboardData = new StaffDashboardDataModel();
            $notificationModel = new NotificationsModel();
            $scholarModel = new ScholarAccountModel();

            $id = $_GET['id'] ?? null;
            $school_year = $_GET['school_year'] ?? null;

            $userName = $dashboardData->getUserName($id);
            $numberOfAllApplications = $dashboardData->getNumberOfAllApplications();
            $numberOfNewApplications = $dashboardData->getNumberOfNewApplications();
            $numberOfOldApplications = $dashboardData->getNumberOfOldApplications();
            $numberOfApprovedApplications = $dashboardData->getNumberOfApprovedApplications();
            $numberOfRejectedApplications = $dashboardData->getNumberOfRejectedApplications();
            $numberOfActiveScholars = $dashboardData->getNumberOfActiveScholars();
            $numberOfNewScholars = $dashboardData->getNumberOfNewScholars();
            $numberOfOldScholars = $dashboardData->getNumberOfOldScholars();
            $numberOfApplicantsEligibleForExam = $dashboardData->getNumberOfApplicantsEligibleForExam();
            $numberOfApplicantsForInitialInterview = $dashboardData->getNumberOfApplicantsForInitialInterview();
            $numberOfApplicantsForHomeVisitation = $dashboardData->getNumberOfApplicantsForHomeVisitation();
            $numberOfApplicantsForFinalInterview = $dashboardData->getNumberOfApplicantsForFinalInterview();
            $numberOfApplicantsForOrientation = $dashboardData->getNumberOfApplicantsForOrientation();
            $numberOfApplicantsForAwarding = $dashboardData->getNumberOfApplicantsForAwarding();
            $numberOfUpcomingEvents = $dashboardData->getNumberOfUpcomingEvents();
            $numberOfNewCommunityServices = $dashboardData->getNumberOfNewCommunityServices();
            $applicationData = $dashboardData->getApplicationData($school_year);
            $monthlyAllowanceDistributionData = $dashboardData->getMonthlyAllowanceDistributionData();
            $tenScholarsByHighestDutyHours = $dashboardData->getTenScholarsByHighestDutyHours();
            $eventAttendanceData = $dashboardData->getEventAttendanceData();
            $communityServiceHoursCompletionData = $dashboardData->getCommunityServiceHoursCompletion();
            // $orientationAndAwardingData = $dashboardData->getOrientationAndAwardingData();

            $data = [
                'userName' => $userName,
                'numberOfAllApplications' => $numberOfAllApplications,
                'numberOfNewApplications' => $numberOfNewApplications,
                'numberOfOldApplications' => $numberOfOldApplications,
                'numberOfApprovedApplications' => $numberOfApprovedApplications,
                'numberOfRejectedApplications' => $numberOfRejectedApplications,
                'numberOfActiveScholars' => $numberOfActiveScholars,
                'numberOfNewScholars' => $numberOfNewScholars,
                'numberOfOldScholars' => $numberOfOldScholars,
                'numberOfApplicationsSubmitted' =>
                    $numberOfNewApplications + $numberOfOldApplications,
                'numberOfReviewedApplications' =>
                    $numberOfApprovedApplications + $numberOfRejectedApplications,
                'numberOfApplicantsEligibleForExam' => $numberOfApplicantsEligibleForExam,
                'numberOfApplicantsForInitialInterview' => $numberOfApplicantsForInitialInterview,
                'numberOfApplicantsForHomeVisitation' => $numberOfApplicantsForHomeVisitation,
                'numberOfApplicantsForFinalInterview' => $numberOfApplicantsForFinalInterview,
                'numberOfApplicantsForOrientation' => $numberOfApplicantsForOrientation,
                'numberOfApplicantsForAwarding' => $numberOfApplicantsForAwarding,
                'numberOfUpcomingEvents' => $numberOfUpcomingEvents,
                'numberOfNewCommunityServices' => $numberOfNewCommunityServices,
                'applicationData' => $applicationData,
                'monthlyAllowanceDistributionData' => $monthlyAllowanceDistributionData,
                'tenScholarsByHighestDutyHours' => $tenScholarsByHighestDutyHours,
                'eventAttendanceData' => $eventAttendanceData,
                'communityServiceHoursCompletionData' => $communityServiceHoursCompletionData,
                // 'orientationAndAwardingData' => $orientationAndAwardingData,
            ];

            // preg_match('/\d+/', $pendingScholarNotification['message'], $matches);
            // $numberOfPendingScholars = (int) $matches[0];

            $pendingScholarsCount = $scholarModel->getPendingScholarsCount();
            $pendingScholarNotification = $notificationModel->getLastPendingScholarNotification(
                $this->currentYear,
            );

            // First-ever notification
            if (!$pendingScholarNotification) {
                if ($pendingScholarsCount > 0) {
                    $notificationModel->createNewPendingScholarsNotification($pendingScholarsCount);
                }
                return;
            }

            // Calculate time difference
            $lastNotification = $pendingScholarNotification['created_at'] ?? null;
            if ($lastNotification) {
                $lastTimestamp = strtotime($lastNotification);
                $currentTimestamp = strtotime($this->currentDateTime);
                $diffInSeconds = $currentTimestamp - $lastTimestamp;
            } else {
                $diffInSeconds = PHP_INT_MAX; // force notification if missing
            }

            // Create new notification if pending scholars exist and 1 hour passed
            if ($pendingScholarsCount > 0 && $diffInSeconds >= 3600) {
                $notificationModel->createNewPendingScholarsNotification($pendingScholarsCount);
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

$controller = new StaffDashboardDataController();
$controller->processRequest();

?>
