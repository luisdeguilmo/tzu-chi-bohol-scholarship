<?php

namespace App\Models;

use Config\Database;

class YearModel
{
    private $table_name = 'years';

    public $id;
    public $score;
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getAllYears()
    {
        $query = 'SELECT * FROM ' . $this->table_name;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getYear($year)
    {
        $query = 'SELECT * FROM ' . $this->table_name . ' WHERE year = :year';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':year', $year, \PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        if ($row) {
            return true;
        }
        return false;
    }

    public function createYear($year)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " SET year = :year";

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':year', $year);

        return $stmt->execute();
    }
}
?>
