<?php

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class ApplicationModel
{
    private $table_name = 'application_info';

    public $id;
    public $sy;
    public $created_at;
    public $previousYear;
    public $currentYear;
    public $previousSchoolYear;

    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->previousYear = date('Y') - 1;
        $this->currentYear = date('Y');
        $this->previousSchoolYear = $this->previousYear . '-' . $this->currentYear;
    }

    public function create($data, $other, $application_id)
    {
        // Generate a unique random application_id`
        // $application_id = $this->generateUniqueApplicationId();

        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                  SET application_id = :application_id, school_year = :school_year, type = :status, status = 'pending', expectation = :expectation, is_application_approved = '0', is_application_rejected = '0', created_at = NOW()";

        $stmt = $this->pdo->prepare($query);

        // Sanitize and bind
        $school_year = strip_tags($data['school_year']);
        $status = strip_tags($data['status']);
        $expectation = strip_tags($other['expectation']);

        $stmt->bindParam(':application_id', $application_id);
        $stmt->bindParam(':school_year', $school_year);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':expectation', $expectation);

        // if ($stmt->execute()) {
        //     return $application_id;
        // }

        return $stmt->execute();
    }

    public function createExistingScholar($data, $other, $application_id)
    {
        // Generate a unique random application_id`
        // $application_id = $this->generateUniqueApplicationId();

        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                  SET application_id = :application_id, school_year = :school_year, type = :status, is_added_from_admin = '1', expectation = :expectation, is_application_approved = '1', is_examination_passed = '1', is_initial_interview_passed = '1', is_home_visitation_qualified = '1', is_final_interview_passed = '1', is_attended_orientation = '1', is_attended_awarding = '1', status = 'is_attended_awarding', created_at = NOW()";

        $stmt = $this->pdo->prepare($query);

        // Sanitize and bind
        $school_year = strip_tags($data['application_info']['school_year']);
        // $status = strip_tags(
        //     $data['educational_background']['year_level'] < 2
        //         ? $data['application_info']['status']
        //         : 'Old',
        // );
        $status = strip_tags($data['application_info']['status']);
        $expectation = strip_tags($other['expectation']);

        $stmt->bindParam(':application_id', $application_id);
        $stmt->bindParam(':school_year', $school_year);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':expectation', $expectation);

        if ($stmt->execute()) {
            return $application_id;
        }

        return false;
    }

    public function renew($data, $other)
    {
        // Generate a unique random application_id`
        $application_id = $this->generateUniqueApplicationId();

        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                  SET application_id = :application_id, school_year = :school_year, type = :status, status = 'pending', scholar_id = :scholar_id, expectation = :expectation, is_application_approved = '0', is_application_rejected = '0', created_at = NOW()";

        $stmt = $this->pdo->prepare($query);

        // Sanitize and bind
        $school_year = strip_tags($data['school_year']);
        $status = strip_tags($data['status']);
        $scholar_id = strip_tags($data['scholar_id']);
        $expectation = strip_tags($other['expectation']);

        $stmt->bindParam(':application_id', $application_id);
        $stmt->bindParam(':scholar_id', $scholar_id, \PDO::PARAM_INT);
        $stmt->bindParam(':school_year', $school_year);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':expectation', $expectation);

        if ($stmt->execute()) {
            return $application_id;
        }

        return false;
    }

    public function update($data, $other)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                  SET expectation = :expectation, is_application_approved = 0, status = 'pending', is_application_rejected = 0, created_at = NOW() WHERE scholar_id = :scholar_id AND school_year = :school_year";

        $stmt = $this->pdo->prepare($query);

        // Sanitize and bind
        $school_year = strip_tags($data['school_year']);
        $scholar_id = strip_tags($data['scholar_id']);
        $expectation = strip_tags($other['expectation']);

        // $stmt->bindParam(':application_id', $application_id);
        $stmt->bindParam(':scholar_id', $scholar_id, \PDO::PARAM_INT);
        $stmt->bindParam(':school_year', $school_year);
        $stmt->bindParam(':expectation', $expectation);

        if ($stmt->execute()) {
            $selectQuery =
                'SELECT application_id
                    FROM ' .
                $this->table_name .
                ' WHERE scholar_id = :scholar_id AND school_year = :school_year';
            $selectStmt = $this->pdo->prepare($selectQuery);
            $selectStmt->bindParam(':scholar_id', $scholar_id, \PDO::PARAM_INT);
            $selectStmt->bindParam(':school_year', $school_year);
            $selectStmt->execute();
            $row = $selectStmt->fetch(\PDO::FETCH_ASSOC); // return full row as associative array

            if ($row) {
                return $row['application_id'];
            }

            return null;
        }

        return false;
    }

    private function generateUniqueApplicationId($length = 7)
    {
        do {
            // Generate a random number (7-digit)
            $randomId = mt_rand(pow(10, $length - 1), pow(10, $length) - 1);

            // Check if it already exists
            $stmt = $this->pdo->prepare(
                'SELECT COUNT(*) FROM ' . $this->table_name . ' WHERE application_id = :id',
            );
            $stmt->bindParam(':id', $randomId);
            $stmt->execute();

            $count = $stmt->fetchColumn();
        } while ($count > 0); // Retry if duplicate found

        return $randomId;
    }

    public function checkEmailAddressForRenewal($email)
    {
        $query = 'SELECT account_id AS scholar_id FROM users WHERE email = :email';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function checkEmailAddressForNew($email)
    {
        $query = 'SELECT application_id FROM personal_information WHERE email = :email';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    // public function getNewScholarsFromPreviousSchoolYear($previousSchoolYear)
    // {
    //     $query = "
    //         SELECT ai.application_id, u.status
    //         FROM application_info ai
    //         JOIN users u ON ai.application_id = u.account_id
    //         WHERE ai.type = 'New'
    //         AND ai.status = 'scholar'
    //         AND ai.school_year != :school_year
    //         AND u.status = 'active'
    //         ORDER BY ai.created_at DESC
    // ";

    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->execute([
    //         ':school_year' => $previousSchoolYear,
    //     ]);

    //     return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    // }

    public function getNewScholarsFromPreviousSchoolYear($previousSchoolYear)
    {
        $query = "
        SELECT ai.application_id, u.status
        FROM application_info ai
        INNER JOIN users u
            ON ai.application_id = u.account_id
        WHERE ai.type = 'New'
            AND ai.status = 'scholar'
            AND ai.school_year != :school_year
            AND u.status = 'active'
            AND NOT EXISTS (
                SELECT 1
                FROM application_info ai2
                WHERE ai2.scholar_id = u.account_id
                  AND ai2.id > ai.id
            )
        ORDER BY ai.created_at DESC
    ";

        $stmt = $this->pdo->prepare($query);
        $stmt->execute([
            ':school_year' => $previousSchoolYear,
        ]);

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getOldScholarsFromPreviousSchoolYear($previousSchoolYear)
    {
        $query = "
            SELECT ai.scholar_id, u.status 
            FROM application_info ai
            JOIN users u ON ai.scholar_id = u.account_id
            WHERE ai.type = 'Old'
            AND ai.status = 'scholar'
            AND ai.school_year != :school_year
            AND u.status = 'active'
            ORDER BY ai.created_at DESC
        ";

        $stmt = $this->pdo->prepare($query);
        $stmt->execute([
            ':school_year' => $previousSchoolYear,
        ]);

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function setApplicationStatusAsNotRenewed()
    {
        $query = "UPDATE application_info SET status = 'not_renewed' WHERE status = 'scholar' AND school_year = '$this->previousSchoolYear'";
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute();
    }

    public function setIsMigrationCompleted($id)
    {
        $query =
            "UPDATE application_info SET is_migration_complete = '1' WHERE application_id = :id AND is_added_from_admin = '1'";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}

?>
