<?php

namespace App\Services;

use App\Models\ActivityModel;
use App\Models\CertificateOfAppearanceModel;

class ActivityService {
    private $activityModel;
    private $certificateModel;
    private $fileUploadService;
    
    public function __construct($pdo) {
        $this->activityModel = new ActivityModel($pdo);
        $this->certificateModel = new CertificateOfAppearanceModel($pdo);
        $this->fileUploadService = new FileUploadService();
    }
    
    public function createActivityWithFiles($activityData, $files = null, $base64Files = null) {
        // Validate activity data
        $this->validateActivityData($activityData);
        
        // Create activity
        $activityId = $this->activityModel->createActivity($activityData);
        
        if (!$activityId) {
            throw new \Exception("Failed to create activity");
        }
        
        // Handle file uploads
        $uploadedFiles = [];
        
        if ($files) {
            $uploadedFiles = array_merge(
                $uploadedFiles, 
                $this->fileUploadService->handleFormDataFiles($files, $activityId)
            );
        }
        
        if ($base64Files) {
            $uploadedFiles = array_merge(
                $uploadedFiles, 
                $this->fileUploadService->handleBase64Files($base64Files, $activityId)
            );
        }
        
        // Save file information to database
        foreach ($uploadedFiles as $file) {
            $fileData = [
                'file_name' => $file['original_name'],
                'file_path' => $file['path'],
                'file_type' => $file['type'],
                'file_size' => $file['size'],
                'requirement_type' => 'certificate_of_appearance'
            ];
            
            if (!$this->certificateModel->createCOA($fileData, $activityId)) {
                throw new \Exception("Failed to save file info: " . $file['original_name']);
            }
        }
        
        return $activityId;
    }
    
    private function validateActivityData($data) {
        $required = ['application_id', 'activity_name', 'activity_date', 'activity_time'];
        
        foreach ($required as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                throw new \Exception("Required field missing: " . $field);
            }
        }
        
        // Additional validation logic here
        if (!strtotime($data['activity_date'])) {
            throw new \Exception("Invalid activity date format");
        }
    }
}

?>