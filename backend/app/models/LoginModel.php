<?php
namespace App\Models;

use Config\Database;

class LoginModel {
    private $table_name = "application_info";

    private $scholar_table = "scholars";
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
            // Prepare the query to get the user by email
            $query = "SELECT * FROM " . $this->scholar_table . " WHERE email = :email";
            $stmt = $this->pdo->prepare($query);
            
            // Bind the email parameter
            $stmt->bindParam(":email", $email);
            $stmt->execute();
            
            // Fetch the user
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            // Verify password if user exists
            if ($user && password_verify($password, $user['password'])) {
                // Password is correct
                return [$user];
            }
            
            // Either user doesn't exist or password is wrong
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