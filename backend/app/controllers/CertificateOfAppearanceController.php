<?php

namespace App\Controllers;
require_once __DIR__ . "/../../config/Database.php";
require_once __DIR__ . "/../Models/CertificateOfAppearanceModel.php";

use \Config\Database;
use App\Models\CertificateOfAppearanceModel;

class CertificateOfAppearanceController {

    private $pdo;
    private $certificateModel;
    private $allowedFileTypes = [
        'application/pdf', 
        'image/jpeg', 
        'image/jpg', 
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    private $maxFileSize = 10485760; // 10MB in bytes
    private $uploadDirectory;
    private $baseUploadDirectory;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->certificateModel = new CertificateOfAppearanceModel();
        
        // Setup upload directories
        $this->baseUploadDirectory = $_SERVER['DOCUMENT_ROOT'] . "/upload/";
        $this->uploadDirectory = $this->baseUploadDirectory . "coa/";
        
        // Create directories if they don't exist
        $this->ensureDirectoriesExist();
    }
    
    /**
     * Ensure upload directories exist
     */
    private function ensureDirectoriesExist() {
        if (!is_dir($this->baseUploadDirectory)) {
            mkdir($this->baseUploadDirectory, 0755, true);
        }
        
        if (!is_dir($this->uploadDirectory)) {
            mkdir($this->uploadDirectory, 0755, true);
        }
    }

