<?php 

// require_once __DIR__ . "/../../config/Database.php";

namespace App\Models;

use Config\Database;

class ApplicantModel {
    private $pdo;
    
    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
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

    public function getAllApplicants() {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.application_approved = '0'";
        
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }

    // public function getAllNewApplicants() {
    //     $query = "SELECT pi.*
    //               FROM personal_information pi
    //               JOIN application_info ai ON pi.application_id = ai.application_id
    //               WHERE ai.application_approved = '0' AND ai.status = 'New' AND (ai.application_status != 'Rejected' OR ai.application_status IS NULL)";
        
    //     $stmt = $this->pdo->query($query);
    //     return $stmt->fetchAll();
    // }

    public function getAllNewApplicants() {
    $query = "SELECT 
                pi.*, 
                pp.*
              FROM personal_information pi
            JOIN profile_pictures pp ON pi.application_id = pp.application_id
              JOIN application_info ai ON pi.application_id = ai.application_id
              
              WHERE ai.application_approved = '0' 
                AND ai.status = 'New' 
                AND ( 
                    ai.application_status != 'Rejected'
                    OR ai.application_status IS NULL              
                )";

    $stmt = $this->pdo->query($query);
    return $stmt->fetchAll(\PDO::FETCH_ASSOC);
}


    public function getAllRenewalApplicants() {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.application_approved = '0' AND ai.status = 'Old' AND ai.application_status != 'Rejected'";
        
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }

