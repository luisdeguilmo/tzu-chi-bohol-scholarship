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
                  SET name = :name,
                    type = :type";

        $stmt = $this->pdo->prepare($query);
        $name = strip_tags($data['college_university']);
        $type = strip_tags($data['type']);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':type', $type);

        return $stmt->execute();
    }

    public function getAllCollegesAndUniversities($filter)
    {
        $query = 'SELECT * FROM ' . $this->table_name;

        if ($filter === 'visible') {
            $query .= " WHERE is_visible = '1'";
        } elseif ($filter === 'hidden') {
            $query .= " WHERE is_visible = '0'";
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllCollegesAndUniversitiesAlphabetically()
    {
        $query = 'SELECT * FROM ' . $this->table_name . ' ORDER BY name ASC';
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

    public function updateCollegeVisibility($id, $data)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                  SET is_visible = :is_visible 
                  WHERE id = :id";

        $stmt = $this->pdo->prepare($query);

        $is_visible = strip_tags($data['is_visible']);

        $stmt->bindParam(':is_visible', $is_visible);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    public function update($data)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                  SET name = :name,
                  type = :type
                  WHERE id = :id";

        $stmt = $this->pdo->prepare($query);

        $id = strip_tags($data['id']);
        $name = strip_tags($data['name']);
        $type = strip_tags($data['type']);

        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':type', $type);
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
