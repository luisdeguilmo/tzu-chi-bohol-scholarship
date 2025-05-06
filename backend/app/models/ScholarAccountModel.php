<?php
namespace App\Models;

use Config\Database;

class ScholarAccountModel {
    private $table_name = "application_info";
    private $scholar_table = "scholars";
    
    public $id;
    public $email;
    public $password;
    public $application_id;
    private $pdo;
    
    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getCreatedAccounts() {
        $query = "SELECT * FROM " . $this->scholar_table;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
    
    public function getPendingScholars($application_status) {
        try {
            $query = "SELECT * FROM " . $this->table_name . " ai 
                     JOIN personal_information pi ON ai.application_id = pi.application_id 
                     WHERE application_status = :application_status";
            $stmt = $this->pdo->prepare($query);
            
            $stmt->bindParam(":application_status", $application_status);
            $stmt->execute();
            
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }

    public function getPendingScholarById($application_id) {
        $query = "SELECT pi.email, ai.application_id 
                  FROM " . $this->table_name . " ai 
                  JOIN personal_information pi ON ai.application_id = pi.application_id 
                  WHERE ai.application_id = :application_id";
                  
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":application_id", $application_id, \PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
    
    public function updateApplicationStatusToScholar($application_id) {
        $query = "UPDATE application_info SET application_status = :application_status 
                 WHERE application_id = :application_id";
        $stmt = $this->pdo->prepare($query);
        $status = 'Scholar';
        $stmt->bindParam(':application_status', $status);
        $stmt->bindParam(':application_id', $application_id);
        return $stmt->execute();
    }
    
    public function createAccount($application_id, $today) {
        // Get scholar data first
        $scholarData = $this->getPendingScholarById($application_id);
        if (!$scholarData) {
            throw new \Exception("Scholar application not found");
        }
        
        $query = "INSERT INTO scholars (email, password, created_at, application_id) 
                 VALUES (:email, :password, :created_at, :application_id)";
        $stmt = $this->pdo->prepare($query);
        
        // Use email from the query result
        $email = $scholarData['email'];
        
        // Create a secure password hash - using application_id as initial password
        $hashedPassword = password_hash($scholarData['application_id'], PASSWORD_DEFAULT);
        
        // Sanitize application_id
        $sanitized_application_id = htmlspecialchars(strip_tags($application_id));
        $sanitized_created_at = htmlspecialchars(strip_tags($today));
        
        // Bind values
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $hashedPassword);
        $stmt->bindParam(":created_at", $sanitized_created_at);
        $stmt->bindParam(":application_id", $sanitized_application_id);
        
        return $stmt->execute();
    }
}

?>