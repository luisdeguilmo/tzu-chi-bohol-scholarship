<?php 

namespace App\Models;

use Config\Database;

class BatchModel {
    private $table_name = "batches";

    public $id;
    public $batch_name;
    public $schedule;
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    // public function create($file_data, $application_id) {
    //     $query = "INSERT INTO " . $this->table_name . " 
    //               SET batch_name = :batch_name";

    //     $stmt = $this->pdo->prepare($query);

    //     // Sanitize inputs
    //     $this->batch_name = htmlspecialchars(strip_tags($file_data['batch_name']));

    //     // Bind values
    //     $stmt->bindParam(":batch_name", $this->batch_name);

    //     return $stmt->execute();
    // }

    public function addColumn() {
        
    }
 
    public function getBatches() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getBatchById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE batch_name = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function deleteBatch($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE batch_name = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }

    public function createBatch($data) {
        $query = "INSERT INTO " . $this->table_name . "
                  SET batch_name = :batch_name";
        
        $stmt = $this->pdo->prepare($query);
        
        // Extract batch_name from the data array
        $batch_name = htmlspecialchars(strip_tags($data['batch_name']));
        
        $stmt->bindParam(":batch_name", $batch_name);
        
        return $stmt->execute();
    }

    public function createSchedule($data, $id) {
    try {
        $query = "UPDATE " . $this->table_name . " SET schedule = :schedule WHERE batch_name = :batch_name";
        $stmt = $this->pdo->prepare($query);
        
        if (!isset($data['schedule'])) {
            throw new \Exception("Schedule data is required");
        }
        
        $schedule = htmlspecialchars(strip_tags($data['schedule']));
        
        $stmt->bindParam(":schedule", $schedule);
        $stmt->bindParam(":batch_name",  $id);
        
        return $stmt->execute();
    
    } catch (\Exception $e) {
        error_log("createSchedule error: " . $e->getMessage());
        throw $e;
    }
}

    // public function delete($id) {
    //     // First, get the file path to delete the actual file
    //     $query = "SELECT file_path FROM " . $this->table_name . " WHERE id = ?";
    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->bindParam(1, $id);
    //     $stmt->execute();
        
    //     $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        
    //     if ($row) {
    //         // Get absolute path by appending document root
    //         $file_path = $_SERVER['DOCUMENT_ROOT'] . $row['file_path'];
            
    //         // Delete the physical file if it exists
    //         if (file_exists($file_path)) {
    //             unlink($file_path);
    //         }
            
    //         // Now delete the database record
    //         $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
    //         $stmt = $this->pdo->prepare($query);
    //         $stmt->bindParam(1, $id);
            
    //         if($stmt->execute()) {
    //             return true;
    //         }
    //     }
        
    //     return false;
    // }
}
?>