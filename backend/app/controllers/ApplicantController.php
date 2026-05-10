<?php
ob_start();
require_once __DIR__ . '/../../vendor/autoload.php';

use App\Models\ApplicantModel;
use App\Models\ApplicationRecordsModel;
use App\Models\SchoolYearModel;

header('Content-Type: application/json; charset=UTF-8');

try {
    // $applicant = new ApplicantModel();
    // $data = $applicant->getAllApplicants();
    // echo json_encode(["personalInfo" => $data]);

    $applicant = new ApplicantModel();
    $applicationRecord = new ApplicationRecordsModel();

    // Get filter parameters from the URL
    $application_status = $_GET['application_status'] ?? null;
    $status = $_GET['status'] ?? null;
    $batch = $_GET['batch'] ?? null;
    $tab = $_GET['tab'] ?? null;

    $approved = $_GET['approved'] ?? null;
    $entrance_examination = $_GET['entrance_examination'] ?? null;
    $initial_interview = $_GET['initial_interview'] ?? null;

    $schoolYearModel = new SchoolYearModel();
    $activeSchoolYear = $schoolYearModel->getActiveSchoolYear();

    $data = [];
    $result = [];

    if ($application_status === 'pending') {
        if ($status === 'new') {
            $data = $applicant->getAllNewApplicants($activeSchoolYear);
        } elseif ($status === 'old') {
            $data = $applicant->getAllRenewalApplicants($activeSchoolYear);
        } else {
            $data = $applicant->getAllApplicants($activeSchoolYear);
        }
    } elseif ($application_status === 'approved') {
        if ($status === 'new') {
            $data = $applicant->getAllReviewedApplicants($status, $activeSchoolYear);
            // echo json_encode(['data' => $data]);
            // return;
        } elseif ($status === 'old') {
            $data = $applicant->getAllReviewedApplicants($status, $activeSchoolYear);
            // echo json_encode(['data' => $data]);
            // return;
        }
    } elseif ($application_status === 'initial_interview') {
        if ($tab === 'applicants') {
            $data = $applicant->getApplicantsForInitialInterview($activeSchoolYear);
            // echo json_encode(['data' => $data]);
            // return;
        } elseif ($tab === 'result') {
            $data = $applicant->getResultForInitialInterview($activeSchoolYear);
            // echo json_encode(['data' => $data]);
            // return;
        }
    } elseif ($application_status === 'home_visitation') {
        if ($tab === 'applicants') {
            $data = $applicant->getApplicantsForHomeVisitation($activeSchoolYear);
            // echo json_encode(['data' => $data]);
            // return;
        } elseif ($tab === 'result') {
            $data = $applicant->getResultForHomeVisitation($activeSchoolYear);
            // echo json_encode(['data' => $data]);
            // return;
        }
    } elseif ($application_status === 'final_interview') {
        if ($tab === 'applicants') {
            $data = $applicant->getApplicantsForFinalInterview($activeSchoolYear);
            // echo json_encode(['data' => $data]);
            // return;
        } elseif ($tab === 'result') {
            $data = $applicant->getResultForFinalInterview($activeSchoolYear);
            // echo json_encode(['data' => $data]);
            // return;
        }
    } elseif ($application_status === 'examination' && $batch === 'Unassigned') {
        $data = $applicant->getUnassignedApplicants($activeSchoolYear);
        // echo json_encode(['data' => $data]);
        // return;
    } elseif ($application_status === 'orientation' && $batch === 'Unassigned') {
        $data = $applicant->getUnassignedApplicantsForOrientation($activeSchoolYear);
        // echo json_encode(['data' => $data]);
        // return;
    }

    $result = $applicant->getApplicantsWithProfile($status, $data, $applicant);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $result,
    ]);

    // echo json_encode(['personalInfo' => $data]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Something went wrong', 'message' => $e->getMessage()]);
}
