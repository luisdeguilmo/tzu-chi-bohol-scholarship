<?php

// require_once __DIR__ . "/../../config/Database.php"

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class AwardingModel
{
    private $pdo;
    private $currentYear;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->currentYear = date('Y');
    }

    public function getApplicants($status, $sort, $schoolYear)
    {
        $query = "SELECT pi.*, ai.* FROM personal_information pi 
            JOIN application_info ai ON ai.application_id = pi.application_id WHERE ai.is_for_awarding = '1' AND ai.school_year = :school_year";

        if ($status === 'all') {
            $query .=
                " AND (ai.is_attended_awarding = '0' OR ai.is_attended_awarding = '1' OR ai.is_not_attended_awarding = '1' OR ai.is_not_attended_awarding = '0')";
        } elseif ($status === 'attended') {
            $query .= " AND ai.is_attended_awarding = '1'";
        } elseif ($status === 'not_attended') {
            $query .= " AND ai.is_not_attended_awarding = '1'";
        } elseif ($status === 'pending') {
            $query .= " AND ai.is_attended_awarding = '0' AND ai.is_not_attended_awarding = '0'";
        }

        if ($sort === 'newest') {
            $query .= ' ORDER BY ai.created_at DESC';
        } elseif ($sort === 'oldest') {
            $query .= ' ORDER BY ai.created_at ASC';
        } elseif ($sort === 'name') {
            $query .= ' ORDER BY pi.first_name ASC';
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $schoolYear, \PDO::PARAM_INT);

        if (!$stmt->execute()) {
            return false;
        }

        // Return all matching student records
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function updateStatusToAttended($data)
    {
        $query =
            "UPDATE application_info SET status = 'is_attended_awarding', is_attended_awarding = '1', is_not_attended_awarding = '0' WHERE application_id = :account_id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $data['account_id'], \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function updateStatusToNotAttended($data)
    {
        $query =
            "UPDATE application_info SET is_attended_awarding = '0', is_not_attended_awarding = '1' WHERE application_id = :account_id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $data['account_id'], \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function updateStatusToPending($data)
    {
        $query =
            "UPDATE application_info SET is_attended_awarding = '0', is_not_attended_awarding = '0' WHERE application_id = :account_id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $data['account_id'], \PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>
