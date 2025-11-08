<?php

namespace App\Models;

use Config\Database;

class ScholarModel
{
    private $table_name = 'tzu_chi_siblings';

    public $id;
    public $scholarId;
    public $allowanceStatus;
    public $transportAllowance;
    public $loadAllowance;
    public $application_id;
    public $name;
    public $year_level;
    public $school;
    public $course;
    public $school_year;

    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getAllScholars()
    {
        $query =
            "SELECT s.*, u.status, u.email FROM scholars s JOIN users u ON s.account_id = u.account_id WHERE u.status = 'active'";

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getScholarById($id)
    {
        $query =
            "SELECT s.*, u.status, u.email FROM scholars s JOIN users u ON s.account_id = u.account_id WHERE s.account_id = :account_id AND u.status = 'active'";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $id);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function create($scholar, $application_id)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                  SET application_id = :application_id,
                      name = :name,
                      year_level = :year_level,
                      school = :school,
                      course = :course,
                      school_year = :school_year";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->name = htmlspecialchars(strip_tags($scholar['name']));
        $this->year_level = htmlspecialchars(strip_tags($scholar['year_level']));
        $this->school = htmlspecialchars(strip_tags($scholar['school']));
        $this->course = htmlspecialchars(strip_tags($scholar['course']));
        $this->school_year = htmlspecialchars(strip_tags($scholar['school_year']));

        // Bind values
        $stmt->bindParam(':application_id', $this->application_id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':year_level', $this->year_level);
        $stmt->bindParam(':school', $this->school);
        $stmt->bindParam(':course', $this->course);
        $stmt->bindParam(':school_year', $this->school_year);

        return $stmt->execute();
    }

    public function update($scholar, $id)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                  SET
                      name = :name,
                      year_level = :year_level,
                      school = :school,
                      course = :course,
                      school_year = :school_year
                      WHERE application_id = :id";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->name = htmlspecialchars(strip_tags($scholar['name']));
        $this->year_level = htmlspecialchars(strip_tags($scholar['year_level']));
        $this->school = htmlspecialchars(strip_tags($scholar['school']));
        $this->course = htmlspecialchars(strip_tags($scholar['course']));
        $this->school_year = htmlspecialchars(strip_tags($scholar['school_year']));

        // Bind values
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':year_level', $this->year_level);
        $stmt->bindParam(':school', $this->school);
        $stmt->bindParam(':course', $this->course);
        $stmt->bindParam(':school_year', $this->school_year);

        return $stmt->execute();
    }

    public function getTzuChiSiblings($id)
    {
        $query = 'SELECT * FROM ' . $this->table_name . ' WHERE application_id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function updateAllowanceStatus($data)
    {
        $query =
            'UPDATE scholars SET allowance_status = :allowance_status, transport_allowance = :transport_allowance, load_allowance = :load_allowance WHERE account_id = :account_id';
        $stmt = $this->pdo->prepare($query);

        $this->scholarId = htmlspecialchars(strip_tags($data['account_id']));
        $this->allowanceStatus = htmlspecialchars(strip_tags($data['allowance_status']));
        $this->transportAllowance = htmlspecialchars(strip_tags($data['transport_allowance']));
        $this->loadAllowance = htmlspecialchars(strip_tags($data['load_allowance']));

        $stmt->bindParam(':account_id', $this->scholarId, \PDO::PARAM_INT);
        $stmt->bindParam(':allowance_status', $this->allowanceStatus);
        $stmt->bindParam(':transport_allowance', $this->transportAllowance);
        $stmt->bindParam(':load_allowance', $this->loadAllowance);
        return $stmt->execute();
    }
}

?>
