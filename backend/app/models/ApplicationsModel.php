<?php
// require_once __DIR__ . "/../../config/Database.php";

namespace App\Models;

// Add these lines at the top of your PHP file (applications.php)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

use Config\Database;

class ApplicationsModel {
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getApplicationData($studentId) {
        if (!$studentId) {
            return ["error" => "Student ID is required"];
        }

        $data = [
            "applicationInfo" => null,
            "personalInfo" => null,
            "educationalBackground" => null,
            "familyInfo" => [
                "parents" => null,
                "contact" => null,
                "siblings" => null,
                "tzuChiSiblings" => null
            ],
            "otherAssistance" => null
        ];

        // Fetch application info
        $data["applicationInfo"] = $this->fetchSingle("SELECT * FROM application_info WHERE application_id = ?", [$studentId]);

        // Fetch personal information
        $data["personalInfo"] = $this->fetchSingle("SELECT * FROM personal_information WHERE application_id = ?", [$studentId]);

        // Fetch educational background
        $data["educationalBackground"] = $this->fetchSingle("SELECT * FROM educational_background WHERE application_id = ?", [$studentId]);

        // Fetch family information - parents/guardian
        $data["familyInfo"]["parents"] = $this->fetchSingle("SELECT * FROM parents_guardian WHERE application_id = ?", [$studentId]);

        $data["familyInfo"]["contact"] = $this->fetchSingle("SELECT * FROM contact_person WHERE application_id = ?", [$studentId]);

        // Fetch family information - siblings
        $data["familyInfo"]["siblings"] = $this->fetchMultiple("SELECT * FROM family_members WHERE application_id = ?", [$studentId]);

        // Fetch tzu chi siblings
        $data["familyInfo"]["tzuChiSiblings"] = $this->fetchMultiple("SELECT * FROM tzu_chi_siblings WHERE application_id = ?", [$studentId]);

        // Fetch other assistance
        $data["otherAssistance"] = $this->fetchMultiple("SELECT * FROM other_assistance WHERE application_id = ?", [$studentId]);

        $data["requirements"] = $this->fetchMultiple("SELECT * FROM uploaded_files WHERE application_id = ?", [$studentId]);

        if (!empty($data["requirements"])) {
            foreach ($data["requirements"] as &$requirement) {
                if (isset($requirement['file_path'])) {
                    $filePath = __DIR__ . "/../../public" . $requirement['file_path'];
                    if (file_exists($filePath)) {
                        $imageData = file_get_contents($filePath);
                        $requirement['base64Data'] = 'data:' . $requirement['file_type'] . ';base64,' . base64_encode($imageData);
                    }
                }
            }
        }
    
        return $data;
    }

    private function fetchSingle($query, $params) {
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetch() ?: null;
    }

    private function fetchMultiple($query, $params) {
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function updateApplicationStatus($studentId, $status) {
        $query = "UPDATE application_info SET application_status = :application_status WHERE application_id = :application_id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_status', $status);
        $stmt->bindParam(':application_id', $studentId);
        $stmt->execute();
    }

    public function markAsUnassigned($studentId) {
        // Now update the specific student record
        $updateQuery = "UPDATE application_info SET batch = 'Unassigned' WHERE application_id = :application_id";
        $updateStmt = $this->pdo->prepare($updateQuery);
        $updateStmt->bindParam(':application_id', $studentId);
        
        if (!$updateStmt->execute()) {
            return false;
        }
        
        return true;
    }

    public function assignApplicants($studentId, $batchValue) {
        // Update the specific student record
        $updateQuery = "UPDATE application_info SET batch = :batch WHERE application_id = :application_id";
        $updateStmt = $this->pdo->prepare($updateQuery);
        $updateStmt->bindParam(':application_id', $studentId);
        $updateStmt->bindParam(':batch', $batchValue); // Fixed typo: was :bact
        
        if (!$updateStmt->execute()) {
            return false;
        }
        
        return true;
    }
    

    // public function getApplicantsByBatch($batchValue) {
        
    //     // Get all students with the specified batch value
    //     $query = "SELECT * FROM application_info WHERE batch = :batch_value";
    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->bindParam(':batch_value', $batchValue);
        
    //     if (!$stmt->execute()) {
    //         return false;
    //     }
        
    //     // Return all matching student records
    //     return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    // }

    public function getApplicationIdsByBatch($batchValue) {
        if ($batchValue === 'all') {
            $query = "SELECT application_id FROM application_info WHERE application_status = 'Examination' AND (batch IS NOT NULL AND batch != 'Unassigned')";
            $stmt = $this->pdo->prepare($query);
            
            if (!$stmt->execute()) {
                return false; // Database error
            }
            
            return $stmt->fetchAll(\PDO::FETCH_COLUMN);
        }
        
        // First check if the batch exists
        $checkQuery = "SELECT COUNT(*) FROM application_info WHERE batch = :batch";
        $checkStmt = $this->pdo->prepare($checkQuery);
        $checkStmt->bindParam(':batch', $batchValue);
        
        if (!$checkStmt->execute()) {
            return false; // Database error
        }
        
        // If count is 0, the batch doesn't exist, but we should return an empty array, not false
        $count = $checkStmt->fetchColumn();
        if ($count == 0) {
            return []; // Return empty array for non-existent batch
        }
        
        // Get Application Ids by Batch
        $query = "SELECT application_id FROM application_info WHERE batch = :batch";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':batch', $batchValue);
        
        if (!$stmt->execute()) {
            return false; // Database error
        }
        
        return $stmt->fetchAll(\PDO::FETCH_COLUMN);
    }
    
