<?php

namespace App\Models;

use Config\Database;

class RenderedHoursModel {
    public $table_name = 'scholars';
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function recordHours($accountId, $renderedHours) {
        $scholarRenderedHours = $this->getScholarRenderedHoursById($accountId);
        if (!$scholarRenderedHours && $scholarRenderedHours !== 0) {
            throw new \Exception('Scholar not found');
        }

        $query = "UPDATE " . $this->table_name . " SET rendered_hours = :rendered_hours WHERE account_id = :account_id";

        $stmt = $this->pdo->prepare($query);

        $rendered_hours = strip_tags($renderedHours + $scholarRenderedHours);

        $stmt->bindParam(':rendered_hours', $rendered_hours);
        $stmt->bindParam(':account_id', $accountId);

        return $stmt->execute();
    }

    public function getScholarById($account_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE account_id = :account_id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":account_id", $account_id);
        $stmt->execute();
        
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getScholarRenderedHoursById($account_id) {
        $query = "SELECT rendered_hours FROM " . $this->table_name . " WHERE account_id = :account_id";

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':account_id', $account_id, \PDO::PARAM_INT);

        $stmt->execute();
        
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
                
        if ($row) {
            // Return the complete URL to access the file
            return $row['rendered_hours'];
        }
                
        return null;
    }
}

?>