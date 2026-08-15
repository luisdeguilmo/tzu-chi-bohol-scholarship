<?php
namespace App\Services;

// $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../');

// if (file_exists(__DIR__ . '/../.env')) {
//     $dotenv->load();
// }

class FileUploadService
{
    private $storageService;

    public function __construct(B2StorageService $storageService = null)
    {
        $this->storageService = $storageService ?? new B2StorageService();
    }

    public function handleFormDataFiles($folderName, $files, $activityId)
    {
        $folder = $this->buildFolderPath($folderName, $activityId);
        $uploadedFiles = [];

        if (isset($files['name']) && is_array($files['name'])) {
            $count = count($files['name']);
            for ($i = 0; $i < $count; $i++) {
                $fileData = [
                    'name' => $files['name'][$i],
                    'tmp_name' => $files['tmp_name'][$i],
                    'type' => $files['type'][$i],
                    'size' => $files['size'][$i],
                    'error' => $files['error'][$i] ?? UPLOAD_ERR_OK,
                ];

                if ($fileData['error'] !== UPLOAD_ERR_OK) {
                    throw new \Exception(
                        'Upload error for file: ' .
                            $fileData['name'] .
                            ' (code ' .
                            $fileData['error'] .
                            ')',
                    );
                }

                $uploadedFiles[] = $this->processFile($folder, $fileData);
            }
        }

        return $uploadedFiles;
    }

    public function handleBase64Files($folderName, $base64Files, $activityId)
    {
        $folder = $this->buildFolderPath($folderName, $activityId);
        $uploadedFiles = [];

        foreach ($base64Files as $file) {
            if (!isset($file['base64_data'])) {
                throw new \Exception('Invalid file data - missing base64_data');
            }

            $uploadedFiles[] = $this->processBase64File($folder, $file);
        }

        return $uploadedFiles;
    }

    private function buildFolderPath($folderName, $activityId)
    {
        return trim($folderName, '/') . '/' . trim($activityId, '/');
    }

    private function processFile($folder, $fileData)
    {
        if (!is_uploaded_file($fileData['tmp_name'])) {
            throw new \Exception(
                'Invalid upload (possible attack or misconfigured form): ' . $fileData['name'],
            );
        }

        $fileExtension = pathinfo($fileData['name'], PATHINFO_EXTENSION);
        $uniqueFilename = uniqid() . ($fileExtension ? '.' . $fileExtension : '');

        $result = $this->storageService->upload($fileData['tmp_name'], $folder, $uniqueFilename);

        return [
            'original_name' => $fileData['name'],
            'filename' => $uniqueFilename,
            'path' => $result['path'],
            'url' => $this->storageService->getPublicUrl($result['path']),
            'type' => $fileData['type'],
            'size' => $fileData['size'],
        ];
    }

    private function processBase64File($folder, $file)
    {
        $filename = $file['filename'] ?? uniqid() . '.jpg';
        $fileContent = base64_decode($file['base64_data'], true);

        if ($fileContent === false) {
            throw new \Exception('Invalid base64 data for file: ' . $filename);
        }

        $tmpFile = tempnam(sys_get_temp_dir(), 'b64_');
        if ($tmpFile === false) {
            throw new \Exception('Could not create temp file for: ' . $filename);
        }

        $written = file_put_contents($tmpFile, $fileContent);
        if ($written === false) {
            @unlink($tmpFile);
            throw new \Exception('Failed to write temp file for: ' . $filename);
        }

        try {
            $result = $this->storageService->upload($tmpFile, $folder, $filename);

            $mimeType = function_exists('mime_content_type')
                ? (mime_content_type($tmpFile) ?:
                'application/octet-stream')
                : 'application/octet-stream';

            return [
                'original_name' => $filename,
                'filename' => $filename,
                'path' => $result['path'],
                'url' => $this->storageService->getPublicUrl($result['path']),
                'type' => $mimeType,
                'size' => strlen($fileContent),
            ];
        } finally {
            @unlink($tmpFile);
        }
    }
}
