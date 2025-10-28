<?php
namespace App\Models;
date_default_timezone_set('Asia/Manila');
use Config\Database;

class AllowanceCycleModel
{
    private $table_name = 'allowance_cycles';
    private $pdo;
    private $currentDate;
    private $currentYearAndMonth;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->currentDate = date('Y-m-d');
        $this->currentYearAndMonth = date('Y-m');
    }

    public function getPendingCycles()
    {
        $query = "SELECT * FROM {$this->table_name} 
                  WHERE cutoff_date <= :current_date 
                  AND is_processed = 0
                  AND is_reset = 0
                  ORDER BY cycle_month ASC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':current_date', $this->currentDate);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function isCycleProcessed()
    {
        $query = "SELECT is_processed FROM {$this->table_name} WHERE DATE_FORMAT(cycle_month, '%Y-%m') = :cycle_month";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':cycle_month', $this->currentYearAndMonth);
        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);

        return $result && (bool) $result['is_processed'];
    }

    public function hasCycleReadyToProcess()
    {
        $pending = $this->getPendingCycles();
        return !empty($pending);
    }

    // public function processAllowanceCycle()
    // {
    //     $pending = $this->getPendingCycles();

    //     if (empty($pending)) {
    //         return false; // Nothing to process
    //     }

    //     // Process the oldest cycle
    //     $cycleToProcess = $pending[0];

    //     $query = "UPDATE {$this->table_name}
    //               SET is_processed = 1, processed_at = NOW()
    //               WHERE id = :id";
    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->bindParam(':id', $cycleToProcess['id']);
    //     return $stmt->execute();
    // }

    public function processAllowanceCycle()
    {
        $query = "UPDATE {$this->table_name} 
          SET is_processed = 1, processed_at = NOW() 
          WHERE DATE_FORMAT(cycle_month, '%Y-%m') = :cycle_month";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':cycle_month', $this->currentYearAndMonth);
        return $stmt->execute();
    }

    public function createYearlyCycles($year = null)
    {
        if ($year === null) {
            $year = date('Y');
        }

        $cycles = [];

        for ($month = 1; $month <= 12; $month++) {
            // Cycle month: first day of the month
            $cycleMonth = sprintf('%d-%02d-01', $year, $month);

            // Cutoff: last day of the month
            $lastDay = date('t', strtotime($cycleMonth)); // Get last day of month
            $cutoffDate = sprintf('%d-%02d-%d', $year, $month, $lastDay);

            // Check if cycle already exists
            $checkQuery = "SELECT id FROM {$this->table_name} 
                          WHERE cycle_month = :cycle_month";
            $stmt = $this->pdo->prepare($checkQuery);
            $stmt->bindParam(':cycle_month', $cycleMonth);
            $stmt->execute();

            if (!$stmt->fetch()) {
                // Insert new cycle
                $insertQuery = "INSERT INTO {$this->table_name} 
                               (cycle_month, cutoff_date) 
                               VALUES (:cycle_month, :cutoff_date)";
                $insertStmt = $this->pdo->prepare($insertQuery);
                $insertStmt->bindParam(':cycle_month', $cycleMonth);
                $insertStmt->bindParam(':cutoff_date', $cutoffDate);
                $insertStmt->execute();

                $cycles[] = ['month' => $cycleMonth, 'cutoff' => $cutoffDate];
            }
        }

        return $cycles;
    }

    public function createCycleWithCutoff($cycleMonth, $cutoffDate)
    {
        $query = "INSERT INTO {$this->table_name} 
                  (cycle_month, cutoff_date) 
                  VALUES (:cycle_month, :cutoff_date)";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':cycle_month', $cycleMonth);
        $stmt->bindParam(':cutoff_date', $cutoffDate);
        return $stmt->execute();
    }

    public function cyclesExistForYear($year)
    {
        $stmt = $this->pdo->prepare(
            'SELECT COUNT(*) FROM allowance_cycles WHERE YEAR(cycle_month) = ?',
        );
        $stmt->execute([$year]);
        return $stmt->fetchColumn() > 0;
    }

    public function cycleExists($startDate)
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM allowance_cycles WHERE start_date = ?');
        $stmt->execute([$startDate]);
        return $stmt->fetchColumn() > 0;
    }

    public function resetAllowanceCycle()
    {
        // Reset the most recent processed cycle
        $findQuery = "SELECT cycle_month
                      FROM {$this->table_name}
                      WHERE is_reset = 0 AND is_processed = 1
                      ORDER BY processed_at DESC
                      LIMIT 1";
        $stmt = $this->pdo->prepare($findQuery);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$row) {
            return false;
        }

        $cycleToReset = $row['cycle_month'];

        $updateQuery = "UPDATE {$this->table_name}
                       SET is_reset = 1, reset_at = NOW()
                       WHERE cycle_month = :cycle_month";
        $updateStmt = $this->pdo->prepare($updateQuery);
        $updateStmt->bindParam(':cycle_month', $cycleToReset);
        return $updateStmt->execute();
    }

    /**
     * Get upcoming cycle info (for display)
     */
    public function getNextCycleInfo()
    {
        $query = "SELECT * FROM {$this->table_name} 
                  WHERE cutoff_date > :current_date 
                  AND is_processed = 0
                  ORDER BY cycle_month ASC
                  LIMIT 1";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':current_date', $this->currentDate);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
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
