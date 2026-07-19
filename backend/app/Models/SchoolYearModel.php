<?php

namespace App\Models;

use Config\Database;

class SchoolYearModel
{
    private $table_name = 'school_years';

    public $id;
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getSchoolYearById($id)
    {
        $query = 'SELECT id FROM ' . $this->table_name . ' WHERE id = :id';
        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getActiveSchoolYear()
    {
        $query = "SELECT school_year
              FROM {$this->table_name}
              WHERE status = 'active'
              LIMIT 1";

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();

        $schoolYear = $stmt->fetchColumn();

        return $schoolYear !== false ? $schoolYear : null;
    }

    public function getAllSchoolYears()
    {
        $query = 'SELECT school_year FROM ' . $this->table_name;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getSchoolYear($school_year)
    {
        $query = 'SELECT id FROM ' . $this->table_name . ' WHERE school_year = :school_year';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $school_year, \PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        if ($row) {
            return true;
        }
        return false;
    }

    public function isRenewalApplicationOpen($schoolYear): bool
    {
        $query = "SELECT is_renewal_application_open
              FROM {$this->table_name}
              WHERE school_year = :school_year
              LIMIT 1";

        $stmt = $this->pdo->prepare($query);
        $stmt->execute([
            ':school_year' => $schoolYear,
        ]);

        return (bool) $stmt->fetchColumn();
    }

    public function setRenewalApplicationOpen($schoolYear): bool
    {
        $query = "UPDATE {$this->table_name}
              SET is_renewal_application_open = 1
              WHERE school_year = :school_year";

        $stmt = $this->pdo->prepare($query);

        return $stmt->execute([
            ':school_year' => $schoolYear,
        ]);
    }

    public function createSchoolYear($school_year)
    {
        $query = 'INSERT INTO ' . $this->table_name . ' SET school_year = :school_year';

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':school_year', $school_year);

        return $stmt->execute();
    }

    public function updateStatus($id, $status)
    {
        $query = 'UPDATE ' . $this->table_name . ' SET status = :status WHERE id = :id';

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    public function getCurrentSchoolYear()
    {
        $query = "SELECT school_year
              FROM {$this->table_name}
              WHERE status = 'active'
              LIMIT 1";

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();

        $schoolYear = $stmt->fetchColumn();

        return $schoolYear !== false ? $schoolYear : null;
    }
}
?>
