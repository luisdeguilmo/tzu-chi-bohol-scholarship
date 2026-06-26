<?php

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class MonthlyAllowanceSummaryModel
{
    private $table_name = 'allowance_cycles';
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getMonthlyAllowanceSummary($year, $month, $sort)
    {
        $query =
            'SELECT id, cycle_month, allowance_month, cutoff_date, is_processed, processed_at, file_name FROM ' .
            $this->table_name;

        if ($month !== 'all_months' && $year !== 'all_years') {
            $query .= " WHERE MONTH(allowance_month) = '$month' AND YEAR(allowance_month)  = '$year'";
        } elseif ($month !== 'all_months' && $year === 'all_years') {
            $query .= " WHERE MONTH(allowance_month) = '$month'";
        } elseif ($month === 'all_months' && $year !== 'all_years') {
            $query .= " WHERE YEAR(allowance_month)  = '$year'";
        }

        if ($sort === 'newest') {
            $query .= ' ORDER BY cutoff_date DESC';
        } elseif ($sort === 'oldest') {
            $query .= ' ORDER BY cutoff_date ASC';
        }

        $stmt = $this->pdo->query($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}

?>
