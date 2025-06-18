<?php

namespace App\Models;

use Config\Database;

class ProfilePictureModel {
    private $table_name = "profile_pictures";
    
    public $id;
    public $application_id;
    public $file_name;
    public $file_path;
    public $file_type;
    public $file_size;
    public $uploaded_at;
    
    private $pdo;
    
    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }
    
    public function create($file_data, $application_id) {
        try {
            // Check if profile picture already exists for this application
            $checkQuery = "SELECT id FROM " . $this->table_name . " WHERE application_id = ?";
            $checkStmt = $this->pdo->prepare($checkQuery);
            $checkStmt->execute([$application_id]);
            
            if ($checkStmt->fetch()) {
                // Update existing profile picture
                $query = "UPDATE " . $this->table_name . " 
                         SET file_name = :file_name,
                             file_path = :file_path,
                             file_type = :file_type,
                             file_size = :file_size,
                             uploaded_at = :uploaded_at
                         WHERE application_id = :application_id";
            } else {
                // Insert new profile picture
                $query = "INSERT INTO " . $this->table_name . "
                         SET application_id = :application_id,
                             file_name = :file_name,
                             file_path = :file_path,
                             file_type = :file_type,
                             file_size = :file_size,
                             uploaded_at = :uploaded_at";
            }
            
            $stmt = $this->pdo->prepare($query);
            
            // Sanitize inputs
            $this->application_id = $application_id;
            $this->file_name = htmlspecialchars(strip_tags($file_data['file_name']));
            $this->file_path = htmlspecialchars(strip_tags($file_data['file_path']));
            $this->file_type = htmlspecialchars(strip_tags($file_data['file_type']));
            $this->file_size = intval($file_data['file_size']);
            $this->uploaded_at = date('Y-m-d H:i:s');
            
            // Bind values
            $stmt->bindParam(":application_id", $this->application_id);
            $stmt->bindParam(":file_name", $this->file_name);
            $stmt->bindParam(":file_path", $this->file_path);
            $stmt->bindParam(":file_type", $this->file_type);
            $stmt->bindParam(":file_size", $this->file_size);
            $stmt->bindParam(":uploaded_at", $this->uploaded_at);
            
            return $stmt->execute();
            
        } catch (\Exception $e) {
            error_log("Error creating/updating profile picture: " . $e->getMessage());
            return false;
        }
    }


    // Updated methods for ProfilePictureModel.php

public function getFileUrlByApplicationId($application_id) {
    try {
        $query = "SELECT file_name, file_path FROM " . $this->table_name . " 
                 WHERE application_id = ? 
                 ORDER BY uploaded_at DESC 
                 LIMIT 1";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([$application_id]);
        
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if ($row) {
            // Extract filename from path
            $filename = basename($row['file_path']);
            
            // Return the URL using the serving endpoint
            $base_url = $this->getBaseUrl();
            return $base_url . "/public/upload/applications/" . $application_id . "/profile/" . urlencode($filename);
        }
        
        return null;
    } catch (\Exception $e) {
        error_log("Error getting file URL by application ID: " . $e->getMessage());
        return null;
    }
}

public function getFileUrl($id) {
    try {
        $query = "SELECT file_path, application_id FROM " . $this->table_name . " WHERE id = ?";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([$id]);
        
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if ($row) {
            // Extract filename from path
            $filename = basename($row['file_path']);
            $application_id = $row['application_id'];
            // http://localhost:8000/public/upload/applications/7294153/profile/WIN_20240514_08_32_24_Pro.jpg
            // Return the URL using the serving endpoint
            $base_url = $this->getBaseUrl();
            return $base_url . "/public/upload/applications/" . $application_id . "/profile/" . urlencode($filename);
        }
        
        return null;
    } catch (\Exception $e) {
        error_log("Error getting file URL: " . $e->getMessage());
        return null;
    }
}




    
    public function getByApplicationId($application_id) {
        try {
            $query = "SELECT * FROM " . $this->table_name . "
                     WHERE application_id = ?
                     ORDER BY uploaded_at DESC
                     LIMIT 1";
            
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([$application_id]);
            
            return $stmt->fetch(\PDO::FETCH_ASSOC);
        } catch (\Exception $e) {
            error_log("Error fetching profile picture: " . $e->getMessage());
            return false;
        }
    }
    
    private function getBaseUrl() {
        // Get the protocol (http or https)
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
        
        // Get the host
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8000';
        
        // Return the base URL
        return $protocol . '://' . $host;
    }
    
    public function delete($id) {
        try {
            // First, get the file path to delete the actual file
            $query = "SELECT file_path FROM " . $this->table_name . " WHERE id = ?";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([$id]);
            
            $row = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            if ($row) {
                // Get absolute path
                $file_path = $_SERVER['DOCUMENT_ROOT'] . $row['file_path'];
                
                // Delete the physical file if it exists
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
                
                // Now delete the database record
                $deleteQuery = "DELETE FROM " . $this->table_name . " WHERE id = ?";
                $deleteStmt = $this->pdo->prepare($deleteQuery);
                
                return $deleteStmt->execute([$id]);
            }
            
            return false;
        } catch (\Exception $e) {
            error_log("Error deleting profile picture: " . $e->getMessage());
            return false;
        }
    }
    
    public function deleteByApplicationId($application_id) {
        try {
            // First, get all file paths to delete the actual files
            $query = "SELECT file_path FROM " . $this->table_name . " WHERE application_id = ?";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([$application_id]);
            
            $files = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            
            // Delete physical files
            foreach ($files as $file) {
                $file_path = $_SERVER['DOCUMENT_ROOT'] . $file['file_path'];
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
            }
            
            // Now delete the database records
            $deleteQuery = "DELETE FROM " . $this->table_name . " WHERE application_id = ?";
            $deleteStmt = $this->pdo->prepare($deleteQuery);
            
            return $deleteStmt->execute([$application_id]);
        } catch (\Exception $e) {
            error_log("Error deleting profile pictures by application ID: " . $e->getMessage());
            return false;
        }
    }
}
?>