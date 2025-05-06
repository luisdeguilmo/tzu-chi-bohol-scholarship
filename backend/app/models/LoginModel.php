<?php
namespace App\Models;

use Config\Database;

class LoginModel {
    private $table_name = "application_info";

    private $scholar_table = "application_info";
    private $staff_table = "staff";
    private $admin_table = "admin";
    
    public $id;
    private $pdo;
    
    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }
    
    public function getCredential($email, $password) {
        try {
            // It's recommended to use password hashing instead of storing plain passwords
            $query = "SELECT * FROM " . $this->table_name . " WHERE email = :email";
            $stmt = $this->pdo->prepare($query);
            
            $stmt->bindParam(":email", $email);
            $stmt->execute();
            
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            if ($user && $password === $user['password']) {
                // In a real application, use password_verify() instead
                return [$user];
            }
            
            return [];
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }

    public function getScholarCredential($email, $password) {
        try {
            // It's recommended to use password hashing instead of storing plain passwords
            $query = "SELECT * FROM " . $this->scholar_table . " WHERE email = :email";
            $stmt = $this->pdo->prepare($query);
            
            $stmt->bindParam(":email", $email);
            $stmt->execute();
            
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            if ($user && $password === $user['password']) {
                // In a real application, use password_verify() instead
                return [$user];
            }
            
            return [];
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }

    public function getStaffCredential($email, $password) {
        try {
            // It's recommended to use password hashing instead of storing plain passwords
            $query = "SELECT * FROM " . $this->staff_table . " WHERE email = :email";
            $stmt = $this->pdo->prepare($query);
            
            $stmt->bindParam(":email", $email);
            $stmt->execute();
            
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            if ($user && $password === $user['password']) {
                // In a real application, use password_verify() instead
                return [$user];
            }
            
            return [];
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }

    public function getAdminCredential($email, $password) {
        try {
            // It's recommended to use password hashing instead of storing plain passwords
            $query = "SELECT * FROM " . $this->admin_table . " WHERE email = :email";
            $stmt = $this->pdo->prepare($query);
            
            $stmt->bindParam(":email", $email);
            $stmt->execute();
            
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            if ($user && $password === $user['password']) {
                // In a real application, use password_verify() instead
                return [$user];
            }
            
            return [];
        } catch (\PDOException $e) {
            throw new \Exception("Database error: " . $e->getMessage());
        }
    }
}
?>