<?php

namespace App\Controllers;

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/ApplicationModel.php';
require_once __DIR__ . '/../Models/PersonalModel.php';
require_once __DIR__ . '/../Models/EducationModel.php';
require_once __DIR__ . '/../Models/FamilyModel.php';
require_once __DIR__ . '/../Models/ContactPersonModel.php';
require_once __DIR__ . '/../Models/FamilyMemberModel.php';
require_once __DIR__ . '/../Models/ScholarModel.php';
require_once __DIR__ . '/../Models/AssistanceModel.php';
require_once __DIR__ . '/../Models/CharacterReferenceModel.php';
require_once __DIR__ . '/../Models/ExaminationFilesModel.php';
require_once __DIR__ . '/../Models/RequirementModel.php';
require_once __DIR__ . '/../Models/ProfilePictureModel.php';
require_once __DIR__ . '/../Models/RequirementsModel.php';

header('Content-Type: application/json');

use App\Constants\Action;
use Config\Database;
use App\Models\ApplicationModel;
use App\Models\PersonalModel;
use App\Models\EducationModel;
use App\Models\FamilyModel;
use App\Models\ContactPersonModel;
use App\Models\FamilyMemberModel;
use App\Models\ScholarModel;
use App\Models\AssistanceModel;
use App\Models\AuditLogModel;
use App\Models\CharacterReferenceModel;
use App\Models\ExaminationFilesModel;
use App\Models\FinalInterviewFilesModel;
use App\Models\HomeVisitationFilesModel;
use App\Models\InitialInterviewFilesModel;
use App\Models\RequirementModel;
use App\Models\ProfilePictureModel;
use App\Models\RequirementsModel;
use App\Services\SupabaseStorageService;

