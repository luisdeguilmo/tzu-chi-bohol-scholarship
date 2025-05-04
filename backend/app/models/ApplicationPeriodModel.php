<?php 
namespace App\Models;
use Config\Database;

class ApplicationPeriodModel {
    private $pdo;
    public $table_name = "application_period";
    public $start_date;
    public $end_date;
    public $status;
    public $announcement_message;
    
    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }
    
    public function createApplicationPeriod($data) {
        // Check if there's already an active application period
        if ($this->hasActiveApplicationPeriod()) {
            throw new \Exception("Cannot create a new application period while there is an active one.");
        }
        
        // Validate dates
        if (strtotime($data['startDate']) > strtotime($data['endDate'])) {
            throw new \Exception("End date must be after start date.");
        }
        
        // Calculate status based on dates
        $status = $data['status'];
        
        $query = "INSERT INTO " . $this->table_name . " 
                  SET start_date = :start_date,
                  end_date = :end_date,
                  status = :status,
                  announcement_message = :announcement_message,
                  created_at = NOW()";
                  
        $stmt = $this->pdo->prepare($query);
        
        $start_date = htmlspecialchars(strip_tags($data['startDate']));
        $end_date = htmlspecialchars(strip_tags($data['endDate']));
        $announcement_message = htmlspecialchars(strip_tags($data['announcementMessage']));
        
        $stmt->bindParam(":start_date", $start_date);
        $stmt->bindParam(":end_date", $end_date);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":announcement_message", $announcement_message);
        
        return $stmt->execute();
    }
    
    public function updateApplicationPeriod($id, $data) {
        // Validate dates
        if (strtotime($data['startDate']) > strtotime($data['endDate'])) {
            throw new \Exception("End date must be after start date.");
        }
        
        // If status is provided, use it; otherwise calculate based on dates
        $status = isset($data['status']);
        // ? $data['status'] : $this->calculateStatus($data['startDate'], $data['endDate'])
        
        $query = "UPDATE " . $this->table_name . " 
                  SET start_date = :start_date,
                  end_date = :end_date,
                  status = :status,
                  announcement_message = :announcement_message,
                  updated_at = NOW()
                  WHERE id = :id";
                  
        $stmt = $this->pdo->prepare($query);
        
        $start_date = htmlspecialchars(strip_tags($data['startDate']));
        $end_date = htmlspecialchars(strip_tags($data['endDate']));
        $status = htmlspecialchars(strip_tags($data['status']));
        $announcement_message = htmlspecialchars(strip_tags($data['announcementMessage']));
        
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":start_date", $start_date);
        $stmt->bindParam(":end_date", $end_date);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":announcement_message", $announcement_message);
        
        return $stmt->execute();
    }
    
    public function getAllApplicationPeriods() {
        // Update all application period statuses first
        // $this->updateAllApplicationPeriodStatuses();
        
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
    
    public function getApplicationPeriodById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
    
    public function getLatestApplicationPeriod() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC LIMIT 1";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
    
    public function hasActiveApplicationPeriod() {
        // Update all application period statuses first
        // $this->updateAllApplicationPeriodStatuses();
        
        $query = "SELECT COUNT(*) FROM " . $this->table_name . " WHERE status = 'Active'";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }
    
    // private function updateAllApplicationPeriodStatuses() {
    //     $query = "SELECT id, start_date, end_date FROM " . $this->table_name;
    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->execute();
    //     $periods = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
    //     foreach ($periods as $period) {
    //         $status = $this->calculateStatus($period['start_date'], $period['end_date']);
            
    //         $updateQuery = "UPDATE " . $this->table_name . "
    //                        SET status = :status
    //                        WHERE id = :id";
    //         $updateStmt = $this->pdo->prepare($updateQuery);
    //         $updateStmt->bindParam(":status", $status);
    //         $updateStmt->bindParam(":id", $period['id']);
    //         $updateStmt->execute();
    //     }
    // }
    
    // private function calculateStatus($startDate, $endDate) {
    //     $currentDate = date('Y-m-d');
        
    //     if ($currentDate < $startDate) {
    //         return "Pending";
    //     } elseif ($currentDate >= $startDate && $currentDate <= $endDate) {
    //         return "Active";
    //     } else {
    //         return "Closed";
    //     }
    // }
}
?>