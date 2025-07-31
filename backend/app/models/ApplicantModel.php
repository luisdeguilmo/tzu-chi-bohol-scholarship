<?php 

// require_once __DIR__ . "/../../config/Database.php"

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class ApplicantModel {
    private $pdo;
    private $currentYear;
    
    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->currentYear = date("Y");
    }
    
    public function approveApplication($data) {
        $query = "UPDATE application_info SET is_application_approved = 1, status = 'Approved' WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $data['application_id']);
        return $stmt->execute();
    }

    public function rejectApplication($data) {
        $query = "UPDATE application_info SET is_application_rejected = 1, status = 'Rejected' WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application', $data['application_id']);
        return $stmt->execute();
    }

    public function getAllApplicants() {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.is_application_approved = '0'";
        
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }

    public function getAllNewApplicants() {
        $query = "SELECT 
                    ai.*,
                    pi.*, 
                    pp.*
                FROM personal_information pi
                    JOIN profile_pictures pp ON pi.application_id = pp.application_id
                JOIN application_info ai ON pi.application_id = ai.application_id
                
                WHERE ai.is_application_approved = '0' 
                    AND ai.is_application_rejected = '0'
                    AND ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }


    public function getAllRenewalApplicants() {
        $query = "SELECT 
                ai.*,
                pi.*, 
                pp.*
              FROM application_info ai
                JOIN profile_pictures pp ON pp.application_id = ai.scholar_id
              JOIN personal_information pi ON pi.application_id = ai.application_id
              
              WHERE ai.is_application_approved = '0' 
                AND ai.is_application_rejected = '0'
                AND ai.type = 'Old' AND YEAR(ai.created_at) = $this->currentYear";
        
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
                ai.is_eligible_for_exam = '1' AND ai.batch IS NULL AND ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear
            ) OR (
                ai.is_eligible_for_exam = '1' AND ai.batch = 'Unassigned' AND ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear
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
                ai.is_for_initial_interview = '1' AND ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear
        ";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllReviewedApplicants($status) {
        $query = "";

        if ($status === "new") {
            $query = "SELECT 
                    pi.*, 
                    ai.*
                FROM personal_information pi
                JOIN application_info ai ON pi.application_id = ai.application_id
                WHERE 
                    (ai.is_application_approved = '1' OR ai.is_application_rejected = '1') AND 
                    ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear
                
                ";
        } else if ($status === 'old') {
            $query = "SELECT 
                ai.*,
                pi.*, 
                pp.*
              FROM application_info ai
                JOIN profile_pictures pp ON pp.application_id = ai.scholar_id
              JOIN personal_information pi ON pi.application_id = ai.application_id
              
              WHERE (ai.is_application_approved = '1' OR ai.is_application_rejected = '1')
                AND ai.type = 'Old' AND YEAR(ai.created_at) = $this->currentYear";
        }

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getApplicantsByBatch($batchValue) {
        $query = "SELECT pi.*, ai.*, b.schedule FROM personal_information pi 
            JOIN application_info ai ON ai.application_id = pi.application_id
            JOIN batches b ON ai.batch = b.batch_name 
            WHERE ai.batch = :batch AND YEAR(ai.created_at) = $this->currentYear";
        // $query = "SELECT application_id FROM application_info WHERE batch = :batch";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':batch', $batchValue);
        
        if (!$stmt->execute()) {
            return false;
        }
        
        // Return all matching student records
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getBatches() {
        // Get all students with the specified batch value
        $query = "SELECT pi.*, ai.*, b.schedule FROM personal_information pi 
            JOIN application_info ai ON ai.application_id = pi.application_id
            JOIN batches b ON ai.batch = b.batch_name 
            WHERE ai.is_eligible_for_exam = '1' AND (ai.batch IS NOT NULL AND ai.batch != 'Unassigned') AND YEAR(ai.created_at) = $this->currentYear";
        $stmt = $this->pdo->prepare($query);
        
        if (!$stmt->execute()) {
            return false;
        }
        
        // Return all matching student records
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
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





























    
}
?>