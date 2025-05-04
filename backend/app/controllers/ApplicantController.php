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
    $status = $_GET['status'] ?? null;
    $type = $_GET['type'] ?? null;
    $batch = $_GET['batch'] ?? null;
    
    // Determine which method to call based on parameters
    if ($status === null && $type === null) {
        // No filters - get all applicants
        $data = $applicant->getAllApplicants();
    } else if ($status === 'under_review') {
        // Get applications under review
        $data = $applicant->getApplicantsUnderReview();
    } else if ($status === 'approved') {
        if ($type === 'new') {
            // Get approved new applications
            $data = $applicant->getApprovedNewApplicants();
        } else if ($type === 'renewal') {
            // Get approved renewal applications
            $data = $applicant->getApprovedRenewalApplicants();
        } else {
            // Get all approved applications (both new and renewal)
            $data = $applicant->getApprovedApplicants();
        }
    } else if ($status === 'Examination' && $batch === 'Unassigned') {
        $data = $applicant->getUnassignedApplicants();
    } else {
        // Use a flexible method for other combinations
        $types = $type ? [$type] : ['new', 'renewal'];
        $data = $applicant->getApplicantsByStatus($status, $types);
    }
    
    echo json_encode(["personalInfo" => $data]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Something went wrong", "message" => $e->getMessage()]);
}
