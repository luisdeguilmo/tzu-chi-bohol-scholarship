<?php
namespace App\Models;
use Config\Database;

date_default_timezone_set('Asia/Manila');

class CoursesAcceptedModel
{
    private $pdo;
    public $table_name = 'courses_accepted';

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
                  SET school_id = :id, course = :name";

        $stmt = $this->pdo->prepare($query);
        $id = strip_tags($data['id']);
        $name = strip_tags($data['course_name']);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->bindParam(':name', $name);
        return $stmt->execute();
    }

    public function getCourseById($id)
    {
        $query = 'SELECT id, school_id, course FROM ' . $this->table_name . ' WHERE id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getCoursesByCollegeOrUniversityId($id)
    {
        $query = 'SELECT id, school_id, course FROM ' . $this->table_name . ' WHERE school_id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function update($data)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                  SET course = :name 
                  WHERE id = :id";

        $stmt = $this->pdo->prepare($query);

        $name = strip_tags($data['course_name']);
        $id = strip_tags($data['id']);

        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);

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
