<?php

// require_once __DIR__ . "/../../config/Database.php"

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class OrientationModel
{
    private $pdo;
    private $currentYear;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->currentYear = date('Y');
    }

    public function getApplicantsByBatch($status, $sort, $batchValue, $schoolYear)
    {
        $query = "SELECT 
                pi.last_name, pi.middle_name, pi.first_name, pi.email, 
                ai.application_id, ai.batch_for_orientation, ai.is_attended_orientation, ai.is_not_attended_orientation,
                b.purpose, 
                b.schedule 
                FROM personal_information pi 
            JOIN application_info ai ON ai.application_id = pi.application_id
            JOIN batches b ON ai.batch_for_orientation = b.batch_name 
            WHERE ai.is_for_orientation = '1' AND b.purpose = 'orientation' AND ai.batch_for_orientation = :batch AND ai.school_year = :school_year";

        if ($status === 'all') {
            $query .=
                " AND (ai.is_attended_orientation = '0' OR ai.is_attended_orientation = '1' OR ai.is_not_attended_orientation = '1' OR ai.is_not_attended_orientation = '0')";
        } elseif ($status === 'attended') {
            $query .= " AND ai.is_attended_orientation = '1'";
        } elseif ($status === 'not_attended') {
            $query .= " AND ai.is_not_attended_orientation = '1'";
        } elseif ($status === 'pending') {
            $query .=
                " AND ai.is_attended_orientation = '0' AND ai.is_not_attended_orientation = '0'";
        }

        if ($sort === 'newest') {
            $query .= ' ORDER BY ai.created_at DESC';
        } elseif ($sort === 'oldest') {
            $query .= ' ORDER BY ai.created_at ASC';
        } elseif ($sort === 'name') {
            $query .= ' ORDER BY pi.first_name ASC';
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':batch', $batchValue);
        $stmt->bindParam(':school_year', $schoolYear, \PDO::PARAM_INT);
        // $stmt->execute();
        // return $stmt->fetchAll(\PDO::FETCH_ASSOC);

        if (!$stmt->execute()) {
            return false;
        }

        // Return all matching student records
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getBatches($status, $sort, $schoolYear)
    {
        // Get all students with the specified batch value
        $query = "SELECT 
                pi.last_name, pi.first_name, pi.middle_name, pi.email, 
                ai.application_id, ai.batch_for_orientation, ai.is_attended_orientation, ai.is_not_attended_orientation,
                b.purpose, 
                b.schedule 
                FROM personal_information pi 
            JOIN application_info ai ON ai.application_id = pi.application_id
            JOIN batches b ON ai.batch_for_orientation = b.batch_name 
            WHERE ai.is_for_orientation = '1' AND b.purpose = 'orientation' AND (ai.batch_for_orientation IS NOT NULL AND ai.batch_for_orientation != 'Unassigned') AND ai.school_year = :school_year";

        if ($status === 'all') {
            $query .=
                " AND (ai.is_attended_orientation = '0' OR ai.is_attended_orientation = '1' OR ai.is_not_attended_orientation = '1' OR ai.is_not_attended_orientation = '0')";
        } elseif ($status === 'attended') {
            $query .= " AND ai.is_attended_orientation = '1'";
        } elseif ($status === 'not_attended') {
            $query .= " AND ai.is_not_attended_orientation = '1'";
        } elseif ($status === 'pending') {
            $query .=
                " AND ai.is_attended_orientation = '0' AND ai.is_not_attended_orientation = '0'";
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

    public function assignApplicants($studentId, $batchValue)
    {
        // Update the specific student record
        $updateQuery =
            'UPDATE application_info SET batch_for_orientation = :batch WHERE application_id = :application_id';
        $updateStmt = $this->pdo->prepare($updateQuery);
        $updateStmt->bindParam(':application_id', $studentId);
        $updateStmt->bindParam(':batch', $batchValue);

        if (!$updateStmt->execute()) {
            return false;
        }

        return true;
    }

    public function markAsUnassigned($studentId)
    {
        // Now update the specific student record
        $updateQuery =
            "UPDATE application_info SET batch_for_orientation = 'Unassigned' WHERE application_id = :application_id";
        $updateStmt = $this->pdo->prepare($updateQuery);
        $updateStmt->bindParam(':application_id', $studentId);

        if (!$updateStmt->execute()) {
            return false;
        }

        return true;
    }

    public function updateStatusToAttended($data)
    {
        $query =
            "UPDATE application_info SET is_attended_orientation = '1', is_not_attended_orientation = '0', is_for_awarding = '1' WHERE application_id = :account_id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $data['account_id'], \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function updateStatusToNotAttended($data)
    {
        $query =
            "UPDATE application_info SET is_attended_orientation = '0', is_not_attended_orientation = '1', is_for_awarding = '0' WHERE application_id = :account_id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $data['account_id'], \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function updateStatusToPending($data)
    {
        $query =
            "UPDATE application_info SET is_attended_orientation = '0', is_not_attended_orientation = '0', is_for_awarding = '0' WHERE application_id = :account_id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $data['account_id'], \PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>
