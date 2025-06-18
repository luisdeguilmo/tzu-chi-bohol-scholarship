<?php 
namespace App\Models;
use Config\Database;

class EventsModel {
    private $pdo;
    public $table_name = "events";
    public $event_name;
    public $event_date;
    public $event_time;
    public $event_location;
    public $announcement_message;
    public $currentDate;
    public $currentTime;
    public $currentDateTime;

    public function __construct() {
        // Set timezone and initialize date/time properties in constructor
        date_default_timezone_set('Asia/Manila');
        $this->currentDate = date('Y-m-d');
        $this->currentTime = date('H:i:s');
        $this->currentDateTime = date('Y-m-d H:i:s');
        
        $db = new Database();
        $this->pdo = $db->getConnection();
    }
    
    public function createEvent($data) {
        // Check if there's already an active application period
        
        // Calculate status based on dates
        // $status = $data['status'];
        
        $query = "INSERT INTO " . $this->table_name . " 
                  SET event_name = :event_name,
                  date= :event_date,
                  time= :event_time,
                  event_location = :event_location,
                  created_at = NOW()";
                  
        $stmt = $this->pdo->prepare($query);
        
        $event_name = strip_tags($data['event_name']);
        $event_date = strip_tags($data['event_date']);
        $event_time = strip_tags($data['event_time']);
        $event_location = strip_tags($data['event_location']);
        
        $stmt->bindParam(":event_name", $event_name);
        $stmt->bindParam(":event_date", $event_date);
        $stmt->bindParam(":event_time", $event_time);
        $stmt->bindParam(":event_location", $event_location);
        
        return $stmt->execute();
    }
    
    public function updateEvent($id, $data) {
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
        // $announcement_message = htmlspecialchars(strip_tags($data['announcementMessage']));
        
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":start_date", $start_date);
        $stmt->bindParam(":end_date", $end_date);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":announcement_message", $announcement_message);
        
        return $stmt->execute();
    }
    
    public function getAllEvents() {
        // Update all application period statuses first
        // $this->updateAllApplicationPeriodStatuses();
        
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY date DESC, time DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getUpcomingEvents() {
        $query = "SELECT * FROM " . $this->table_name . " 
                WHERE CONCAT(date, ' ', time) > :current_datetime 
                ORDER BY date ASC, time ASC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":current_datetime", $this->currentDateTime);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getEndedEvents() {
        $query = "SELECT * FROM " . $this->table_name . " 
                WHERE CONCAT(date, ' ', time) < :current_datetime 
                ORDER BY date DESC, time DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":current_datetime", $this->currentDateTime);
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
    
}
?>