    public function getApplicantsByBatch($batchValue) {
        // Get all application IDs matching the batch
        $applicationIds = $this->getApplicationIdsByBatch($batchValue);
        
        // If false is returned, there was a database error
        if ($applicationIds === false) {
            return false; // Let the caller handle the database error
        }
        
        // At this point, $applicationIds is either a populated array or an empty array
        // We don't need additional empty checks since getApplicationIdsByBatch now properly
        // handles non-existent batches by returning an empty array
        
        $data = [];
        
        // Process each application ID (will skip if array is empty)
        foreach ($applicationIds as $applicationId) {
            // Fetch application information
            $applicationInfo = $this->fetchSingle("SELECT * FROM application_info WHERE application_id = ?", [$applicationId]);
            
            // Fetch personal information
            $personalInfo = $this->fetchSingle("SELECT * FROM personal_information WHERE application_id = ?", [$applicationId]);
            
            // Add to results
            $data[] = [
                "applicationInfo" => $applicationInfo,
                "personalInfo" => $personalInfo
            ];
        }
        
        return $data; // Will be empty array if batch doesn't exist
    }

    public function getBatches() {
        // Get all students with the specified batch value
        $query = "SELECT * FROM application_info";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':batch_value', $batchValue);
        
        if (!$stmt->execute()) {
            return false;
        }
        
        // Return all matching student records
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
















    // public function getApplicationIdsByBatch($batchValue) {
    //     // If "all" is passed, get all applications with examination status
    //     if ($batchValue === 'all') {
    //         $query = "SELECT id FROM application_info WHERE application_status = 'Examination'";
    //         $stmt = $this->pdo->prepare($query);
            
    //         if (!$stmt->execute()) {
    //             return false;
    //         }
            
    //         return $stmt->fetchAll(\PDO::FETCH_COLUMN);
    //     }
        
    //     // Otherwise, get applications for the specific batch
    //     $query = "SELECT id FROM application_info WHERE batch = :batch_value";
    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->bindParam(':batch_value', $batchValue);
        
    //     if (!$stmt->execute()) {
    //         return false;
    //     }
        
    //     // Return all matching ids
    //     return $stmt->fetchAll(\PDO::FETCH_COLUMN);
    // }
    
    // public function getApplicantsByBatch($batchValue) {
    //     // Get all application IDs matching the batch
    //     $applicationIds = $this->getApplicationIdsByBatch($batchValue);
        
    //     if (!$applicationIds) {
    //         error_log("No application IDs found for batch: " . $batchValue);
    //         return [];
    //     }
        
    //     error_log("Found " . count($applicationIds) . " application IDs for batch: " . $batchValue);
        
    //     $data = [];
        
    //     // Process each application ID
    //     foreach ($applicationIds as $applicationId) {
    //         // Debug
    //         error_log("Processing application ID: " . $applicationId);
            
    //         // Fetch application information
    //         $applicationInfo = $this->fetchSingle("SELECT * FROM application_info WHERE id = ?", [$applicationId]);
            
    //         if (!$applicationInfo) {
    //             error_log("No application info found for ID: " . $applicationId);
    //             continue;
    //         }
            
    //         // Fetch personal information
    //         $personalInfo = $this->fetchSingle("SELECT * FROM personal_information WHERE application_id = ?", [$applicationId]);
            
    //         if (!$personalInfo) {
    //             error_log("No personal info found for application ID: " . $applicationId);
    //             // Continue and include the application even if personal info is missing
    //         }
            
    //         // Add to results (even if personalInfo is null, to help diagnose the issue)
    //         $data[] = [
    //             "applicationInfo" => $applicationInfo,
    //             "personalInfo" => $personalInfo
    //         ];
    //     }
        
    //     return $data;  // This should be AFTER the foreach loop with proper indentation
    // }
    
    // // Simplified method that reuses the existing getApplicantsByBatch method
    // public function getAllExaminationApplicants() {
    //     // This simply calls the existing method with 'all' parameter
    //     return $this->getApplicantsByBatch('all');
    // }
    
    // // Add a helper method to check if personal_information table has records for this application
    // public function checkPersonalInfoTable() {
    //     $query = "SELECT COUNT(*) FROM personal_information";
    //     $stmt = $this->pdo->prepare($query);
        
    //     if (!$stmt->execute()) {
    //         error_log("Failed to check personal_information table");
    //         return false;
    //     }
        
    //     $count = $stmt->fetchColumn();
    //     error_log("Found {$count} records in personal_information table");
    //     return $count > 0;
    // }
    
    
    
}
?>
