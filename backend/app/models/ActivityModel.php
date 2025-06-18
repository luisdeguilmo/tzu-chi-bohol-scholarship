<?php
namespace App\Models;

use Config\Database;

class ActivityModel {
    private $table_name = "volunteer_activities";
    
    public $id;
    public $application_id;
    public $activity_name;
    public $activity_date;
    public $activity_time;
    public $created_at;
    public $updated_at;
    public $startOfMonth;
    public $startOfNextMonth;
    
    private $pdo;
    
    public function __construct($pdo = null) {
        if ($pdo) {
            $this->pdo = $pdo;
        } else {
            $db = new Database();
            $this->pdo = $db->getConnection();       
            $this->startOfMonth = date('Y-m-01'); 
            $this->startOfNextMonth = date('Y-m-01', strtotime('first day of next month'));

        }
    }
    
    public function createActivity($activity_data) {
        $query = "INSERT INTO " . $this->table_name . " 
                   SET application_id = :application_id,
                        activity_name = :activity_name,
                       activity_date = :activity_date,
                       activity_time = :activity_time,
                       created_at = :created_at,
                       updated_at = :updated_at";
        
        $stmt = $this->pdo->prepare($query);
        
        // Sanitize inputs
        $this->application_id = htmlspecialchars(strip_tags($activity_data['application_id']));
        $this->activity_name = htmlspecialchars(strip_tags($activity_data['activity_name']));
        $this->activity_date = htmlspecialchars(strip_tags($activity_data['activity_date']));
        $this->activity_time = htmlspecialchars(strip_tags($activity_data['activity_time']));
        $this->created_at = date('Y-m-d H:i:s');
        $this->updated_at = date('Y-m-d H:i:s');
        
        // Bind values
        $stmt->bindParam(":application_id", $this->application_id);
        $stmt->bindParam(":activity_name", $this->activity_name);
        $stmt->bindParam(":activity_date", $this->activity_date);
        $stmt->bindParam(":activity_time", $this->activity_time);
        $stmt->bindParam(":created_at", $this->created_at);
        $stmt->bindParam(":updated_at", $this->updated_at);
        
        if ($stmt->execute()) {
            return $this->application_id;
        }
        
        return false;
    }

    public function getCurrentMonthActivities() {
        $query = "SELECT * FROM " . $this->table_name . " 
              WHERE activity_date >= :start_of_month AND activity_date < :start_of_next_month ORDER BY activity_date DESC, activity_time DESC";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':start_of_month', $this->startOfMonth);
        $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }  
    
    public function getScholarWithCurrentMonthActivities($tab) {
        $query = "SELECT 
                    pi.*, 
                    va.*,
                    ca.*
                FROM personal_information pi
                JOIN volunteer_activities va ON pi.application_id = va.application_id
                JOIN certificate_of_appearance ca ON pi.application_id = ca.application_id
                WHERE 
                    va.activity_date >= :start_of_month AND va.activity_date < :start_of_next_month AND va.activity_status = 'pending'";

        // $querys = "SELECT * FROM " . $this->table_name . " 
        //       WHERE activity_date >= :start_of_month AND activity_date < :start_of_next_month";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':start_of_month', $this->startOfMonth);
        $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    } 
    
    public function getAllActivities() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY activity_date DESC, activity_time DESC";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
    
    public function getActivityById($id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                   WHERE id = ?";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
    
    public function updateActivity($id, $activity_data) {
        $query = "UPDATE " . $this->table_name . " 
                   SET activity_name = :activity_name,
                       activity_date = :activity_date,
                       activity_time = :activity_time,
                       updated_at = :updated_at
                   WHERE id = :id";
        
        $stmt = $this->pdo->prepare($query);
        
        // Sanitize inputs
        $this->activity_name = htmlspecialchars(strip_tags($activity_data['activity_name']));
        $this->activity_date = htmlspecialchars(strip_tags($activity_data['activity_date']));
        $this->activity_time = htmlspecialchars(strip_tags($activity_data['activity_time']));
        $this->updated_at = date('Y-m-d H:i:s');
        
        // Bind values
        $stmt->bindParam(":activity_name", $this->activity_name);
        $stmt->bindParam(":activity_date", $this->activity_date);
        $stmt->bindParam(":activity_time", $this->activity_time);
        $stmt->bindParam(":updated_at", $this->updated_at);
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }
    
    public function deleteActivity($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(1, $id);
        
        return $stmt->execute();
    }
}
?>