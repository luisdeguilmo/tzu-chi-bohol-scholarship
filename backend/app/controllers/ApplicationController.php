<?php

namespace App\Controllers;
require_once __DIR__ . "/../../config/Database.php";

// CORS headers again in PHP (in case .htaccess isn't enough)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

use \Config\Database;
use App\Models\ApplicationModel;
use App\Models\PersonalModel;
use App\Models\EducationModel;
use App\Models\FamilyModel;
use App\Models\ContactPersonModel;
use App\Models\FamilyMemberModel;
use App\Models\ScholarModel;
use App\Models\AssistanceModel;
use App\Models\RequirementModel;

class ApplicationController {

    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function createApplication() {
        // Start transaction
        $this->pdo->beginTransaction();

        try {
            // Handle data from both FormData and direct JSON
            if (isset($_POST['applicationData'])) {
                // Handle data from FormData
                $data = json_decode($_POST['applicationData'], true);
            } else {
                // Handle direct JSON input 
                $data = json_decode(file_get_contents("php://input"), true);
            }
            
            file_put_contents("log.txt", json_encode($data) . PHP_EOL, FILE_APPEND);
            
            if (!$data) {
                throw new \Exception("No data provided");
            }

            // Process application data
            $application = new ApplicationModel();
            $application_id = $application->create($data['application_info']);

            if (!$application_id) {
                throw new \Exception("Failed to create application");
            }

            // Process personal information
            $personal = new PersonalModel($this->pdo);
            if (!$personal->create($data['personal_information'], $application_id)) {
                throw new \Exception("Failed to save personal information");
            } 

            // Process education information
            $education = new EducationModel($this->pdo);
            if (!$education->create($data['educational_background'], $application_id)) {
                throw new \Exception("Failed to save education information");
            }

             // Process family information
            $family = new FamilyModel($this->pdo);
            if (!$family->create($data['parents_guardian'], $application_id)) {
                throw new \Exception("Failed to save family information");
            }

            // Process contact person
            $contactPerson = new ContactPersonModel($this->pdo);
            if (isset($data['contact_person']) && !empty($data['contact_person'])) {
                if (!$contactPerson->create($data['contact_person'], $application_id)) {
                    throw new \Exception("Failed to save contact person");
                }
            }

            if (isset($data['family_members']) && is_array($data['family_members'])) {
                $familyMember = new FamilyMemberModel($this->pdo);
                foreach ($data['family_members'] as $member) {
                    if (!$familyMember->create($member, $application_id)) {
                        throw new \Exception("Failed to save family member");
                    }
                }
            }

            // Process tzu chi scholars
            if (isset($data['tzu_chi_siblings']) && is_array($data['tzu_chi_siblings'])) {
                $scholar = new ScholarModel($this->pdo);
                foreach ($data['tzu_chi_siblings'] as $scholarData) {
                    if (!$scholar->create($scholarData, $application_id)) {
                        throw new \Exception("Failed to save scholar");
                    }
                }
            }

            // Process assistance list
            if (isset($data['other_assistance']) && is_array($data['other_assistance'])) {
                $assistance = new AssistanceModel($this->pdo);
                foreach ($data['other_assistance'] as $assistanceData) {
                    if (!$assistance->create($assistanceData, $application_id)) {
                        throw new \Exception("Failed to save assistance");
                    }
                }
            }

            // Handle file uploads from FormData
            if (isset($_FILES['files'])) {
                $this->handleFileUploads($_FILES['files'], $application_id);
            }

            // Handle base64 encoded files in the JSON data
            if (isset($data['uploaded_files']) && is_array($data['uploaded_files'])) {
                $this->handleUploadedFilesFromJson($data['uploaded_files'], $application_id);
            }

            // Commit transaction if everything went well
            $this->pdo->commit();
            
            // Return success response
            http_response_code(201);
            echo json_encode(array(
                "success" => true,
                "message" => "Application created successfully",
                "application_id" => $application_id
            ));

        } catch (\Exception $e) {
            // Roll back transaction on error
            $this->pdo->rollBack();
            
            http_response_code(400);
            echo json_encode(array(
                "success" => false,
                "message" => $e->getMessage()
            ));
        }
    }

