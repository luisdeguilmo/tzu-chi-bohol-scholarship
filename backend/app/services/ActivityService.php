<?php

namespace App\Services;

use App\Models\ActivityModel;
use App\Models\CertificateOfAppearanceModel;

class ActivityService
{
    private $activityModel;
    private $certificateModel;
    private $fileUploadService;

    public function generateBatchId()
    {
        return uniqid('batch_', true);
    }

    public function __construct($pdo)
    {
        $this->activityModel = new ActivityModel($pdo);
        $this->certificateModel = new CertificateOfAppearanceModel($pdo);
        $this->fileUploadService = new FileUploadService();
    }

    public function createActivityWithFiles($activityData, $files = null, $base64Files = null)
    {
        $batch_id = $this->generateBatchId();
        // Validate activity data
        $this->validateActivityData($activityData);

        // Create activity
        $activityId = $this->activityModel->createActivity($activityData, $batch_id);

        if (!$activityId) {
            throw new \Exception('Failed to create activity');
        }

        // Handle file uploads
        $uploadedFiles = [];

        if ($files) {
            $uploadedFiles = array_merge(
                $uploadedFiles,
                $this->fileUploadService->handleFormDataFiles('activities', $files, $activityId),
            );
        }

        if ($base64Files) {
            $uploadedFiles = array_merge(
                $uploadedFiles,
                $this->fileUploadService->handleBase64Files(
                    'activities',
                    $base64Files,
                    $activityId,
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
                'requirement_type' => 'certificate_of_appearance',
            ];

            if (!$this->certificateModel->createCOA($fileData, $activityId, $batch_id)) {
                throw new \Exception('Failed to save file info: ' . $file['original_name']);
            }
        }

        return $activityId;
    }

    public function updateActivityWithFiles(
        $activityData,
        $existingFiles = [],
        $removedExistingFiles = [],
        $files = null,
        $base64Files = null,
    ) {
        $batch_id = $this->generateBatchId();
        // Validate activity data
        $this->validateActivityData($activityData);

        // Create activity
        $activityId = $this->activityModel->updateActivity($activityData, $batch_id);

        if (!$activityId) {
            throw new \Exception('Failed to create activity');
        }

        // Handle file uploads
        $uploadedFiles = [];

        if ($files) {
            $uploadedFiles = array_merge(
                $uploadedFiles,
                $this->fileUploadService->handleFormDataFiles('activities', $files, $activityId),
            );
        }

        if ($base64Files) {
            $uploadedFiles = array_merge(
                $uploadedFiles,
                $this->fileUploadService->handleBase64Files(
                    'activities',
                    $base64Files,
                    $activityId,
                ),
            );
        }

        if (
            !$this->certificateModel->deleteCOA(
                $activityData['activity_id'],
                $activityData['batch_id'],
            )
        ) {
            throw new \Exception('Unable to delete existing coa');
        }

        foreach ($existingFiles as $file) {
            if (!$this->certificateModel->updateCOABatchId($file['id'], $batch_id)) {
                throw new \Exception('Unable to update existing file: ');
            }
        }

        foreach ($removedExistingFiles as $file) {
            if (!$this->certificateModel->deleteCOA($file['id'])) {
                throw new \Exception('Unable to delete existing file: ');
            }
        }

        // Save file information to database
        foreach ($uploadedFiles as $file) {
            $fileData = [
                'file_name' => $file['original_name'],
                'file_path' => $file['path'],
                'file_type' => $file['type'],
                'file_size' => $file['size'],
                'requirement_type' => 'certificate_of_appearance',
            ];

            if (!$this->certificateModel->createCOA($fileData, $activityId, $batch_id)) {
                throw new \Exception('Failed to save file info: ' . $file['original_name']);
            }
        }

        return $activityId;
    }

    private function validateActivityData($data)
    {
        $required = [
            'application_id',
            'activity_name',
            'activity_location',
            'activity_date',
            'start_time',
            'end_time',
            'activity_status',
        ];

        foreach ($required as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                throw new \Exception('Required field missing: ' . $field);
            }
        }

        // Additional validation logic here
        if (!strtotime($data['activity_date'])) {
            throw new \Exception('Invalid activity date format');
        }
    }
}

?>
