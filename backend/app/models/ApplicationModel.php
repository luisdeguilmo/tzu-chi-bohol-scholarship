<?php

namespace App\Models;

use Config\Database;

class ApplicationModel {
    private $table_name = "application_info";

    public $id;
    public $sy;
    public $case_no;
    public $created_at;

    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($data) {
        // Generate a unique random application_id
        $application_id = $this->generateUniqueApplicationId();
    
        $query = "INSERT INTO " . $this->table_name . " 
                  SET application_id = :application_id, school_year = :school_year, status = :status";
    
        $stmt = $this->pdo->prepare($query);
    
        // Sanitize and bind
        $school_year = htmlspecialchars(strip_tags($data['school_year']));
        $status = htmlspecialchars(strip_tags($data['status']));
    
        $stmt->bindParam(":application_id", $application_id);
        $stmt->bindParam(":school_year", $school_year);
        $stmt->bindParam(":status", $status);
    
        if ($stmt->execute()) {
            return $application_id;
        }
    
        return false;
    }       

    private function generateUniqueApplicationId($length = 7) {
        do {
            // Generate a random number (7-digit)
            $randomId = mt_rand(pow(10, $length - 1), pow(10, $length) - 1);
    
            // Check if it already exists
            $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM " . $this->table_name . " WHERE application_id = :id");
            $stmt->bindParam(":id", $randomId);
            $stmt->execute();
    
            $count = $stmt->fetchColumn();
        } while ($count > 0); // Retry if duplicate found
    
        return $randomId;
    }
    
}

?>