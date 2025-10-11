<?php
namespace App\Models;
use Config\Database;

date_default_timezone_set('Asia/Manila');

class CollegeUniversityManagementModel
{
    private $pdo;
    public $table_name = 'colleges_universities';

    public function __construct()
    {
        // Set timezone and initialize date/time properties in constructor
        date_default_timezone_set('Asia/Manila');

        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($data)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                  SET name = :name";

        $stmt = $this->pdo->prepare($query);
        $name = strip_tags($data);
        $stmt->bindParam(':name', $name);
        return $stmt->execute();
    }

    public function getAllCollegesAndUniversities()
    {
        $query = 'SELECT * FROM ' . $this->table_name;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getCollegeOrUniversityById($id)
    {
        $query = 'SELECT * FROM ' . $this->table_name . ' WHERE id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function update($id, $data)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                  SET name = :name 
                  WHERE id = :id";

        $stmt = $this->pdo->prepare($query);

        $name = strip_tags($data['name']);

        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    public function delete($id)
    {
        $query = 'DELETE FROM ' . $this->table_name . ' WHERE id = :id';
        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }
}
?>
