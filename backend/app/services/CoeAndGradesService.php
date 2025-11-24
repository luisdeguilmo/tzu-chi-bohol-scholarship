<?php

namespace App\Services;

use App\Models\CoeAndGradeFilesModel;
use App\Models\CoeGradesModel;
use App\Services\FileUploadService;

class CoeAndGradesService
{
    private $coeGradesModel;
    private $documentModel;
    private $fileUploadService;

    public function generateBatchId()
    {
        return uniqid('batch_', true);
    }

    public function __construct($pdo)
    {
        $this->coeGradesModel = new CoeGradesModel($pdo);
        $this->documentModel = new CoeAndGradeFilesModel($pdo);
        $this->fileUploadService = new FileUploadService();
    }

    public function createSubmissionWithFiles($submissionData, $files = null, $base64Files = null)
    {
        // $batch_id = $this->generateBatchId();
        // Validate submission data
        // $this->validateSubmissionData($submissionData);

        // Create submission
        $submissionId = $this->coeGradesModel->createActivity($submissionData);

        if (!$submissionId) {
            throw new \Exception('Failed to create COE and grades submission');
        }

        // Handle file uploads
        $uploadedFiles = [];

        if ($files) {
            $uploadedFiles = array_merge(
                $uploadedFiles,
                $this->fileUploadService->handleFormDataFiles('coe_grades', $files, $submissionId),
            );
        }

        if ($base64Files) {
            $uploadedFiles = array_merge(
                $uploadedFiles,
                $this->fileUploadService->handleBase64Files(
                    'coe_grades',
                    $base64Files,
                    $submissionId,
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
            ];

            if (
                !$this->documentModel->createCoeGradeFile($fileData, $submissionData, $submissionId)
            ) {
                throw new \Exception('Failed to save file info: ' . $file['original_name']);
            }
        }

        return $submissionId;
    }

    public function updateSubmissionWithFiles(
        $submissionData,
        $existingFiles = [],
        $removedExistingFiles = [],
        $files = null,
        $base64Files = null,
    ) {
        // $batch_id = $this->generateBatchId();
        // Validate submission data
        // $this->validateSubmissionData($submissionData);

        // Update submission
        $submissionId = $submissionData['id'];
        $this->coeGradesModel->updateSubmission($submissionData);

        if (!$submissionId) {
            throw new \Exception('Failed to update COE and grades submission');
        }

        // Handle file uploads
        $uploadedFiles = [];

        if ($files) {
            $uploadedFiles = array_merge(
                $uploadedFiles,
                $this->fileUploadService->handleFormDataFiles(
                    'coe_grades',
                    $files,
                    $submissionData['scholar_id'],
                ),
            );
        }

        if ($base64Files) {
            $uploadedFiles = array_merge(
                $uploadedFiles,
                $this->fileUploadService->handleBase64Files(
                    'coe_grades',
                    $base64Files,
                    $submissionData['scholar_id'],
                ),
            );
        }

        // if (!$this->documentModel->deleteCoeGradeFile($submissionId)) {
        //     throw new \Exception('Unable to delete existing documents');
        // }

        // foreach ($existingFiles as $file) {
        //     if (!$this->documentModel->updateDocumentBatchId($file['id'], $batch_id)) {
        //         throw new \Exception('Unable to update existing file');
        //     }
        // }

        foreach ($removedExistingFiles as $file) {
            if (!$this->documentModel->deleteCoeGradeFile($file['id'])) {
                throw new \Exception('Unable to delete existing file');
            }
        }

        // Save file information to database
        foreach ($uploadedFiles as $file) {
            $fileData = [
                'file_name' => $file['original_name'],
                'file_path' => $file['path'],
                'file_type' => $file['type'],
                'file_size' => $file['size'],
            ];

            if (
                !$this->documentModel->createCoeGradeFile(
                    $fileData,
                    $submissionData,
                    $submissionData['scholar_id'],
                )
            ) {
                throw new \Exception('Failed to save file info: ' . $file['original_name']);
            }
        }

        return $submissionId;
    }

    private function validateSubmissionData($data)
    {
        $required = ['scholar_id', 'year_level', 'semester'];

        foreach ($required as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                throw new \Exception('Required field missing: ' . $field);
            }
        }

        // Validate year level
        $validYearLevels = ['1', '2', '3', '4', '5'];
        if (!in_array($data['year_level'], $validYearLevels)) {
            throw new \Exception('Invalid year level');
        }

        // Validate semester
        $validSemesters = ['1st Semester', '2nd Semester', 'Summer'];
        if (!in_array($data['semester'], $validSemesters)) {
            throw new \Exception('Invalid semester');
        }
    }
}

?>
