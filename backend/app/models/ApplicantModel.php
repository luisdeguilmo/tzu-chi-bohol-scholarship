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
    
    public function getAllApplicants() {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.application_status IS NULL";
        
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }

    // public function getAllApplicants() {
    //     $query = "SELECT pi.* FROM personal_information pi";
    //     $stmt = $this->pdo->query($query);
    //     return $stmt->fetchAll();
    // }
    
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
                  WHERE ai.application_status = 'approved'";
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }
    
    public function getApprovedNewApplicants() {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.application_status = 'approved' AND ai.status = 'new'";
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }

    public function getApplicantsExamination() {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.application_status = 'examination'";
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }

    public function getUnassignedApplicants() {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.application_status = 'examination' AND ai.batch = 'Unassigned'";
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
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
                  WHERE ai.application_status = 'approved' AND ai.status = 'renewal'";
        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }
    
    public function getApplicantsByStatus($status, $types = ['new', 'renewal']) {
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
}
?>