    public function getUnassignedApplicants() {
        $query = "SELECT 
                pi.*, 
                ai.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id
            WHERE (
                ai.entrance_examination = '1' AND ai.batch IS NULL AND ai.status = 'New'
            ) OR (
                ai.entrance_examination = '1' AND ai.batch = 'Unassigned' AND ai.status = 'New'
            )
        ";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getApplicantsToInitialInterview() {
        $query = "SELECT 
                pi.*, 
                ai.*,
                eb.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id 
            JOIN educational_background eb ON pi.application_id = eb.application_id
            WHERE
                ai.initial_interview = '1' AND ai.status = 'New' 
        ";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // public function getAllNewApprovedApplicants() {
    //     $query = "SELECT 
    //                 pi.*, 
    //                 ai.*
    //             FROM personal_information pi
    //             JOIN application_info ai ON pi.application_id = ai.application_id
    //             WHERE 
    //                 ai.approved = '1' AND 
    //                 ai.status = 'New'
                
    //             ";

    //     $stmt = $this->pdo->query($query);
    //     return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    // }

    public function getAllApprovedApplicants($status) {
        $query = "";

        if ($status === "New") {
            $query = "SELECT 
                    pi.*, 
                    ai.*
                FROM personal_information pi
                JOIN application_info ai ON pi.application_id = ai.application_id
                WHERE 
                    ai.application_approved = '1' AND 
                    ai.status = 'New'
                
                ";
        } else if ($status === 'Old') {
            $query = "SELECT 
                    pi.*, 
                    ai.*
                FROM personal_information pi
                JOIN application_info ai ON pi.application_id = ai.application_id
                WHERE 
                    ai.application_approved = '1' AND 
                    ai.status = 'Old'
                
                ";
        }

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // public function getAllApprovedApplicants() {
    //     $query = "SELECT pi.* 
    //               FROM personal_information pi
    //               JOIN application_info ai ON pi.application_id = ai.application_id
    //               WHERE ai.approved = '0' AND ai.status = 'New'";
        
    //     $stmt = $this->pdo->query($query);
    //     return $stmt->fetchAll();
    // }

    // public function getAllRenewalApplicants() {
    //     $query = "SELECT pi.* 
    //               FROM personal_information pi
    //               JOIN application_info ai ON pi.application_id = ai.application_id
    //               WHERE ai.approved = '0' AND ai.status = 'Old'";
        
    //     $stmt = $this->pdo->query($query);
    //     return $stmt->fetchAll();
    // }

    /*
    public function getAllApplicants() {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.application_status IS NULL";
        
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }

    public function getAllNewApplicants() {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.application_status IS NULL AND ai.status = 'New'";
        
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }

    public function getAllRenewalApplicants() {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.application_status IS NULL AND ai.status = 'Old'";
        
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }
    */

    public function getApplicantsUnderReview() {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.application_status = 'under_review'";
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }
    
    public function getApprovedApplicants() {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.application_status = 'Approved'";
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }
    
    public function getApprovedNewApplicants() {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.application_status = 'Approved' AND ai.status = 'New'";
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }

    public function getApplicantsExamination() {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.application_status = 'Examination'";
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }

    

    // public function getUnassignedApplicants() {
    //     // $query = "SELECT pi.* 
    //     //           FROM personal_information pi
    //     //           JOIN application_info ai ON pi.application_id = ai.application_id
    //     //           WHERE ai.application_status = 'Examination' AND ai.batch = 'Unassigned'";
    //     $query = "
    //         SELECT 
    //             pi.*, 
    //             ai.*
    //         FROM personal_information pi
    //         JOIN application_info ai ON pi.application_id = ai.application_id
    //         WHERE (
    //             ai.application_status = 'Approved' AND 
    //             ai.batch 'Unassigned'
    //         ) 
    //         OR (
    //             ai.application_status = 'Approved' AND 
    //             ai.status = 'New' AND 
    //             ai.batch IS NOT NULL
    //         )
    //         ORDER BY 
    //             FIELD(ai.application_status, 'Approved', 'Examination')
    //     ";
    //     $stmt = $this->pdo->query($query);
    //     return $stmt->fetchAll();
    // }

    // public function getApprovedAndExaminationApplicants() {
    //     $query = "
    //         SELECT * 
    //         FROM personal_information pi
    //         JOIN application_info ai ON pi.application_id = ai.application_id
    //         WHERE (
    //             ai.application_status = 'Approved' AND 
    //             ai.status = 'New' AND 
    //             ai.batch IS NULL
    //         ) 
    //         OR (
    //             ai.application_status = 'Examination' AND 
    //             ai.status = 'New' AND 
    //             ai.batch IS NOT NULL
    //         )
    //         ORDER BY 
    //             FIELD(ai.application_status, 'Approved', 'Examination')
    //     ";
    //     $stmt = $this->pdo->query($query);
    //     return $stmt->fetchAll();
    // }

    public function getApprovedAndExaminationApplicants() {
        $query = "
            SELECT 
                pi.*, 
                ai.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id
            WHERE (
                ai.application_status = 'Approved' AND 
                ai.status = 'New' AND 
                ai.batch IS NULL
            ) 
            OR (
                ai.application_status = 'Examination' AND 
                ai.status = 'New' AND 
                ai.batch IS NOT NULL
            )
            ORDER BY 
                FIELD(ai.application_status, 'Approved', 'Examination')
        ";
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // public function getUnassignedApplicants() {
    //     $query = "SELECT * FROM application_info WHERE application_status = 'Examination' AND WHERE batch = 'Unassigned'";
    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->bindParam(':batch', $batchValue);
            
    //     if (!$stmt->execute()) {
    //         return false;
    //     }
            
    //     // Return all matching ids
    //     return $stmt->fetchAll(\PDO::FETCH_COLUMN);
    // }
    
    public function getApprovedRenewalApplicants() {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.application_status = 'Approved' AND ai.status = 'Old'";
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }
    
    public function getApplicantsByStatus($status, $types = ['New', 'Old']) {
        $placeholders = implode(',', array_fill(0, count($types), '?'));
        
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.application_status = ?
                  AND ai.status IN ($placeholders)";
        
        $stmt = $this->pdo->prepare($query);
        
        // Combine status and types into one array for binding
        $params = array_merge([$status], $types);
        
        $stmt->execute($params);
        return $stmt->fetchAll();
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
  
    public function getApplicationIdsByBatch($batchValue, $hasScore) {
        $myQuery = '';
        $myCheckQuery = '';

        if ($hasScore) {
            $myQuery = "SELECT application_id FROM application_info WHERE entrance_examination = '1' AND (batch IS NOT NULL AND batch != 'Unassigned') AND score IS NOT NULL";
        } else {
            $myQuery = "SELECT application_id FROM application_info WHERE entrance_examination = '1' AND (batch IS NOT NULL AND batch != 'Unassigned')";
        }

        if ($batchValue === 'all') {
            $query = $myQuery;
            $stmt = $this->pdo->prepare($query);
            // application_status = 'Examination'
            if (!$stmt->execute()) {
                return false; // Database error
            }
            
            return $stmt->fetchAll(\PDO::FETCH_COLUMN);
        }

        if ($hasScore){
            $myCheckQuery = "SELECT COUNT(*) FROM application_info WHERE batch = :batch AND score IS NOT NULL";
        } else {
            $myCheckQuery = "SELECT COUNT(*) FROM application_info WHERE batch = :batch";
        }
        
        // First check if the batch exists
        $checkQuery = $myCheckQuery;
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
    
    public function getApplicantsByBatch($batchValue, $hasScore) {
        // Get all application IDs matching the batch
        $applicationIds = $this->getApplicationIdsByBatch($batchValue, $hasScore);
        
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
}
?>