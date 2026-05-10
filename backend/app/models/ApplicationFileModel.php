<?php
namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class ApplicationFileModel
{
    private $table_name = 'application_files';

    public $id;
    public $application_id;
    public $file_name;
    public $file_path;
    public $file_type;
    public $file_size;
    public $type;
    public $currentDateTime;
    public $uploaded_at;

    private $pdo;

    public function __construct($pdo = null)
    {
        if ($pdo) {
            $this->pdo = $pdo;
        } else {
            $db = new Database();
            $this->pdo = $db->getConnection();
            $this->currentDateTime = date('Y-m-d H:i:s');
        }
    }

    public function createFile($file_data, $application_id, $type)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " SET application_id = :application_id,
                       file_name = :file_name,
                       file_path = :file_path, 
                       file_type = :file_type,
                       file_size = :file_size,
                       type = :type,
                       uploaded_at = :uploaded_at";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->file_name = htmlspecialchars(strip_tags($file_data['file_name']));
        $this->file_path = htmlspecialchars(strip_tags($file_data['file_path']));
        $this->file_type = htmlspecialchars(strip_tags($file_data['file_type']));
        $this->file_size = htmlspecialchars(strip_tags($file_data['file_size']));
        $this->type = htmlspecialchars(strip_tags($file_data['type']));
        $this->uploaded_at = date('Y-m-d H:i:s');

        // Bind values
        $stmt->bindParam(':application_id', $this->application_id);
        $stmt->bindParam(':file_name', $this->file_name);
        $stmt->bindParam(':file_path', $this->file_path);
        $stmt->bindParam(':file_type', $this->file_type);
        $stmt->bindParam(':file_size', $this->file_size);
        $stmt->bindParam(':type', $this->type);
        $stmt->bindParam(':uploaded_at', $this->uploaded_at);

        return $stmt->execute();
    }

    public function fetchFilesByIdAndType($applicationId, $type)
    {
        $query =
            "SELECT *
                FROM " .
            $this->table_name .
            "
                WHERE application_id = :application_id AND type = :type";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $applicationId);
        $stmt->bindParam(':type', $type);

        if ($stmt->execute()) {
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        }

        return null;
    }

    public function fetchFilesById($applicationId)
    {
        $query =
            "SELECT *
                FROM " .
            $this->table_name .
            "
                WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $applicationId);

        if ($stmt->execute()) {
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        }

        return null;
    }

    public function getFilesByIdAndType($applicationId, $type)
    {
        $data = [];

        $files = $this->fetchFilesByIdAndType($applicationId, $type);

        $filesList = [];

        foreach ($files as $file) {
            $filesList[] = [
                'id' => $file['id'],
                'application_id' => $file['application_id'],
                'file_name' => $file['file_name'],
                'file_path' => $file['file_path'],
                // 'file_url' =>
                //     'http://localhost:8000/index.php?route=file/view&file=' .
                //     urlencode(str_replace('/upload/applications/', '', $file['file_path'])),
                'file_url' =>
                    $_ENV['APP_URL'] .
                    '/index.php?type=applications&route=file/view&file=' .
                    urlencode(basename($file['file_path'])),
                'file_size' => $file['file_size'],
                'file_type' => $file['file_type'],
                'uploaded_at' => $file['uploaded_at'],
            ];
        }

        $data[] = [
            'files' => $filesList,
        ];

        return $data;
    }

    public function getFilesById($applicationId)
    {
        $data = [];

        $files = $this->fetchFilesById($applicationId);

        $filesList = [];

        foreach ($files as $file) {
            $filesList[] = [
                'id' => $file['id'],
                'application_id' => $file['application_id'],
                'file_name' => $file['file_name'],
                'file_path' => $file['file_path'],
                'file_url' =>
                    $_ENV['APP_URL'] .
                    '/index.php?type=applications&route=file/view&file=' .
                    urlencode(basename($file['file_path'])),
                'file_size' => $file['file_size'],
                'file_type' => $file['file_type'],
                'uploaded_at' => $file['uploaded_at'],
            ];
        }

        $data[] = [
            'files' => $filesList,
        ];

        return $data;
    }

    public function deleteFiles($id)
    {
        $query = 'DELETE FROM ' . $this->table_name . ' WHERE id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function getFileUrlByApplicationId($application_id)
    {
        try {
            $query =
                'SELECT file_name, file_path FROM ' .
                $this->table_name .
                " 
                  WHERE application_id = ? 
                  ORDER BY uploaded_at DESC 
                  LIMIT 5";

            $stmt = $this->pdo->prepare($query);
            $stmt->execute([$application_id]);
            $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            if ($rows) {
                $file_urls = []; // Initialize array to store URLs
                $base_url = $this->getBaseUrl();

                foreach ($rows as $row) {
                    // Extract filename from path
                    $filename = basename($row['file_path']);

                    // Build the URL using the serving endpoint
                    $file_url =
                        $base_url .
                        '/public/upload/applications/' .
                        $application_id .
                        '/files/' .
                        urlencode($filename);
                    $file_urls[] = $file_url; // Add to array
                }

                return $file_urls; // Return array of URLs
            }

            return null;
        } catch (\Exception $e) {
            error_log('Error getting file URL by application ID: ' . $e->getMessage());
            return null;
        }
    }

    public function getFileUrl($id)
    {
        try {
            $query = 'SELECT file_path, application_id FROM ' . $this->table_name . ' WHERE id = ?';
            $stmt = $this->pdo->prepare($query);
            $stmt->execute([$id]);
            $row = $stmt->fetch(\PDO::FETCH_ASSOC);

            if ($row) {
                // Extract filename from path
                $filename = basename($row['file_path']);
                $application_id = $row['application_id'];

                // Return the URL using the serving endpoint
                $base_url = $this->getBaseUrl();
                return $base_url .
                    '/public/upload/applications/' .
                    $application_id .
                    '/files/' .
                    urlencode($filename);
            }

            return null;
        } catch (\Exception $e) {
            error_log('Error getting file URL: ' . $e->getMessage());
            return null;
        }
    }

    private function getBaseUrl()
    {
        // Get the protocol (http or https)
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';

        // Get the host
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8000';

        // Return the base URL
        return $protocol . '://' . $host;
    }
}
?>