class ApplicationController
{
    private $pdo;
    private $storageService;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->storageService = new SupabaseStorageService();
    }

    public function createApplication()
    {
        $this->pdo->beginTransaction();

        try {
            // Handle data from FormData or JSON
            if (isset($_POST['applicationData'])) {
                $data = json_decode($_POST['applicationData'], true);
            } else {
                $data = json_decode(file_get_contents('php://input'), true);
            }

            if (!$data) {
                throw new \Exception('No data provided');
            }

            $is_existing_scholar = $data['application_info']['is_existing_scholar'];

            // Process application data
            $application = new ApplicationModel();

            $application_id = $this->generateUniqueApplicationId();

            // if ($is_existing_scholar) {
            //     $application_id = $application->createExistingScholar(
            //         $data,
            //         $data['other_information'],
            //         $application_id,
            //     );
            // } else {
                // $application_id = 
                    $application->create(
                    $data['application_info'],
                    $data['other_information'],
                    $application_id
                );
            // }

            // error_log("Application ID: " . $application_id);

            // if (!$application_id) {
            //     throw new \Exception('Failed to create application');
            // }

            // Process other data (personal, education, family, etc.)
            $this->processApplicationData($data, $application_id);

            // Handle profile picture upload
            // if (isset($_FILES['picture'])) {
            //     $this->handleProfilePictureUpload($_FILES['picture'], $application_id);
            // }

            // // Handle requirement files upload
            // if (isset($_FILES['files'])) {
            //     $this->handleRequirementFilesUpload($_FILES['files'], $application_id);
            // }

            // // Handle base64 files from JSON (if any)
            // if (isset($data['uploaded_files']) && is_array($data['uploaded_files'])) {
            //     $this->handleRequirementFilesFromJson($data['uploaded_files'], $application_id);
            // }

            // if (
            //     isset($data['picture_file']) &&
            //     is_array($data['picture_file']) &&
            //     !empty($data['picture_file']['base64_data'])
            // ) {
            //     $this->handleProfilePictureFromJson($data['picture_file'], $application_id);
            // }

            // $auditLogModel = new AuditLogModel();

            // if (
            //     !$auditLogModel->create([
            //         'user_id' => null,
            //         'actor' => "{$data['personal_information']['first_name']} {$data['personal_information']['last_name']}",
            //         'user_role' => 'applicant',
            //         'action' => Action::APPLICATION_SUBMITTED,
            //         'entity_type' => 'application',
            //         'entity_id' => $application_id,

            //         'description' =>
            //             $data['personal_information']['first_name'] .
            //             ' ' .
            //             $data['personal_information']['last_name'] .
            //             ' submitted application.',

            //         'old_values' => null,
            //         'new_values' => ['status' => 'submitted'],
            //         'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
            //         'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
            //     ])
            // ) {
            //     throw new \Exception('Failed to create audit log');
            // }

            $this->pdo->commit();

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Application created successfully',
                'application_id' => $application_id,
            ]);
        } catch (\Exception $e) {
            $this->pdo->rollBack();

            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function generateUniqueApplicationId($length = 7)
    {
        do {
            // Generate a random number (7-digit)
            $randomId = mt_rand(pow(10, $length - 1), pow(10, $length) - 1);

            // Check if it already exists
            $stmt = $this->pdo->prepare(
                'SELECT COUNT(*) FROM application_info WHERE application_id = :id',
            );
            $stmt->bindParam(':id', $randomId);
            $stmt->execute();

            $count = $stmt->fetchColumn();
        } while ($count > 0); // Retry if duplicate found

        return $randomId;
    }

    private function processApplicationData($data, $application_id)
    {
        // Process personal information
        $personal = new PersonalModel($this->pdo);
        if (!$personal->create($data['personal_information'], $application_id)) {
            throw new \Exception('Failed to save personal information');
        }

        // Process education information
        $education = new EducationModel($this->pdo);
        if (!$education->create($data['educational_background'], $application_id)) {
            throw new \Exception('Failed to save education information');
        }

        // Process family information
        $family = new FamilyModel($this->pdo);
        if (!$family->create($data['parents_guardian'], $application_id)) {
            throw new \Exception('Failed to save family information');
        }

        // Process contact person
        $contactPerson = new ContactPersonModel($this->pdo);
        if (isset($data['contact_person']) && !empty($data['contact_person'])) {
            if (!$contactPerson->create($data['contact_person'], $application_id)) {
                throw new \Exception('Failed to save contact person');
            }
        }

        // Process family members
        if (isset($data['family_members']) && is_array($data['family_members'])) {
            $familyMember = new FamilyMemberModel($this->pdo);
            foreach ($data['family_members'] as $member) {
                if (!$familyMember->create($member, $application_id)) {
                    throw new \Exception('Failed to save family member');
                }
            }
        }

        // Process tzu chi scholars
        if (isset($data['tzu_chi_siblings']) && is_array($data['tzu_chi_siblings'])) {
            $scholar = new ScholarModel($this->pdo);
            foreach ($data['tzu_chi_siblings'] as $scholarData) {
                if (!$scholar->create($scholarData, $application_id)) {
                    throw new \Exception('Failed to save scholar');
                }
            }
        }

        // Process assistance list
        if (isset($data['other_assistance']) && is_array($data['other_assistance'])) {
            $assistance = new AssistanceModel($this->pdo);
            foreach ($data['other_assistance'] as $assistanceData) {
                if (!$assistance->create($assistanceData, $application_id)) {
                    throw new \Exception('Failed to save assistance');
                }
            }
        }

        if (isset($data['character_reference']) && is_array($data['character_reference'])) {
            $character = new CharacterReferenceModel($this->pdo);
            foreach ($data['character_reference'] as $characterData) {
                if (!$character->create($characterData, $application_id)) {
                    throw new \Exception('Failed to save character');
                }
            }
        }
    }

    public function getProfilePicture($application_id)
    {
        try {
            $profilePictureModel = new ProfilePictureModel();
            $profile_url = $profilePictureModel->getFileUrlByApplicationId($application_id);

            if ($profile_url) {
                echo json_encode([
                    'success' => true,
                    'profile_picture_url' => $profile_url,
                ]);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function getUserProfilePicture($account_id)
    {
        try {
            $profilePictureModel = new ProfilePictureModel();
            $profile_url = $profilePictureModel->getFileUrlByAccountId($account_id);

            if ($profile_url) {
                echo json_encode([
                    'success' => true,
                    'profile_picture_url' => $profile_url,
                ]);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Fetches a file from a Supabase public URL and returns it as a base64 data URI.
     * Returns an array with 'success', and on success: 'base64Image' and 'mimeType'.
     */
    private function fetchFileAsBase64(string $path): array
    {
        $supabaseUrl = rtrim($_ENV['SUPABASE_URL'] ?? getenv('SUPABASE_URL'), '/');
        $serviceKey = $_ENV['SUPABASE_SERVICE_KEY'] ?? getenv('SUPABASE_SERVICE_KEY');
        $bucket = $_ENV['SUPABASE_BUCKET'] ?? getenv('SUPABASE_BUCKET') ?: 'scholarship-files';

        $path = trim($path, '/');
        $encodedPath = implode('/', array_map('rawurlencode', explode('/', $path)));
        $url = $supabaseUrl . '/storage/v1/object/' . $bucket . '/' . $encodedPath;

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $serviceKey,
                'apikey: ' . $serviceKey,
            ],
        ]);

        $imageData = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        $curlErrNo = curl_errno($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($imageData === false || $curlErrNo !== 0) {
            return [
                'success' => false,
                'message' => 'Supabase download connection failed: ' . $curlError,
            ];
        }

        if ($httpCode === 404) {
            return ['success' => false, 'message' => 'File not found in storage'];
        }

        if ($httpCode >= 300) {
            return [
                'success' => false,
                'message' =>
                    'Supabase download failed (HTTP ' .
                    $httpCode .
                    '): ' .
                    substr($imageData, 0, 300),
            ];
        }

        // Use content_type from Supabase response directly, fall back to detection
        $mimeType = $contentType ? explode(';', $contentType)[0] : null;

        if (!$mimeType && class_exists('finfo')) {
            $finfo = new \finfo(FILEINFO_MIME_TYPE);
            $mimeType = $finfo->buffer($imageData) ?: null;
        }

        if (!$mimeType) {
            $imageInfo = @getimagesizefromstring($imageData);
            if ($imageInfo !== false) {
                $mimeType = $imageInfo['mime'];
            }
        }

        if (!$mimeType) {
            $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
                'pdf' => 'application/pdf',
            ];
            $mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';
        }

        $base64Image = 'data:' . $mimeType . ';base64,' . base64_encode($imageData);

        return ['success' => true, 'base64Image' => $base64Image, 'mimeType' => $mimeType];
    }

    public function getProfilePicture64($application_id)
    {
        try {
            $profilePictureModel = new ProfilePictureModel();
            $profile_path = $profilePictureModel->getFilePathByApplicationId($application_id);

            if (!$profile_path) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Profile picture not found']);
                return;
            }

            $result = $this->fetchFileAsBase64($profile_path);

            if (!$result['success']) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => $result['message']]);
                return;
            }

            $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!in_array($result['mimeType'], $allowedMimes)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid image file type: ' . $result['mimeType'],
                ]);
                return;
            }

            echo json_encode([
                'success' => true,
                'profile_picture_base64' => $result['base64Image'],
                'base64' => $result['base64Image'],
                'mime_type' => $result['mimeType'],
            ]);
        } catch (\Exception $e) {
            error_log('Profile picture error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Internal server error: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Generic helper for all get*Files64 methods.
     * Fetches each URL from Supabase and returns the base64-encoded array.
     *
     * @param string   $notFoundMessage    404 message when model returns nothing
     * @param string   $responseKey        Key name in the JSON response (e.g. 'requirements')
     * @param string   $itemKey            Per-item key for the base64 value (e.g. 'requirement_base64')
     * @param callable $getUrls            Callable that returns the array of URLs
     */
    private function getFilesAs64(
        string $notFoundMessage,
        string $responseKey,
        string $itemKey,
        callable $getUrls,
    ) {
        try {
            $paths = $getUrls();

            if (!$paths) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => $notFoundMessage]);
                return;
            }

            $items = [];

            foreach ($paths as $index => $path) {
                try {
                    $result = $this->fetchFileAsBase64($path);

                    if (!$result['success']) {
                        $items[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => $result['message'],
                            'path' => $path,
                        ];
                        continue;
                    }

                    $items[] = [
                        'index' => $index,
                        'success' => true,
                        $itemKey => $result['base64Image'],
                        'base64' => $result['base64Image'],
                        'mime_type' => $result['mimeType'],
                        'path' => $path,
                    ];
                } catch (\Exception $fileException) {
                    error_log("Error processing file {$index}: " . $fileException->getMessage());
                    $items[] = [
                        'index' => $index,
                        'success' => false,
                        'message' => 'Error processing file: ' . $fileException->getMessage(),
                        'path' => $path,
                    ];
                }
            }

            echo json_encode([
                'success' => true,
                'total_files' => count($paths),
                $responseKey => $items,
            ]);
        } catch (\Exception $e) {
            error_log("{$responseKey} error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Internal server error: ' . $e->getMessage(),
            ]);
        }
    }

    public function getRequirements64($application_id)
    {
        $this->getFilesAs64(
            'Requirements not found',
            'requirements',
            'requirement_base64',
            fn() => (new RequirementsModel())->getFilePathByApplicationId($application_id),
        );
    }

    // public function getExaminationFiles64($application_id)
    // {
    //     $this->getFilesAs64(
    //         'Examination files not found',
    //         'examination_files',
    //         'examination_files_base64',
    //         fn() => (new ExaminationFilesModel())->getFilePathByApplicationId($application_id),
    //     );
    // }

    // public function getInitialInterviewFiles64($application_id)
    // {
    //     $this->getFilesAs64(
    //         'Initial interview files not found',
    //         'initial_interview_files',
    //         'initial_interview_files_base64',
    //         fn() => (new InitialInterviewFilesModel())->getFilePathByApplicationId($application_id),
    //     );
    // }

    // public function getHomeVisitationFiles64($application_id)
    // {
    //     $this->getFilesAs64(
    //         'Home visitation files not found',
    //         'home_visitation_files',
    //         'home_visitation_files_base64',
    //         fn() => (new HomeVisitationFilesModel())->getFilePathByApplicationId($application_id),
    //     );
    // }

    // public function getFinalInterviewFiles64($application_id)
    // {
    //     $this->getFilesAs64(
    //         'Final interview files not found',
    //         'final_interview_files',
    //         'final_interview_files_base64',
    //         fn() => (new FinalInterviewFilesModel())->getFilePathByApplicationId($application_id),
    //     );
    // }

    private function handleProfilePictureUpload($file, $application_id)
    {
        $error = $file['error'] ?? UPLOAD_ERR_OK;
        if ($error !== UPLOAD_ERR_OK) {
            throw new \Exception('Upload error for profile picture (code ' . $error . ')');
        }

        if (!is_uploaded_file($file['tmp_name'])) {
            throw new \Exception(
                'Invalid upload (possible attack or misconfigured form): ' . $file['name'],
            );
        }

        $custom_filename = null;
        if (isset($_POST['pictureInfo'])) {
            $pictureInfo = json_decode($_POST['pictureInfo'], true);
            $custom_filename = $pictureInfo['filename'] ?? null;
        }

        $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $uniqueFilename =
            $custom_filename ?:
            'profile_' . uniqid() . ($fileExtension ? '.' . $fileExtension : '');
        $folder = 'applications/' . $application_id . '/profile';

        $result = $this->storageService->upload($file['tmp_name'], $folder, $uniqueFilename);

        $profilePictureModel = new ProfilePictureModel();
        if (
            !$profilePictureModel->create(
                [
                    'file_name' => $file['name'],
                    'file_path' => $folder . '/' . $file['name'],
                    'file_type' => $file['type'],
                    'file_size' => $file['size'],
                ],
                $application_id,
            )
        ) {
            throw new \Exception('Failed to save profile picture info');
        }
    }

    private function handleRequirementFilesUpload($files, $application_id)
    {
        $requirementModel = new RequirementModel($this->pdo);
        $folder = 'applications/' . $application_id . '/files';

        if (isset($files['name']) && is_array($files['name'])) {
            $count = count($files['name']);
            for ($i = 0; $i < $count; $i++) {
                $error = $files['error'][$i] ?? UPLOAD_ERR_OK;
                if ($error !== UPLOAD_ERR_OK) {
                    throw new \Exception(
                        'Upload error for file: ' . $files['name'][$i] . ' (code ' . $error . ')',
                    );
                }

                if (!is_uploaded_file($files['tmp_name'][$i])) {
                    throw new \Exception(
                        'Invalid upload (possible attack or misconfigured form): ' .
                            $files['name'][$i],
                    );
                }

                $fileInfo = null;
                if (
                    isset($_POST['fileInfo']) &&
                    is_array($_POST['fileInfo']) &&
                    isset($_POST['fileInfo'][$i])
                ) {
                    $fileInfo = json_decode($_POST['fileInfo'][$i], true);
                }

                $category = $fileInfo['category'] ?? 'other';
                $customFilename = $fileInfo['filename'] ?? null;
                $fileExtension = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
                $uniqueFilename =
                    $customFilename ?: uniqid() . ($fileExtension ? '.' . $fileExtension : '');

                $result = $this->storageService->upload(
                    $files['tmp_name'][$i],
                    $folder,
                    $uniqueFilename,
                );

                if (
                    !$requirementModel->create(
                        [
                            'file_name' => $files['name'][$i],
                            'file_path' => $folder . '/' . $files['name'][$i],
                            'file_type' => $files['type'][$i],
                            'file_size' => $files['size'][$i],
                            'requirement_type' => 'general',
                            'requirement_category' => $category,
                        ],
                        $application_id,
                    )
                ) {
                    throw new \Exception(
                        'Failed to save requirement file info: ' . $files['name'][$i],
                    );
                }
            }
        }
    }

    private function handleRequirementFilesFromJson($uploaded_files, $application_id)
    {
        $requirementModel = new RequirementModel($this->pdo);
        $folder = 'applications/' . $application_id . '/files';

        foreach ($uploaded_files as $file) {
            if (!isset($file['base64_data'])) {
                throw new \Exception('Invalid file data - missing base64_data');
            }

            $filename = $file['filename'] ?? uniqid() . '.pdf';
            $category = $file['category'] ?? 'other';
            $fileContent = base64_decode($file['base64_data'], true);

            if ($fileContent === false) {
                throw new \Exception('Invalid base64 data for file: ' . $filename);
            }

            $tmpFile = tempnam(sys_get_temp_dir(), 'b64_');
            if ($tmpFile === false) {
                throw new \Exception('Could not create temp file for: ' . $filename);
            }

            if (file_put_contents($tmpFile, $fileContent) === false) {
                @unlink($tmpFile);
                throw new \Exception('Failed to write temp file for: ' . $filename);
            }

            try {
                $result = $this->storageService->upload($tmpFile, $folder, $filename);
                $mimeType = function_exists('mime_content_type')
                    ? (mime_content_type($tmpFile) ?:
                    'application/octet-stream')
                    : 'application/octet-stream';

                if (
                    !$requirementModel->create(
                        [
                            'file_name' => $filename,
                            'file_path' => $folder . '/' . $filename,
                            'file_type' => $mimeType,
                            'file_size' => strlen($fileContent),
                            'requirement_type' => 'general',
                            'requirement_category' => $category,
                        ],
                        $application_id,
                    )
                ) {
                    throw new \Exception('Failed to save requirement file info: ' . $filename);
                }
            } finally {
                @unlink($tmpFile);
            }
        }
    }

    private function handleProfilePictureFromJson($picture_file, $application_id)
    {
        if (!isset($picture_file['base64_data'])) {
            throw new \Exception('Invalid file data - missing base64_data');
        }

        $filename = $picture_file['filename'] ?? 'profile_' . uniqid() . '.jpg';
        $fileContent = base64_decode($picture_file['base64_data'], true);

        if ($fileContent === false) {
            throw new \Exception('Invalid base64 data for file: ' . $filename);
        }

        $tmpFile = tempnam(sys_get_temp_dir(), 'b64_');
        if ($tmpFile === false) {
            throw new \Exception('Could not create temp file for: ' . $filename);
        }

        if (file_put_contents($tmpFile, $fileContent) === false) {
            @unlink($tmpFile);
            throw new \Exception('Failed to write temp file for: ' . $filename);
        }

        $folder = 'applications/' . $application_id . '/profile';

        try {
            $result = $this->storageService->upload($tmpFile, $folder, $filename);
            $mimeType = function_exists('mime_content_type')
                ? (mime_content_type($tmpFile) ?:
                'image/jpeg')
                : 'image/jpeg';

            $profilePictureModel = new ProfilePictureModel();
            if (
                !$profilePictureModel->create(
                    [
                        'file_name' => $filename,
                        'file_path' => $folder . '/' . $filename,
                        'file_type' => $mimeType,
                        'file_size' => strlen($fileContent),
                    ],
                    $application_id,
                )
            ) {
                throw new \Exception('Failed to save profile picture info: ' . $filename);
            }
        } finally {
            @unlink($tmpFile);
        }
    }
}
?>