    // Handle file uploads from FormData
    private function handleFileUploads($files, $application_id) {
        $base_upload_dir = __DIR__ . "/../../public/upload/";
        $upload_dir = $base_upload_dir . "applications/" . $application_id . "/";
    
        // Create directories if they don't exist
        if (!is_dir($base_upload_dir)) {
            mkdir($base_upload_dir, 0777, true);
        }
    
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
    
        $requirementModel = new RequirementModel($this->pdo);
    
        // Handle array of files
        if (isset($files['name']) && is_array($files['name'])) {
            $count = count($files['name']);
            for ($i = 0; $i < $count; $i++) {
                $filename = $files['name'][$i];
                $tmp_name = $files['tmp_name'][$i];
                $filetype = $files['type'][$i];
                $filesize = $files['size'][$i];
                
                // Get additional file info if available
                $fileInfo = null;
                if (isset($_POST['fileInfo']) && is_array($_POST['fileInfo']) && isset($_POST['fileInfo'][$i])) {
                    $fileInfo = json_decode($_POST['fileInfo'][$i], true);
                }
                
                // Use custom filename if provided in fileInfo
                $custom_filename = ($fileInfo && isset($fileInfo['filename'])) ? $fileInfo['filename'] : null;
                
                $file_extension = pathinfo($filename, PATHINFO_EXTENSION);
                $unique_filename = ($custom_filename) ? $custom_filename : uniqid() . '.' . $file_extension;
                $target_file = $upload_dir . $unique_filename;
    
                // Move the uploaded file to the target directory
                if (move_uploaded_file($tmp_name, $target_file)) {
                    $db_file_path = "/upload/applications/" . $application_id . "/" . $unique_filename;
    
                    $file_data = [
                        'file_name' => $filename,
                        'file_path' => $db_file_path,
                        'file_type' => $filetype,
                        'file_size' => $filesize,
                        'requirement_type' => 'general' // Adjust as needed
                    ];
    
                    if (!$requirementModel->create($file_data, $application_id)) {
                        throw new \Exception("Failed to save file info: $filename");
                    }
                } else {
                    throw new \Exception("Failed to upload file: $filename");
                }
            }
        }
    }
    
    // Handle base64 encoded files from JSON
    private function handleUploadedFilesFromJson($uploaded_files, $application_id) {
        $base_upload_dir = __DIR__ . "/../../public/upload/";
        $upload_dir = $base_upload_dir . "applications/" . $application_id . "/";
    
        // Debug
        file_put_contents("debug_log.txt", "Base upload dir: " . $base_upload_dir . PHP_EOL, FILE_APPEND);
        file_put_contents("debug_log.txt", "Upload dir: " . $upload_dir . PHP_EOL, FILE_APPEND);
    
        // Create directories if they don't exist
        if (!is_dir($base_upload_dir)) {
            mkdir($base_upload_dir, 0777, true);
            file_put_contents("debug_log.txt", "Created base dir" . PHP_EOL, FILE_APPEND);
        }
    
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
            file_put_contents("debug_log.txt", "Created upload dir" . PHP_EOL, FILE_APPEND);
        }
    
        $requirementModel = new RequirementModel($this->pdo);
    
        foreach ($uploaded_files as $file) {
            // Debug
            file_put_contents("debug_log.txt", "Processing file: " . json_encode($file) . PHP_EOL, FILE_APPEND);
            
            // Handle base64 encoded files or file data from client
            if (isset($file['base64_data'])) {
                $filename = $file['filename'] ?? uniqid() . '.jpg';
                $target_file = $upload_dir . $filename;
                
                // Debug - track what we're doing
                file_put_contents("debug_log.txt", "Target file: " . $target_file . PHP_EOL, FILE_APPEND);
                
                // Get first 20 chars of base64 for debug (not the whole string)
                $base64_preview = substr($file['base64_data'], 0, 20) . "...";
                file_put_contents("debug_log.txt", "Base64 preview: " . $base64_preview . PHP_EOL, FILE_APPEND);
                
                // Decode and save the file
                $file_data = base64_decode($file['base64_data']);
                
                if (file_put_contents($target_file, $file_data)) {
                    $db_file_path = "/upload/applications/" . $application_id . "/" . $filename;
                    
                    // Debug - confirm file was written
                    file_put_contents("debug_log.txt", "File written successfully: " . $filename . PHP_EOL, FILE_APPEND);
                    
                    // Get file mime type and size
                    $mime_type = "application/octet-stream"; // Default
                    if (function_exists('mime_content_type')) {
                        $mime_type = mime_content_type($target_file);
                    }
                    $file_size = filesize($target_file);
                    
                    $file_info = [
                        'file_name' => $filename,
                        'file_path' => $db_file_path,
                        'file_type' => $mime_type,
                        'file_size' => $file_size,
                        'requirement_type' => 'general' // Adjust as needed
                    ];
                    
                    // Debug
                    file_put_contents("debug_log.txt", "File info: " . json_encode($file_info) . PHP_EOL, FILE_APPEND);
                    
                    if (!$requirementModel->create($file_info, $application_id)) {
                        file_put_contents("debug_log.txt", "Failed to save file info in DB" . PHP_EOL, FILE_APPEND);
                        throw new \Exception("Failed to save file info: $filename");
                    }
                    
                    file_put_contents("debug_log.txt", "File saved in DB successfully" . PHP_EOL, FILE_APPEND);
                } else {
                    file_put_contents("debug_log.txt", "Failed to write file to disk" . PHP_EOL, FILE_APPEND);
                    throw new \Exception("Failed to save file: $filename");
                }
            } else {
                file_put_contents("debug_log.txt", "No base64_data found in file entry" . PHP_EOL, FILE_APPEND);
                throw new \Exception("Invalid file data provided - missing base64_data");
            }
        }
    }
}
?>