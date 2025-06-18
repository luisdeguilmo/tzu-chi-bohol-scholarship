<?php
// Improved Service Layer
namespace App\Services;

class FileUploadService {
    private $baseUploadDir;
    
    public function __construct() {
        $this->baseUploadDir = __DIR__ . "/../../public/upload/";
    }
    
    public function handleFormDataFiles($files, $activityId) {
        $uploadDir = $this->createUploadDirectory($activityId);
        $uploadedFiles = [];
        
        if (isset($files['name']) && is_array($files['name'])) {
            $count = count($files['name']);
            for ($i = 0; $i < $count; $i++) {
                $fileData = [
                    'name' => $files['name'][$i],
                    'tmp_name' => $files['tmp_name'][$i],
                    'type' => $files['type'][$i],
                    'size' => $files['size'][$i]
                ];
                
                $uploadedFiles[] = $this->processFile($fileData, $uploadDir, $activityId);
            }
        }
        
        return $uploadedFiles;
    }
    
    public function handleBase64Files($base64Files, $activityId) {
        $uploadDir = $this->createUploadDirectory($activityId);
        $uploadedFiles = [];
        
        foreach ($base64Files as $file) {
            if (!isset($file['base64_data'])) {
                throw new \Exception("Invalid file data - missing base64_data");
            }
            
            $uploadedFiles[] = $this->processBase64File($file, $uploadDir, $activityId);
        }
        
        return $uploadedFiles;
    }
    
    private function createUploadDirectory($activityId) {
        $uploadDir = $this->baseUploadDir . "activities/" . $activityId . "/";
        
        if (!is_dir($this->baseUploadDir)) {
            mkdir($this->baseUploadDir, 0777, true);
        }
        
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        return $uploadDir;
    }
    
    private function processFile($fileData, $uploadDir, $activityId) {
        $fileExtension = pathinfo($fileData['name'], PATHINFO_EXTENSION);
        $uniqueFilename = uniqid() . '.' . $fileExtension;
        $targetFile = $uploadDir . $uniqueFilename;
        
        if (!move_uploaded_file($fileData['tmp_name'], $targetFile)) {
            throw new \Exception("Failed to upload file: " . $fileData['name']);
        }
        
        return [
            'original_name' => $fileData['name'],
            'filename' => $uniqueFilename,
            'path' => "/upload/activities/" . $activityId . "/" . $uniqueFilename,
            'type' => $fileData['type'],
            'size' => $fileData['size']
        ];
    }
    
    private function processBase64File($file, $uploadDir, $activityId) {
        $filename = $file['filename'] ?? uniqid() . '.jpg';
        $targetFile = $uploadDir . $filename;
        
        $fileContent = base64_decode($file['base64_data']);
        
        if (!file_put_contents($targetFile, $fileContent)) {
            throw new \Exception("Failed to save file: " . $filename);
        }
        
        $mimeType = function_exists('mime_content_type') 
            ? mime_content_type($targetFile) 
            : 'application/octet-stream';
        
        return [
            'original_name' => $filename,
            'filename' => $filename,
            'path' => "/upload/activities/" . $activityId . "/" . $filename,
            'type' => $mimeType,
            'size' => filesize($targetFile)
        ];
    }
}

?>