<?php

namespace App\Services;

use App\Models\ApplicationFileModel;
use App\Models\CertificateOfAppearanceModel;

class ApplicationFileService
{
    private $model;
    private $fileUploadService;

    public function __construct($pdo)
    {
        $this->model = new ApplicationFileModel($pdo);
        $this->fileUploadService = new ApplicationFileUploadService();
    }

    public function createFiles($application_id, $files = null, $base64Files = null, $type)
    {
        $uploadedFiles = [];

        if ($files) {
            $uploadedFiles = array_merge(
                $uploadedFiles,
                $this->fileUploadService->handleFormDataFiles(
                    'applications',
                    $files,
                    $application_id,
                ),
            );
        }

        if ($base64Files) {
            $uploadedFiles = array_merge(
                $uploadedFiles,
                $this->fileUploadService->handleBase64Files(
                    'applications',
                    $base64Files,
                    $application_id,
                ),
            );
        }

        // Save file information to database
        foreach ($uploadedFiles as $file) {
            $fileData = [
                'file_name' => $file['original_name'],
                'file_path' => $file['path'],
                'file_type' => $file['type'],
                'file_size' => $file['size'],
                'type' => $type,
            ];

            if (!$this->model->createFile($fileData, $application_id, $type)) {
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
                $this->fileUploadService->handleFormDataFiles(
                    'applications',
                    $files,
                    $applicationId,
                ),
            );
        }

        if ($base64Files) {
            $uploadedFiles = array_merge(
                $uploadedFiles,
                $this->fileUploadService->handleBase64Files(
                    'applications',
                    $base64Files,
                    $applicationId,
                ),
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
                'type' => $type,
            ];

            if (!$this->model->createFile($fileData, $applicationId, $type)) {
                throw new \Exception('Failed to save file info: ' . $file['original_name']);
            }
        }

        return $applicationId;
    }

    // private function validateActivityData($data)
    // {
    //     $required = [
    //         'application_id',
    //         'activity_name',
    //         'activity_location',
    //         'activity_date',
    //         'start_time',
    //         'end_time',
    //         'activity_status',
    //     ];

    //     foreach ($required as $field) {
    //         if (!isset($data[$field]) || empty(trim($data[$field]))) {
    //             throw new \Exception('Required field missing: ' . $field);
    //         }
    //     }

    //     // Additional validation logic here
    //     if (!strtotime($data['activity_date'])) {
    //         throw new \Exception('Invalid activity date format');
    //     }
    // }
}

?>
