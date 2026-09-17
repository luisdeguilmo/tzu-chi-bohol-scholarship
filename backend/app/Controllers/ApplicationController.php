<?php

namespace App\Controllers;

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Services/B2StorageService.php';
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
use App\Services\B2StorageService;

class ApplicationController
{
    /** MySQL/MariaDB error code for a unique-constraint violation. */
    private const ERR_DUPLICATE_ENTRY = 1062;

    private $pdo;
    private $storageService;

    /**
     * Paths of files that have already been written to B2 during the
     * current request. If the request fails after some uploads succeeded,
     * these are deleted so we don't leave orphaned files behind when the
     * DB transaction is rolled back. Cleared at the start of each request.
     */
    private $uploadedPaths = [];

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->storageService = new B2StorageService();
    }

    public function createApplication()
    {
        // Keep executing (commit/rollback + cleanup) even if the client's
        // connection drops mid-request, instead of PHP tearing the process
        // down mid-transaction and leaving orphaned B2 files / an
        // undetermined DB state. The client won't see the response either
        // way once it has disconnected, but the server ends up consistent.
        // ignore_user_abort(true);

        $this->uploadedPaths = [];

        // Held outside the try so the catch block can tell a duplicate on
        // *this* key apart from any other unique-constraint violation.
        $idempotencyKey = null;

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

            $idempotencyKey = $this->extractIdempotencyKey($data);

            // Fast path: the client is retrying a submission that already
            // went through. Return the original application instead of
            // creating a second one.
            if ($idempotencyKey !== null) {
                $existing = $this->findApplicationIdByKey($idempotencyKey);

                if ($existing) {
                    // Nothing has been written yet; just close the transaction.
                    if ($this->pdo->inTransaction()) {
                        $this->pdo->rollBack();
                    }

                    $this->respondAlreadySubmitted($existing);
                    return;
                }
            }

            $is_existing_scholar = $data['application_info']['is_existing_scholar'];

            // Process application data
            $application = new ApplicationModel();

            $application_id = null;

            if ($is_existing_scholar) {
                $application_id = $application->createExistingScholar(
                    $data,
                    $data['other_information'],
                );
            } else {
                $application_id = $application->create(
                    $data['application_info'],
                    $data['other_information'],
                    $idempotencyKey
                );
            }

            if ($idempotencyKey !== null) {
                $this->persistIdempotencyKey($application_id, $idempotencyKey);
            }

            error_log('Application ID: ' . $application_id);

            if (!$application_id) {
                throw new \Exception('Failed to create application');
            }

            // Stamp the key onto the freshly created row, inside the same
            // transaction. If a concurrent request with the same key got
            // there first, this UPDATE fails with a duplicate-entry error
            // and is handled in the catch block below.

            // Process other data (personal, education, family, etc.)
            $this->processApplicationData($data, $application_id);

            // Handle profile picture upload
            if (isset($_FILES['picture'])) {
                $this->handleProfilePictureUpload($_FILES['picture'], $application_id);
            }

            // Handle requirement files upload
            if (isset($_FILES['files'])) {
                $this->handleRequirementFilesUpload($_FILES['files'], $application_id);
            }

            // Handle base64 files from JSON (if any)
            if (isset($data['uploaded_files']) && is_array($data['uploaded_files'])) {
                $this->handleRequirementFilesFromJson($data['uploaded_files'], $application_id);
            }

            if (
                isset($data['picture_file']) &&
                is_array($data['picture_file']) &&
                !empty($data['picture_file']['base64_data'])
            ) {
                $this->handleProfilePictureFromJson($data['picture_file'], $application_id);
            }

            $auditLogModel = new AuditLogModel();

            if (
                !$auditLogModel->create([
                    'user_id' => null,
                    'actor' => "{$data['personal_information']['first_name']} {$data['personal_information']['last_name']}",
                    'user_role' => 'applicant',
                    'action' => Action::APPLICATION_SUBMITTED,
                    'entity_type' => 'application',
                    'entity_id' => $application_id,

                    'description' =>
                        $data['personal_information']['first_name'] .
                        ' ' .
                        $data['personal_information']['last_name'] .
                        ' submitted application.',

                    'old_values' => null,
                    'new_values' => ['status' => 'submitted'],
                    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                ])
            ) {
                throw new \Exception('Failed to create audit log');
            }

            $this->pdo->commit();

            // Everything committed successfully — nothing to clean up.
            $this->uploadedPaths = [];

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Application created successfully...',
                'application_id' => $application_id,
                'duplicate' => false,
            ]);
        } catch (\Throwable $e) {
            // \Throwable (not just \Exception) so that fatal-ish errors
            // thrown by lower-level HTTP/network clients (e.g. a \Error
            // from the B2 SDK when connectivity drops) are also caught,
            // instead of killing the script before rollback/cleanup runs.
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            // The DB is rolled back automatically, but B2 uploads are a
            // separate system and are NOT part of that transaction. Any
            // file already written to B2 in this request is now orphaned
            // (no DB row references it) unless we explicitly remove it.
            $this->cleanupUploadedFiles();

            // A duplicate-entry error is NOT by itself proof that this was
            // a retry — error 1062 also fires for an application_id
            // collision or any other unique index touched during the
            // transaction, and reporting those as "already submitted"
            // would silently discard a real application. So re-query by
            // key after the rollback: only if a row with this exact key is
            // committed do we know another request won the race.
            if ($idempotencyKey !== null && $this->isDuplicateKeyError($e)) {
                $existing = $this->findApplicationIdByKey($idempotencyKey);

                if ($existing) {
                    error_log(
                        'createApplication: concurrent duplicate for idempotency key; ' .
                            'returning existing application ' .
                            $existing,
                    );

                    $this->respondAlreadySubmitted($existing);
                    return;
                }
            }

            // Log full detail server-side; never echo internal exception
            // messages (SQL errors, B2/network error strings, file paths)
            // back to the client.
            error_log('createApplication failed: ' . $e->getMessage());

            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' =>
                    'We were unable to submit your application. Please check your ' .
                    'connection and try again.',
            ]);
        }
    }

    /**
     * Pulls the client-generated idempotency key off the payload and
     * validates its shape. Accepts it at the top level or nested under
     * application_info, depending on how the client sends it.
     *
     * Anything that isn't a well-formed UUID is treated as absent rather
     * than as an error: a malformed key from an old client build should
     * still be able to submit, just without duplicate protection.
     */
    private function extractIdempotencyKey(array $data): ?string
    {
        $key = $data['idempotency_key'] ?? ($data['application_info']['idempotency_key'] ?? null);

        if (!is_string($key)) {
            return null;
        }

        $key = trim($key);

        if (
            !preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $key)
        ) {
            if ($key !== '') {
                error_log('Ignoring malformed idempotency key from client.');
            }
            return null;
        }

        return strtolower($key);
    }

    /**
     * Returns the application_id previously stored against this key, or
     * null if this key has never been committed.
     */
    private function findApplicationIdByKey(string $idempotencyKey)
    {
        try {
            $stmt = $this->pdo->prepare(
                'SELECT application_id FROM application_info
                 WHERE idempotency_key = :key
                 LIMIT 1',
            );
            $stmt->execute([':key' => $idempotencyKey]);

            $existing = $stmt->fetchColumn();

            return $existing === false ? null : $existing;
        } catch (\Throwable $e) {
            // A lookup failure must not break submission — worst case we
            // lose duplicate protection for this request.
            error_log('Idempotency lookup failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Writes the key onto the application row inside the open transaction.
     * Deliberately NOT wrapped in try/catch: a duplicate-entry error here
     * is the race-detection signal and must propagate to the caller.
     */
    private function persistIdempotencyKey($application_id, string $idempotencyKey): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE application_info
             SET idempotency_key = :key
             WHERE application_id = :id',
        );

        $stmt->execute([':key' => $idempotencyKey, ':id' => $application_id]);
    }

    /**
     * 201, not 200 — the client checks the status code to decide between a
     * success toast and a retry prompt, and a retry that lands here is a
     * success from the user's point of view. `duplicate` lets the client
     * distinguish the two if it ever wants to.
     */
    private function respondAlreadySubmitted($application_id): void
    {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Application already submitted.',
            'application_id' => $application_id,
            'duplicate' => true,
        ]);
    }

    private function isDuplicateKeyError(\Throwable $e): bool
    {
        if ($e instanceof \PDOException) {
            // MySQL/MariaDB duplicate-entry error code.
            return ($e->errorInfo[1] ?? null) === self::ERR_DUPLICATE_ENTRY;
        }

        return false;
    }

    /**
     * Best-effort deletion of any files uploaded to B2 during a request
     * that ultimately failed, so a network drop or later error doesn't
     * leave storage and the database out of sync. Deletion failures are
     * logged but never allowed to mask the original error or crash the
     * error-handling path itself.
     */
    private function cleanupUploadedFiles()
    {
        foreach ($this->uploadedPaths as $path) {
            try {
                // No method_exists() guard: B2StorageService::delete() now
                // exists for real (see B2StorageService.php). Guarding it
                // was exactly what let cleanup silently no-op for as long
                // as the method was missing — better to let a genuine
                // absence throw here and get logged below.
                $this->storageService->delete($path);
            } catch (\Throwable $cleanupError) {
                error_log(
                    "Failed to clean up orphaned B2 file '{$path}': " . $cleanupError->getMessage(),
                );
            }
        }

        $this->uploadedPaths = [];
    }

    /**
     * Wraps storageService->upload() so every successful upload is tracked
     * for cleanup, and a failed/incomplete upload is treated as an error
     * instead of silently proceeding (the original code never checked the
     * return value of upload()).
     */
    private function uploadAndTrack($tmpPath, $folder, $filename)
    {
        $result = $this->storageService->upload($tmpPath, $folder, $filename);

        if (!$result) {
            throw new \Exception("Upload to storage failed for '{$filename}'");
        }

        $this->uploadedPaths[] = $folder . '/' . $filename;

        return $result;
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
        } catch (\Throwable $e) {
            error_log('getProfilePicture failed: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Unable to retrieve profile picture.',
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
        } catch (\Throwable $e) {
            error_log('getUserProfilePicture failed: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Unable to retrieve profile picture.',
            ]);
        }
    }

    /**
     * Fetches a file from Backblaze B2 and returns it as a base64 data URI.
     * Returns an array with 'success', and on success: 'base64Image' and 'mimeType'.
     */
    private function fetchFileAsBase64(string $path): array
    {
        try {
            $downloaded = $this->storageService->download($path);
        } catch (\Throwable $e) {
            error_log("B2 download failed for '{$path}': " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'File could not be retrieved from storage',
            ];
        }

        if (!$downloaded) {
            return ['success' => false, 'message' => 'File not found in storage'];
        }

        $imageData = $downloaded['content'];

        // Use content_type from B2's response directly, fall back to detection
        $mimeType = $downloaded['content_type']
            ? explode(';', $downloaded['content_type'])[0]
            : null;

        if ((!$mimeType || $mimeType === 'application/octet-stream') && class_exists('finfo')) {
            $finfo = new \finfo(FILEINFO_MIME_TYPE);
            $detected = $finfo->buffer($imageData) ?: null;
            if ($detected) {
                $mimeType = $detected;
            }
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
        } catch (\Throwable $e) {
            error_log('Profile picture error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Internal server error while retrieving profile picture.',
            ]);
        }
    }

    /**
     * Generic helper for all get*Files64 methods.
     * Fetches each path from B2 and returns the base64-encoded array.
     *
     * @param string   $notFoundMessage    404 message when model returns nothing
     * @param string   $responseKey        Key name in the JSON response (e.g. 'requirements')
     * @param string   $itemKey            Per-item key for the base64 value (e.g. 'requirement_base64')
     * @param callable $getUrls            Callable that returns the array of paths
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
                } catch (\Throwable $fileException) {
                    error_log("Error processing file {$index}: " . $fileException->getMessage());
                    $items[] = [
                        'index' => $index,
                        'success' => false,
                        'message' => 'Error processing this file.',
                        'path' => $path,
                    ];
                }
            }

            echo json_encode([
                'success' => true,
                'total_files' => count($paths),
                $responseKey => $items,
            ]);
        } catch (\Throwable $e) {
            error_log("{$responseKey} error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Internal server error while retrieving files.',
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

        // Tracked so this file is removed from B2 if anything later in the
        // request fails and the DB transaction is rolled back.
        $this->uploadAndTrack($file['tmp_name'], $folder, $uniqueFilename);

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

                // Tracked for cleanup on failure (see uploadAndTrack()).
                $this->uploadAndTrack($files['tmp_name'][$i], $folder, $uniqueFilename);

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
                // Tracked for cleanup on failure (see uploadAndTrack()).
                $this->uploadAndTrack($tmpFile, $folder, $filename);

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
            // Tracked for cleanup on failure (see uploadAndTrack()).
            $this->uploadAndTrack($tmpFile, $folder, $filename);

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
