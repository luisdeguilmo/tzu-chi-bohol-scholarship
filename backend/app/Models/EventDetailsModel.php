<?php
namespace App\Models;

use Config\Database;

class EventDetailsModel {
    private $table_name = "certificate_of_appearance";
    
    public $id;
    public $application_id;
    public $event_name;
    public $event_date;
    
    private $pdo;
    
    public function __construct($pdo = null) {
        if ($pdo) {
            $this->pdo = $pdo;
        } else {
            $db = new Database();
            $this->pdo = $db->getConnection();
        }
    }
    
    public function createEvent($data) {
        $query = "INSERT INTO " . $this->table_name . "
                 (application_id, event_name, event_date)
                 VALUES (:application_id, :event_name, :event_date)";
        
        $stmt = $this->pdo->prepare($query);
        
        // Sanitize inputs
        $application_id = htmlspecialchars(strip_tags($data['id']));
        $event_name = htmlspecialchars(strip_tags($data['event_name']));
        $event_date = htmlspecialchars(strip_tags($data['event_date']));
        
        // Bind parameters
        $stmt->bindParam(":application_id", $application_id);
        $stmt->bindParam(":event_name", $event_name);
        $stmt->bindParam(":event_date", $event_date);
        
        if ($stmt->execute()) {
            return $application_id;
        }
        
        return false;
    }
}