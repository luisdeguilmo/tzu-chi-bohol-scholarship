<?php 

namespace App\Models;

use Config\Database;

class RequirementModel {
    private $table_name = "uploaded_files";

    public $id;
    public $application_id;
    public $file_name;
    public $file_path;
    public $file_type;
    public $file_size;
    public $requirement_type;
    public $uploaded_at;

    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($file_data, $application_id) {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET application_id = :application_id,
                      file_name = :file_name,
                      file_path = :file_path,
                      file_type = :file_type,
                      file_size = :file_size,
                      requirement_type = :requirement_type,
                      uploaded_at = :uploaded_at";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->file_name = htmlspecialchars(strip_tags($file_data['file_name']));
        $this->file_path = htmlspecialchars(strip_tags($file_data['file_path']));
        $this->file_type = htmlspecialchars(strip_tags($file_data['file_type']));
        $this->file_size = htmlspecialchars(strip_tags($file_data['file_size']));
        $this->requirement_type = htmlspecialchars(strip_tags($file_data['requirement_type']));
        $this->uploaded_at = date('Y-m-d H:i:s');

        // Bind values
        $stmt->bindParam(":application_id", $this->application_id);
        $stmt->bindParam(":file_name", $this->file_name);
        $stmt->bindParam(":file_path", $this->file_path);
        $stmt->bindParam(":file_type", $this->file_type);
        $stmt->bindParam(":file_size", $this->file_size);
        $stmt->bindParam(":requirement_type", $this->requirement_type);
        $stmt->bindParam(":uploaded_at", $this->uploaded_at);

        return $stmt->execute();
    }

    public function getRequirementsByApplication($application_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE application_id = ? 
                  ORDER BY uploaded_at DESC";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(1, $application_id);
        $stmt->execute();

        return $stmt;
    }

    public function getFileUrl($id) {
        $query = "SELECT file_path FROM " . $this->table_name . " WHERE id = ?";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if ($row) {
            // Return the complete URL to access the file
            return $row['file_path'];
        }
        
        return null;
    }

    public function delete($id) {
        // First, get the file path to delete the actual file
        $query = "SELECT file_path FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if ($row) {
            // Get absolute path by appending document root
            $file_path = $_SERVER['DOCUMENT_ROOT'] . $row['file_path'];
            
            // Delete the physical file if it exists
            if (file_exists($file_path)) {
                unlink($file_path);
            }
            
            // Now delete the database record
            $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(1, $id);
            
            if($stmt->execute()) {
                return true;
            }
        }
        
        return false;
    }
}
?>