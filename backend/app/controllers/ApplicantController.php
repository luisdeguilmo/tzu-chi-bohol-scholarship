<?php
ob_start();
require_once __DIR__ . "/../../vendor/autoload.php"; 

use App\Models\ApplicantModel;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

try {
    // $applicant = new ApplicantModel();
    // $data = $applicant->getAllApplicants();
    // echo json_encode(["personalInfo" => $data]);

    $applicant = new ApplicantModel();
    
    // Get filter parameters from the URL
    $application_status = $_GET['application_status'] ?? null;
    $status = $_GET['status'] ?? null;
    $batch = $_GET['batch'] ?? null;

    $approved = $_GET['approved'] ?? null;
    $entrance_examination = $_GET['entrance_examination'] ?? null;
    $initial_interview = $_GET['initial_interview'] ?? null;

    // if ($application_status === null && $status === null) {
    //     // No filters - get all applicants
    //     $data = $applicant->getAllApplicants();
    // }

    if ($approved === null && $entrance_examination === null && $initial_interview === null) {
        if ($status === 'New') {
            $data = $applicant->getAllNewApplicants();
        } else if ($status === 'Old') {
            $data = $applicant->getAllRenewalApplicants();
        } else {
            $data = $applicant->getAllApplicants();
        }
    } else if ($approved === '1' && $entrance_examination === null && $initial_interview === null) {
        if ($status === 'New') {
            $data = $applicant->getAllApprovedApplicants($status);
            echo json_encode(array("data" => $data));
            return;
        } else if ($status === 'Old') {
            $data = $applicant->getAllApprovedApplicants($status);
            echo json_encode(array("data" => $data));
            return;
        } 
    } else if ($entrance_examination === '1' && $batch === 'Unassigned' && $approved === null && $initial_interview === null) {
        $data = $applicant->getUnassignedApplicants();
        echo json_encode(array("data" => $data));
        return;
    } else if ($initial_interview === '1' && $approved === null && $entrance_examination === null) {
        $data = $applicant->getApplicantsToInitialInterview();
        echo json_encode(array("data" => $data));
        return;
    }
    
    // Determine which method to call based on parameters
    // if ($application_status === null) {
    //     if ($status === 'New') {
    //         $data = $applicant->getAllNewApplicants();
    //     } else if ($status === 'Old') {
    //         $data = $applicant->getAllRenewalApplicants();
    //     } else {
    //         $data = $applicant->getAllApplicants();
    //     }
    // } else if ($application_status === 'under_review') {
    //     // Get applications under review
    //     $data = $applicant->getApplicantsUnderReview();
    // } else if ($application_status === 'Approved') {
    //     if ($status === 'New') {
    //         // Get approved new applications
    //         $data = $applicant->getApprovedNewApplicants();
    //     } else if ($status === 'Old') {
    //         // Get approved renewal applications
    //         $data = $applicant->getApprovedRenewalApplicants();
    //     } else {
    //         // Get all approved applications (both new and renewal)
    //         $data = $applicant->getApprovedApplicants();
    //     }
    // } else if ($application_status === 'Application' && $batch === 'Unassigned') {
    //     $data = $applicant->getUnassignedApplicants();
    //     echo json_encode(["data" => $data]);
    //     return;
    // } else {
    //     // Use a flexible method for other combinations
    //     $types = $status ? [$status] : ['New', 'Old'];
    //     $data = $applicant->getApplicantsByStatus($application_status, $types);
    // }


    
    echo json_encode(["personalInfo" => $data]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Something went wrong", "message" => $e->getMessage()]);
}