    /**
     * Create a new certificate of appearance application
     */
    public function createApplication() {
        // Start transaction
        $this->pdo->beginTransaction();

        try {
            // Parse input data
            $data = $this->parseInputData();
            
            if (!$data) {
                throw new \Exception("No valid data provided");
            }
            
            // Validate required fields
            $this->validateRequiredFields($data);
            
            // Generate application ID
            $application_id = $this->generateApplicationId();
            
            // Extract event details
            $event_name = $data['event_name'];
            $event_date = $data['event_date'];
            
            // Process file uploads based on input type
            if (isset($_FILES['files'])) {
                $this->handleFileUploads($_FILES['files'], $application_id, $event_name, $event_date);
            }

            if (isset($data['certificate_of_appearance']) && is_array($data['certificate_of_appearance'])) {
                $this->handleUploadedFilesFromJson($data['certificate_of_appearance'], $application_id, $event_name, $event_date);
            }

            // Commit transaction
            $this->pdo->commit();
            
            // Return success response
            $this->sendJsonResponse(201, [
                "success" => true,
                "message" => "Application created successfully",
                "application_id" => $application_id
            ]);

        } catch (\Exception $e) {
            // Roll back transaction on error
            $this->pdo->rollBack();
            
            $this->sendJsonResponse(400, [
                "success" => false,
                "message" => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Parse input data from request
     * 
     * @return array|null Parsed input data or null if no data
     */
    private function parseInputData() {
        // Handle data from both FormData and direct JSON
        if (isset($_POST['certificate_of_appearance'])) {
            // Handle data from FormData
            return json_decode($_POST['certificate_of_appearance'], true);
        } else {
            // Handle direct JSON input 
            return json_decode(file_get_contents("php://input"), true);
        }
    }
    
    /**
     * Validate required fields in data
     * 
     * @param array $data Input data to validate
     * @throws \Exception If validation fails
     */
    private function validateRequiredFields($data) {
        // Check for required fields
        if (empty($data['event_name'])) {
            throw new \Exception("Event name is required");
        }
        
        if (empty($data['event_date'])) {
            throw new \Exception("Event date is required");
        }
        
        // Validate date format (YYYY-MM-DD)
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['event_date'])) {
            throw new \Exception("Invalid date format. Please use YYYY-MM-DD");
        }
    }
    
    /**
     * Generate unique application ID
     * 
     * @return string Generated application ID
     */
    private function generateApplicationId() {
        return date('Ymd') . rand(1000, 9999);
    }

    /**
     * Handle file uploads from FormData
     * 
     * @param array $files Files from $_FILES
     * @param string $application_id Application ID
     * @param string $event_name Event name
     * @param string $event_date Event date
     * @throws \Exception If file upload fails
     */
    private function handleFileUploads($files, $application_id, $event_name, $event_date) {
        // Handle array of files
        if (isset($files['name']) && is_array($files['name'])) {
            $count = count($files['name']);
            for ($i = 0; $i < $count; $i++) {
                $filename = $files['name'][$i];
                $tmp_name = $files['tmp_name'][$i];
                $filetype = $files['type'][$i];
                $filesize = $files['size'][$i];
                
                // Validate file
                $this->validateFile($filename, $filetype, $filesize);
                
                // Get additional file info if available
                $fileInfo = null;
                if (isset($_POST['fileInfo']) && is_array($_POST['fileInfo']) && isset($_POST['fileInfo'][$i])) {
                    $fileInfo = json_decode($_POST['fileInfo'][$i], true);
                }
                
                // Use custom filename if provided in fileInfo
                $custom_filename = ($fileInfo && isset($fileInfo['filename'])) ? $fileInfo['filename'] : null;
                
                $file_extension = pathinfo($filename, PATHINFO_EXTENSION);
                $unique_filename = ($custom_filename) 
                    ? $application_id . '_' . preg_replace('/[^a-zA-Z0-9\._-]/', '', $custom_filename) 
                    : $application_id . '_' . uniqid() . '.' . $file_extension;
                
                $target_file = $this->uploadDirectory . $unique_filename;
    
                // Move the uploaded file to the target directory
                if (move_uploaded_file($tmp_name, $target_file)) {
                    $db_file_path = "/upload/coa/" . $unique_filename;
    
                    $file_data = [
                        'file_name' => $filename,
                        'file_path' => $db_file_path,
                        'file_type' => $filetype,
                        'file_size' => $filesize,
                        'requirement_type' => 'general',
                        'event_name' => $event_name,
                        'event_date' => $event_date
                    ];
    
                    if (!$this->certificateModel->createCOA($file_data, $application_id)) {
                        throw new \Exception("Failed to save file info: $filename");
                    }
                } else {
                    throw new \Exception("Failed to upload file: $filename");
                }
            }
        }
    }
    
    /**
     * Handle base64 encoded files from JSON
     * 
     * @param array $uploaded_files Array of file data
     * @param string $application_id Application ID
     * @param string $event_name Event name
     * @param string $event_date Event date
     * @throws \Exception If file upload fails
     */
    private function handleUploadedFilesFromJson($uploaded_files, $application_id, $event_name, $event_date) {
        foreach ($uploaded_files as $file) {
            // Validate file data
            if (!isset($file['filename']) || !isset($file['base64_data'])) {
                throw new \Exception("Invalid file data - missing filename or base64_data");
            }
            
            $filename = $file['filename'];
            
            // Get file extension and validate file type
            $file_extension = pathinfo($filename, PATHINFO_EXTENSION);
            
            // Extract MIME type from base64 data when possible
            $base64_parts = explode(';base64,', $file['base64_data']);
            $mime_type = null;
            
            if (count($base64_parts) > 1) {
                // Extract mime type from data URI
                $mime_header = $base64_parts[0];
                if (strpos($mime_header, 'data:') === 0) {
                    $mime_type = substr($mime_header, 5);
                }
                $base64_data = $base64_parts[1];
            } else {
                $base64_data = $file['base64_data'];
            }
            
            // Decode base64 data
            $file_data = base64_decode($base64_data);
            
            // Calculate file size
            $filesize = strlen($file_data);
            
            // Validate file size
            if ($filesize > $this->maxFileSize) {
                throw new \Exception("File size exceeds maximum allowed size: $filename");
            }
            
            // Create a safe filename
            $safe_filename = preg_replace('/[^a-zA-Z0-9\._-]/', '', $filename);
            $unique_filename = $application_id . '_' . time() . '_' . $safe_filename;
            $target_file = $this->uploadDirectory . $unique_filename;
            
            // Save the file
            if (file_put_contents($target_file, $file_data)) {
                $db_file_path = "/upload/coa/" . $unique_filename;
                
                // Get file mime type
                if (!$mime_type && function_exists('mime_content_type')) {
                    $mime_type = mime_content_type($target_file);
                } else {
                    // Default mime type based on extension
                    $mime_type = $this->getMimeTypeFromExtension($file_extension);
                }
                
                // Validate file type after saving
                if (!in_array($mime_type, $this->allowedFileTypes)) {
                    // Delete the file if type is not allowed
                    unlink($target_file);
                    throw new \Exception("File type not allowed: $filename ($mime_type)");
                }
                
                $file_info = [
                    'file_name' => $filename,
                    'file_path' => $db_file_path,
                    'file_type' => $mime_type,
                    'file_size' => $filesize,
                    'requirement_type' => 'general',
                    'event_name' => $event_name,
                    'event_date' => $event_date
                ];
                
                if (!$this->certificateModel->createCOA($file_info, $application_id)) {
                    throw new \Exception("Failed to save file info: $filename");
                }
            } else {
                throw new \Exception("Failed to save file: $filename");
            }
        }
    }
    
    /**
     * Get MIME type from file extension
     * 
     * @param string $extension File extension
     * @return string MIME type
     */
    private function getMimeTypeFromExtension($extension) {
        $extension = strtolower($extension);
        
        $mime_types = [
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png'
        ];
        
        return $mime_types[$extension] ?? 'application/octet-stream';
    }
    
    /**
     * Validate file
     * 
     * @param string $filename File name
     * @param string $filetype File MIME type
     * @param int $filesize File size in bytes
     * @throws \Exception If validation fails
     */
    private function validateFile($filename, $filetype, $filesize) {
        // Check file size
        if ($filesize > $this->maxFileSize) {
            throw new \Exception("File size exceeds maximum allowed size: $filename");
        }
        
        // Check file type
        if (!in_array($filetype, $this->allowedFileTypes)) {
            throw new \Exception("File type not allowed: $filename ($filetype)");
        }
    }
    
    /**
     * Get all uploaded files for an application
     * 
     * @param string $application_id Application ID
     */
    public function getFiles($application_id) {
        try {
            // Validate application ID
            if (!$this->isValidApplicationId($application_id)) {
                throw new \Exception("Invalid application ID format");
            }
            
            $result = $this->certificateModel->getDocumentsByApplicationId($application_id);
            $files = $result->fetchAll(\PDO::FETCH_ASSOC);
            
            // Add full URLs to file paths
            $baseUrl = $this->getBaseUrl();
            foreach ($files as &$file) {
                $file['file_url'] = $baseUrl . $file['file_path'];
            }
            
            $this->sendJsonResponse(200, [
                "success" => true,
                "files" => $files
            ]);
        } catch (\Exception $e) {
            $this->sendJsonResponse(400, [
                "success" => false,
                "message" => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Delete a file
     * 
     * @param int $id File ID
     */
    public function deleteFile($id) {
        try {
            // Validate ID
            if (!is_numeric($id) || $id <= 0) {
                throw new \Exception("Invalid file ID");
            }
            
            if ($this->certificateModel->delete($id)) {
                $this->sendJsonResponse(200, [
                    "success" => true,
                    "message" => "File deleted successfully"
                ]);
            } else {
                throw new \Exception("Failed to delete file");
            }
        } catch (\Exception $e) {
            $this->sendJsonResponse(400, [
                "success" => false,
                "message" => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Check if application ID is valid
     * 
     * @param string $application_id Application ID to validate
     * @return bool True if valid, false otherwise
     */
    private function isValidApplicationId($application_id) {
        // Application ID should be numeric and have a specific length
        return is_numeric($application_id) && strlen($application_id) >= 8;
    }
    
    /**
     * Get base URL for files
     * 
     * @return string Base URL
     */
    private function getBaseUrl() {
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
        $host = $_SERVER['HTTP_HOST'];
        return $protocol . $host;
    }
    
    /**
     * Send JSON response
     * 
     * @param int $status_code HTTP status code
     * @param array $data Response data
     */
    private function sendJsonResponse($status_code, $data) {
        http_response_code($status_code);
        echo json_encode($data);
        exit();
    }
}