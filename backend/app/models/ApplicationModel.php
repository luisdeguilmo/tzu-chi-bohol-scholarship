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

    public function create($data, $other)
    {
        // Generate a unique random application_id`
        $application_id = $this->generateUniqueApplicationId();

        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                  SET application_id = :application_id, school_year = :school_year, type = :status, status = 'pending', scholar_id = :scholar_id,expectation = :expectation, is_application_approved = 0, is_application_rejected = 0, created_at = NOW()";

        $stmt = $this->pdo->prepare($query);

        // Sanitize and bind
        $school_year = htmlspecialchars(strip_tags($data['school_year']));
        $status = htmlspecialchars(strip_tags($data['status']));
        $scholar_id = htmlspecialchars(strip_tags($data['scholar_id'] ?? 'null'));
        $expectation = htmlspecialchars(strip_tags($other['expectation']));

        $scholarId = $scholar_id === 'null' ? null : $scholar_id;

        $stmt->bindParam(':application_id', $application_id);
        $stmt->bindParam(':scholar_id', $scholarId);
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
                  SET expectation = :expectation, is_application_approved = 0, is_application_rejected = 0, created_at = NOW() WHERE scholar_id = :scholar_id AND school_year = :school_year";

        $stmt = $this->pdo->prepare($query);

        // Sanitize and bind
        $school_year = htmlspecialchars(strip_tags($data['school_year']));
        // $status = htmlspecialchars(strip_tags($data['status']));
        $scholar_id = htmlspecialchars(strip_tags($data['scholar_id'] ?? 'null'));
        $expectation = htmlspecialchars(strip_tags($other['expectation']));

        $scholarId = $scholar_id === 'null' ? null : $scholar_id;

        // $stmt->bindParam(':application_id', $application_id);
        $stmt->bindParam(':scholar_id', $scholarId);
        $stmt->bindParam(':school_year', $school_year);
        // $stmt->bindParam(':status', $status);
        $stmt->bindParam(':expectation', $expectation);

        if ($stmt->execute()) {
            $selectQuery =
                'SELECT application_id
                    FROM ' .
                $this->table_name .
                ' WHERE scholar_id = :scholar_id AND school_year = :school_year';
            $selectStmt = $this->pdo->prepare($selectQuery);
            $selectStmt->bindParam(':scholar_id', $scholarId);
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
        $query = 'SELECT scholar_id FROM personal_information WHERE email = :email';
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

    public function getNewScholarsFromPreviousSchoolYear()
    {
        $query = "SELECT application_id FROM application_info WHERE type = 'New' AND status = 'scholar' AND school_year = '$this->previousSchoolYear' ORDER BY created_at DESC LIMIT 1";
        $stmt = $this->pdo->prepare($query);
        // $stmt->bindParam(':school_year', $previousSchoolYear);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getOldScholarsFromPreviousSchoolYear()
    {
        $query = "SELECT scholar_id FROM application_info WHERE type = 'Old' AND status = 'scholar' AND school_year = '$this->previousSchoolYear' ORDER BY created_at DESC LIMIT 1";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function setApplicationStatusAsNotRenewed()
    {
        $query = "UPDATE application_info SET status = 'not_renewed' WHERE status = 'scholar' AND school_year = '$this->previousSchoolYear'";
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute();
    }
}

?>
