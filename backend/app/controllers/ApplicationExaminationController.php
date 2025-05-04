<?php 
ob_start(); 
require_once __DIR__ . "/../../vendor/autoload.php";

use App\Models\ApplicantModel;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

try {
    $applicant = new ApplicantModel();
    
    // Get filter parameters from the URL
    $application_status = $_GET['application_status'] ?? null;
    $status = $_GET['status'] ?? null;
    
    // When multiple values are passed with the same parameter name, PHP automatically converts it to an array
    // Check if application_status contains both required values
    if (
        // Check if it's a string with one of the values
        ($application_status === 'Approved' || $application_status === 'Examination') ||
        // Or check if it's an array containing both values
        (is_array($application_status) && 
         (in_array('Approved', $application_status) || in_array('Examination', $application_status)))
    ) {
        if ($status === 'New') {
            $data = $applicant->getApprovedAndExaminationApplicants();
            echo json_encode(["data" => $data]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Status parameter must be 'New'"]);
        }
    } else {
        // Handle case when incorrect parameters are provided
        http_response_code(400);
        echo json_encode(["error" => "Invalid application_status parameters. Must include 'Approved' or 'Examination'"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Something went wrong", "message" => $e->getMessage()]);
}