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

    // public function getMonthlyAllowanceSummary()
    // {
    //     $query = 'SELECT * FROM ' . $this->table_name;
    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->execute();
    //     return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    // }

    public function getMonthlyAllowanceSummary($year, $month)
    {
        $query = 'SELECT * FROM ' . $this->table_name;

        if ($month !== 'all_months' && $year !== 'all_years') {
            $query .= " WHERE MONTH(cycle_month) = '$month' AND YEAR(cycle_month)  = '$year'";
        } elseif ($month !== 'all_months' && $year === 'all_years') {
            $query .= " WHERE MONTH(cycle_month) = '$month'";
        } elseif ($month === 'all_months' && $year !== 'all_years') {
            $query .= " WHERE YEAR(cycle_month)  = '$year'";
        }

        // $query .= ' ORDER BY ai.created_at DESC';

        // if ($sort === 'newest') {
        //     $query .= ' ORDER BY ai.created_at DESC';
        // } elseif ($sort === 'oldest') {
        //     $query .= ' ORDER BY ai.created_at ASC';
        // } elseif ($sort === 'name') {
        //     $query .= ' ORDER BY pi.first_name ASC';
        // }

        $stmt = $this->pdo->query($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}

?>
