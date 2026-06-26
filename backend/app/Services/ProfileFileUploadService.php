<?php
// Improved Service Layer
namespace App\Services;

class ProfileFileUploadService
{
    private $baseUploadDir;

    public function __construct()
    {
        $this->baseUploadDir = __DIR__ . '/../../public/upload/';
    }

    public function handleFormDataFiles($folderName, $files, $applicationId)
    {
        $uploadDir = $this->createUploadDirectory($folderName, $applicationId);
        $uploadedFiles = [];

        if (isset($files['name']) && is_array($files['name'])) {
            $count = count($files['name']);
            for ($i = 0; $i < $count; $i++) {
                $fileData = [
                    'name' => $files['name'][$i],
                    'tmp_name' => $files['tmp_name'][$i],
                    'type' => $files['type'][$i],
                    'size' => $files['size'][$i],
                ];

                $uploadedFiles[] = $this->processFile(
                    $folderName,
                    $fileData,
                    $uploadDir,
                    $applicationId,
                );
            }
        }

        return $uploadedFiles;
    }

    public function handleBase64Files($folderName, $base64Files, $activityId)
    {
        $uploadDir = $this->createUploadDirectory($folderName, $activityId);
        $uploadedFiles = [];

        foreach ($base64Files as $file) {
            if (!isset($file['base64_data'])) {
                throw new \Exception('Invalid file data - missing base64_data');
            }

            $uploadedFiles[] = $this->processBase64File(
                $folderName,
                $file,
                $uploadDir,
                $activityId,
            );
        }

        return $uploadedFiles;
    }

    private function createUploadDirectory($folderName, $applicationId)
    {
        $uploadDir = $this->baseUploadDir . $folderName . '/' . $applicationId . '/' . 'profile/';

        if (!is_dir($this->baseUploadDir)) {
            mkdir($this->baseUploadDir, 0777, true);
        }

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        return $uploadDir;
    }

    private function processFile($folderName, $fileData, $uploadDir, $applicationId)
    {
        $fileExtension = pathinfo($fileData['name'], PATHINFO_EXTENSION);
        $uniqueFilename = uniqid() . '.' . $fileExtension;
        $targetFile = $uploadDir . $uniqueFilename;

        if (!move_uploaded_file($fileData['tmp_name'], $targetFile)) {
            throw new \Exception('Failed to upload file: ' . $fileData['name']);
        }

        return [
            'original_name' => $fileData['name'],
            'filename' => $uniqueFilename,
            'path' =>
                '/upload/' . $folderName . '/' . $applicationId . '/' . 'profile/' . $uniqueFilename,
            'type' => $fileData['type'],
            'size' => $fileData['size'],
        ];
    }

    private function processBase64File($folderName, $file, $uploadDir, $applicationId)
    {
        $filename = $file['filename'] ?? uniqid() . '.jpg';
        $targetFile = $uploadDir . $filename;

        $fileContent = base64_decode($file['base64_data']);

        if (!file_put_contents($targetFile, $fileContent)) {
            throw new \Exception('Failed to save file: ' . $filename);
        }

        $mimeType = function_exists('mime_content_type')
            ? mime_content_type($targetFile)
            : 'application/octet-stream';

        return [
            'original_name' => $filename,
            'filename' => $filename,
            'path' => '/upload/' . $folderName . '/' . $applicationId . '/' . 'profile/' . $filename,
            'type' => $mimeType,
            'size' => filesize($targetFile),
        ];
    }
}

?>
