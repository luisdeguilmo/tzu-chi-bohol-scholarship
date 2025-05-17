<?php 
namespace App\Models;

use Config\Database;

class StaffAccountModel {
    private $table_name = "staff";

    private $pdo;

    public $id;
    public $name;
    public $email;
    public $password;
    public $submit;
    public $procedure;
    public $course_name;
    public $strand;
    public $instruction;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function createStaff($data) {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET name = :name,
                  email = :email,
                  password = :password";
        
        $stmt = $this->pdo->prepare($query);
        
        $name = htmlspecialchars(strip_tags($data['name']));
        $email = htmlspecialchars(strip_tags($data['email']));
        $password = htmlspecialchars(strip_tags($data['password']));
        
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $password);
        
        return $stmt->execute();
    }
    
    public function getAllStaffs() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
    
    public function getStaffById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
 
    public function updateStaff($id, $data) {
        $query = "UPDATE " . $this->table_name . " 
                  SET name = :name,
                  email = :email
                  WHERE id = :id";
        
        $stmt = $this->pdo->prepare($query);
        
        $name = htmlspecialchars(strip_tags($data['name']));
        $email = htmlspecialchars(strip_tags($data['email']));
        // $password = htmlspecialchars(strip_tags($data['password']));
        
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        // $stmt->bindParam(":password", $password);
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }
    
    public function deleteStaff($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }
}
?>