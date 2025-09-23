<?php 

namespace App\Models;

use Config\Database;

class SettingsModel {
    private $table_name = "settings";

    public $id;
    public $score;
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getPassingScore() {
        $query = "SELECT passing_score FROM " . $this->table_name;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();    
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            return $row['passing_score'];
        }

        return null;
    }

    public function createPassingScore($data) {
        try {
            $query = "UPDATE " . $this->table_name . " SET passing_score = :passing_score";
            $stmt = $this->pdo->prepare($query);
           
            $passing_score = htmlspecialchars(strip_tags($data['passing_score']));
            
            $stmt->bindParam(":passing_score", $passing_score);
            
            return $stmt->execute();
        
        } catch (\Exception $e) {
            error_log("createScore error: " . $e->getMessage());
            throw $e;
        }
    }
}
?>