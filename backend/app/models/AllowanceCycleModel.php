<?php
namespace App\Models;
date_default_timezone_set('Asia/Manila');
use Config\Database;

class AllowanceCycleModel
{
    private $table_name = 'allowance_cycles';
    private $pdo;
    private $currentMonth;
    private $currentDate;
    private $currentYearAndMonth;
    private $previousYearAndMonth;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->currentMonth = date('m');
        $this->currentDate = date('Y-m-d');
        $this->currentYearAndMonth = date('Y-m');
        // Get previous month in Y-m format
        $this->previousYearAndMonth = date('Y-m', strtotime('-1 month'));
    }

    public function getById($id)
    {
        // Add parameter $id to the method signature
        $query = "SELECT id, file_name, file_data, created_at FROM {$this->table_name} WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);

        // Return the entire row or null if not found
        return $result ?: null;
    }

    public function storeExcelFile($fileName, $fileData)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " SET file_name = :file_name, file_data = :file_data WHERE DATE_FORMAT(cycle_month, '%Y-%m') = :cycle_month";

        $stmt = $this->pdo->prepare($query);

        // Bind parameters
        $stmt->bindParam(':file_name', $fileName);
        $stmt->bindParam(':file_data', $fileData, \PDO::PARAM_LOB);
        $stmt->bindParam(':cycle_month', $this->previousYearAndMonth);

        if ($stmt->execute()) {
            return [
                'success' => true,
                'id' => $this->pdo->lastInsertId(),
                'message' => 'File uploaded successfully',
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to upload file',
        ];
    }

    public function storeTotalAmount($amount)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " SET amount = :amount WHERE DATE_FORMAT(cycle_month, '%Y-%m') = :cycle_month";

        $stmt = $this->pdo->prepare($query);

        // Bind parameters
        $stmt->bindParam(':amount', $amount);
        $stmt->bindParam(':cycle_month', $this->previousYearAndMonth);

        return $stmt->execute();
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

    /**
     * Check if there's a cycle ready to process
     * Returns true if the PREVIOUS month's cycle can be processed now
     */
    public function hasCycleReadyToProcess()
    {
        $pending = $this->getPendingCycles();
        return !empty($pending);
    }

    /**
     * Process allowance cycle for the PREVIOUS month
     * When called in November, this marks October as processed
     * October hours â†’ November allowance
     */
    public function processAllowanceCycle()
    {
        // Process the PREVIOUS month's cycle
        $query = "UPDATE {$this->table_name} 
                  SET is_processed = 1, processed_at = NOW() 
                  WHERE DATE_FORMAT(cycle_month, '%Y-%m') = :cycle_month
                  AND is_processed = 0";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':cycle_month', $this->previousYearAndMonth);
        $result = $stmt->execute();

        // Return the cycle month that was processed
        if ($result && $stmt->rowCount() > 0) {
            return [
                'success' => true,
                'rendered_month' => $this->previousYearAndMonth,
                'allowance_month' => $this->currentMonth,
            ];
        }

        return [
            'success' => false,
            'rendered_month' => null,
            'allowance_month' => null,
        ];
    }

    /**
     * Check if the previous month's cycle is already processed
     * In November, checks if October is processed
     */
    public function isPreviousMonthProcessed()
    {
        $query = "SELECT is_processed FROM {$this->table_name} 
                  WHERE DATE_FORMAT(cycle_month, '%Y-%m') = :cycle_month";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':cycle_month', $this->previousYearAndMonth);
        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);

        return $result && (bool) $result['is_processed'];
    }

    /**
     * Create yearly cycles
     * Each cycle represents a RENDERED month
     */

    // public function createYearlyCycles($year = null)
    // {
    //     if ($year === null) {
    //         $year = date('Y');
    //     }

    //     $cycles = [];

    //     for ($month = 1; $month <= 12; $month++) {
    //         // Cycle month: first day of the rendered month
    //         $cycleMonth = sprintf('%d-%02d-01', $year, $month);

    //         // Cutoff: last day of the rendered month
    //         $lastDay = date('t', strtotime($cycleMonth));
    //         $cutoffDate = sprintf('%d-%02d-%d', $year, $month, $lastDay);

    //         // Check if cycle already exists
    //         $checkQuery = "SELECT id FROM {$this->table_name}
    //                       WHERE cycle_month = :cycle_month";
    //         $stmt = $this->pdo->prepare($checkQuery);
    //         $stmt->bindParam(':cycle_month', $cycleMonth);
    //         $stmt->execute();

    //         if (!$stmt->fetch()) {
    //             // Insert new cycle
    //             $insertQuery = "INSERT INTO {$this->table_name}
    //                            (cycle_month, cutoff_date)
    //                            VALUES (:cycle_month, :cutoff_date)";
    //             $insertStmt = $this->pdo->prepare($insertQuery);
    //             $insertStmt->bindParam(':cycle_month', $cycleMonth);
    //             $insertStmt->bindParam(':cutoff_date', $cutoffDate);
    //             $insertStmt->execute();

    //             $cycles[] = [
    //                 'rendered_month' => $cycleMonth,
    //                 'cutoff' => $cutoffDate,
    //                 'allowance_month' => date(
    //                     'Y-m-01',
    //                     strtotime('+1 month', strtotime($cycleMonth)),
    //                 ),
    //             ];
    //         }
    //     }

    //     return $cycles;
    // }

    public function createYearlyCycles($year = null)
    {
        if ($year === null) {
            $year = date('Y');
        }

        $cycles = [];

        for ($month = 1; $month <= 12; $month++) {
            // Cycle month: first day of the rendered month
            $cycleMonth = sprintf('%d-%02d-01', $year, $month);

            $allowanceMonth = date('Y-m-01', strtotime('+1 month', strtotime($cycleMonth)));

            // Cutoff: last day of the rendered month
            $lastDay = date('t', strtotime($cycleMonth));
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
                               (cycle_month, allowance_month, cutoff_date) 
                               VALUES (:cycle_month, :allowance_month, :cutoff_date)";
                $insertStmt = $this->pdo->prepare($insertQuery);
                $insertStmt->bindParam(':cycle_month', $cycleMonth);
                $insertStmt->bindParam(':allowance_month', $allowanceMonth);
                $insertStmt->bindParam(':cutoff_date', $cutoffDate);
                $insertStmt->execute();

                $cycles[] = [
                    'rendered_month' => $cycleMonth,
                    'cutoff' => $cutoffDate,
                    'allowance_month' => date(
                        'Y-m-01',
                        strtotime('+1 month', strtotime($cycleMonth)),
                    ),
                ];
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

    /**
     * Reset the most recently processed cycle
     */
    public function resetAllowanceCycle()
    {
        // Find the most recent processed cycle
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
     * Get the current processable cycle info
     * Returns info about the previous month (rendered month)
     */
    public function getCurrentProcessableCycle()
    {
        $query = "SELECT *, 
                  DATE_FORMAT(cycle_month, '%Y-%m') as rendered_month,
                  DATE_FORMAT(DATE_ADD(cycle_month, INTERVAL 1 MONTH), '%Y-%m') as allowance_month
                  FROM {$this->table_name} 
                  WHERE DATE_FORMAT(cycle_month, '%Y-%m') = :previous_month
                  AND is_processed = 0
                  AND is_reset = 0";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':previous_month', $this->previousYearAndMonth);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    /**
     * Get next upcoming cycle (after the current processable one)
     */
    public function getNextCycleInfo()
    {
        $query = "SELECT *,
                  DATE_FORMAT(cycle_month, '%Y-%m') as rendered_month,
                  DATE_FORMAT(DATE_ADD(cycle_month, INTERVAL 1 MONTH), '%Y-%m') as allowance_month
                  FROM {$this->table_name} 
                  WHERE cutoff_date > :current_date 
                  AND is_processed = 0
                  AND is_reset = 0
                  ORDER BY cycle_month ASC
                  LIMIT 1";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':current_date', $this->currentDate);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    /**
     * Get all cycles with their status for display
     * Includes rendered month â†’ allowance month mapping
     */
    public function getAllCyclesWithStatus($year = null)
    {
        if ($year === null) {
            $year = date('Y');
        }

        $query = "SELECT *,
                  DATE_FORMAT(cycle_month, '%M %Y') as rendered_month_formatted,
                  DATE_FORMAT(DATE_ADD(cycle_month, INTERVAL 1 MONTH), '%M %Y') as allowance_month_formatted,
                  DATE_FORMAT(cutoff_date, '%M %d, %Y') as cutoff_formatted,
                  DATE_FORMAT(processed_at, '%M %d, %Y') as processed_formatted
                  FROM {$this->table_name}
                  WHERE YEAR(cycle_month) = :year
                  ORDER BY cycle_month DESC";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':year', $year);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}
?>
