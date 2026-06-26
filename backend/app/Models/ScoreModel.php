<?php 

namespace App\Models;

use Config\Database;

class ScoreModel {
    private $table_name = "application_info";

    public $id;
    public $score;
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getBatches() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
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

    public function createScore($data, $id) {
        try {
            $query = "UPDATE " . $this->table_name . " SET score = :score WHERE application_id = :application_id";
            $stmt = $this->pdo->prepare($query);
            
            if (!isset($data['score'])) {
                throw new \Exception("Score data is required");
            }
            
            $score = htmlspecialchars(strip_tags($data['score']));
            
            $stmt->bindParam(":score", $score);
            $stmt->bindParam(":application_id",  $id);
            
            return $stmt->execute();
        
        } catch (\Exception $e) {
            error_log("createScore error: " . $e->getMessage());
            throw $e;
        }
    }
}
?>