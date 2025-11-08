<?php

namespace App\Services;

use App\Models\ApplicationFileModel;
use App\Models\CertificateOfAppearanceModel;
use App\Models\ProfilePictureModel;

class ProfilePictureService
{
    private $model;
    private $fileUploadService;

    public function __construct($pdo)
    {
        $this->model = new ProfilePictureModel($pdo);
        $this->fileUploadService = new ProfileFileUploadService();
    }

    public function createFiles($application_id, $files = null, $base64Files = null, $type)
    {
        $uploadedFiles = [];

        if ($files) {
            $uploadedFiles = array_merge(
                $uploadedFiles,
                $this->fileUploadService->handleFormDataFiles('users', $files, $application_id),
            );
        }

        if ($base64Files) {
            $uploadedFiles = array_merge(
                $uploadedFiles,
                $this->fileUploadService->handleBase64Files('users', $base64Files, $application_id),
            );
        }

        // Save file information to database
        foreach ($uploadedFiles as $file) {
            $fileData = [
                'file_name' => $file['original_name'],
                'file_path' => $file['path'],
                'file_type' => $file['type'],
                'file_size' => $file['size'],
                // 'type' => $type,
            ];

            if (!$this->model->create($fileData, $application_id)) {
                throw new \Exception('Failed to save file info: ' . $file['original_name']);
            }
        }

        return $application_id;
    }

    public function updateFiles(
        $applicationId,
        $removedExistingFiles = [],
        $files = null,
        $base64Files = null,
        $type,
    ) {
        // Handle file uploads
        $uploadedFiles = [];

        if ($files) {
            $uploadedFiles = array_merge(
                $uploadedFiles,
                $this->fileUploadService->handleFormDataFiles('users', $files, $applicationId),
            );
        }

        if ($base64Files) {
            $uploadedFiles = array_merge(
                $uploadedFiles,
                $this->fileUploadService->handleBase64Files('users', $base64Files, $applicationId),
            );
        }

        foreach ($removedExistingFiles as $file) {
            if (!$this->model->deleteFiles($file['id'])) {
                throw new \Exception('Unable to delete existing file: ');
            }
        }

        foreach ($uploadedFiles as $file) {
            $fileData = [
                'file_name' => $file['original_name'],
                'file_path' => $file['path'],
                'file_type' => $file['type'],
                'file_size' => $file['size'],
                // 'type' => $type,
            ];

            if (!$this->model->create($fileData, $applicationId)) {
                throw new \Exception('Failed to save file info: ' . $file['original_name']);
            }
        }

        return $applicationId;
    }
}

?>
