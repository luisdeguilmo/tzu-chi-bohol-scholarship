<?php
namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class HomeVisitationFilesModel
{
    private $table_name = 'application_files';

    public $currentDateTime;
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

    public function getFileUrlByApplicationId($application_id)
    {
        try {
            $query =
                'SELECT file_name, file_path FROM ' .
                $this->table_name .
                " 
                  WHERE type = 'home_visitation' AND application_id = ? 
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
