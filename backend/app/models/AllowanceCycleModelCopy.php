<?php

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class AllowanceCycleModel
{
    private $table_name = 'allowance_cycles';
    private $pdo;
    private $currentYearAndMonth;
    private $currentDate;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->currentYearAndMonth = date('Y-m');
        $this->currentDate = date('Y-m-d');
    }

    public function isCycleStartedThisMonth()
    {
        $query = "SELECT id FROM {$this->table_name} WHERE DATE_FORMAT(cycle_month, '%Y-%m') = :cycle_month LIMIT 1";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':cycle_month', $this->currentYearAndMonth);
        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);

        return $result && (bool) $result['id'];
    }

    public function createNewCycle()
    {
        $query = 'INSERT INTO ' . $this->table_name . ' SET cycle_month = :cycle_month';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':cycle_month', $this->currentDate);
        return $stmt->execute();
    }

    public function processAllowanceCycle()
    {
        $query = "UPDATE {$this->table_name} 
          SET is_processed = 1, processed_at = NOW() 
          WHERE DATE_FORMAT(cycle_month, '%Y-%m') = :cycle_month";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':cycle_month', $this->currentYearAndMonth);
        return $stmt->execute();
    }

    // public function resetAllowanceCycle()
    // {
    //     $query = "UPDATE {$this->table_name}
    //       SET is_reset = 1, reset_at = NOW()
    //       WHERE cycle_month = :cycle_month";

    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->bindParam(':cycle_month', $this->currentYearAndMonth);
    //     return $stmt->execute();
    // }

    public function resetAllowanceCycle()
    {
        // Step 1: Find the most recent cycle that hasn't been reset yet
        $findQuery = "SELECT cycle_month 
                  FROM {$this->table_name} 
                  WHERE is_reset = 0 
                  ORDER BY cycle_month DESC 
                  LIMIT 1";

        $stmt = $this->pdo->prepare($findQuery);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$row) {
            // Nothing to reset
            return false;
        }

        // Use the found cycle_month for the reset
        $cycleToReset = $row['cycle_month'];

        // Step 2: Reset that cycle
        $updateQuery = "UPDATE {$this->table_name} 
                    SET is_reset = 1, reset_at = NOW() 
                    WHERE cycle_month = :cycle_month";

        $updateStmt = $this->pdo->prepare($updateQuery);
        $updateStmt->bindParam(':cycle_month', $cycleToReset);

        return $updateStmt->execute();
    }

    public function isCurrentMonthProcessed()
    {
        $query = "SELECT is_processed FROM {$this->table_name} WHERE DATE_FORMAT(cycle_month, '%Y-%m') = :cycle_month";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':cycle_month', $this->currentYearAndMonth);
        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);

        return $result && (bool) $result['is_processed'];
    }
}

?>
