<?php

namespace App\Controllers;

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../models/ApplicationModel.php';
require_once __DIR__ . '/../models/PersonalModel.php';
require_once __DIR__ . '/../models/EducationModel.php';
require_once __DIR__ . '/../models/FamilyModel.php';
require_once __DIR__ . '/../models/ContactPersonModel.php';
require_once __DIR__ . '/../models/FamilyMemberModel.php';
require_once __DIR__ . '/../models/ScholarModel.php';
require_once __DIR__ . '/../models/AssistanceModel.php';
require_once __DIR__ . '/../models/CharacterReferenceModel.php';
require_once __DIR__ . '/../models/ExaminationFilesModel.php';
require_once __DIR__ . '/../models/RequirementModel.php';
require_once __DIR__ . '/../models/ProfilePictureModel.php';
require_once __DIR__ . '/../models/RequirementsModel.php';

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

use Config\Database;
use App\Models\ApplicationModel;
use App\Models\PersonalModel;
use App\Models\EducationModel;
use App\Models\FamilyModel;
use App\Models\ContactPersonModel;
use App\Models\FamilyMemberModel;
use App\Models\ScholarModel;
use App\Models\AssistanceModel;
use App\Models\CharacterReferenceModel;
use App\Models\ExaminationFilesModel;
use App\Models\FinalInterviewFilesModel;
use App\Models\HomeVisitationFilesModel;
use App\Models\InitialInterviewFilesModel;
use App\Models\RequirementModel;
use App\Models\ProfilePictureModel; // Add this new model
use App\Models\RequirementsModel;

class ApplicationController
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
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

            // Process application data
            $application = new ApplicationModel();
            $application_id = $application->create(
                $data['application_info'],
                $data['other_information'],
            );

            if (!$application_id) {
                throw new \Exception('Failed to create application');
            }

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

            if (isset($data['picture_file']) && $data['picture_file']) {
                $this->handleProfilePictureFromJson($data['picture_file'], $application_id);
            }

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

            // else {
            //     http_response_code(404);
            //     echo json_encode([
            //         'success' => false,
            //         'message' => 'Profile picture not found',
            //     ]);
            // }
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

            // else {
            //     http_response_code(404);
            //     echo json_encode([
            //         'success' => false,
            //         'message' => 'Profile picture not found',
            //     ]);
            // }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function getProfilePicture64($application_id)
    {
        try {
            $profilePictureModel = new ProfilePictureModel();
            $profile_url = $profilePictureModel->getFileUrlByApplicationId($application_id);

            if (!$profile_url) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Profile picture not found',
                ]);
                return;
            }

            // Convert URL to file path
            $parsedUrl = parse_url($profile_url);
            $filePath = $_SERVER['DOCUMENT_ROOT'] . $parsedUrl['path'];

            // Validate file exists and is readable
            if (!file_exists($filePath) || !is_readable($filePath)) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Profile picture file not accessible',
                ]);
                return;
            }

            // Read file and convert to base64
            $imageData = file_get_contents($filePath);
            if ($imageData === false) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to read profile picture file',
                ]);
                return;
            }

            // Get MIME type - using multiple methods for compatibility
            $mimeType = null;

            // Method 1: Try finfo if available
            if (class_exists('finfo')) {
                $finfo = new \finfo(FILEINFO_MIME_TYPE);
                $mimeType = $finfo->buffer($imageData);
            }

            // Method 2: Fallback to getimagesizefromstring
            if (!$mimeType) {
                $imageInfo = getimagesizefromstring($imageData);
                if ($imageInfo !== false) {
                    $mimeType = $imageInfo['mime'];
                }
            }

            // Method 3: Fallback to file extension
            if (!$mimeType) {
                $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
                $mimeTypes = [
                    'jpg' => 'image/jpeg',
                    'jpeg' => 'image/jpeg',
                    'png' => 'image/png',
                    'gif' => 'image/gif',
                    'webp' => 'image/webp',
                ];
                $mimeType = $mimeTypes[$extension] ?? 'image/jpeg'; // Default to jpeg
            }

            // Validate it's an image
            if (!in_array($mimeType, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid image file type: ' . $mimeType,
                ]);
                return;
            }

            // Convert to base64
            $base64 = base64_encode($imageData);
            $base64Image = 'data:' . $mimeType . ';base64,' . $base64;

            echo json_encode([
                'success' => true,
                'profile_picture_base64' => $base64Image,
                'base64' => $base64Image, // Alternative key for compatibility
                'mime_type' => $mimeType,
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

    public function getRequirements64($application_id)
    {
        try {
            $requirementsModel = new RequirementsModel(); // Adjust class name as needed
            $requirements_urls = $requirementsModel->getFileUrlByApplicationId($application_id);

            if (!$requirements_urls) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Requirements not found',
                ]);
                return;
            }

            $requirements_base64 = [];
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
            ];

            // Process each URL in the array
            foreach ($requirements_urls as $index => $requirement_url) {
                try {
                    // Convert URL to file path
                    $parsedUrl = parse_url($requirement_url);
                    $filePath = $_SERVER['DOCUMENT_ROOT'] . $parsedUrl['path'];

                    // Validate file exists and is readable
                    if (!file_exists($filePath) || !is_readable($filePath)) {
                        $requirements_base64[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => 'Requirement file not accessible',
                            'url' => $requirement_url,
                        ];
                        continue;
                    }

                    // Read file and convert to base64
                    $imageData = file_get_contents($filePath);
                    if ($imageData === false) {
                        $requirements_base64[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => 'Failed to read requirement file',
                            'url' => $requirement_url,
                        ];
                        continue;
                    }

                    // Get MIME type from file extension
                    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
                    $mimeType = $mimeTypes[$extension] ?? null;

                    // Validate it's a supported image type
                    if (!$mimeType) {
                        $requirements_base64[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => 'Unsupported file type: ' . $extension,
                            'url' => $requirement_url,
                        ];
                        continue;
                    }

                    // Convert to base64
                    $base64 = base64_encode($imageData);
                    $base64Image = 'data:' . $mimeType . ';base64,' . $base64;

                    $requirements_base64[] = [
                        'index' => $index,
                        'success' => true,
                        'requirement_base64' => $base64Image,
                        'base64' => $base64Image, // Alternative key for compatibility
                        'mime_type' => $mimeType,
                        'url' => $requirement_url,
                    ];
                } catch (\Exception $fileException) {
                    error_log(
                        "Error processing requirement file {$index}: " .
                            $fileException->getMessage(),
                    );
                    $requirements_base64[] = [
                        'index' => $index,
                        'success' => false,
                        'message' => 'Error processing file: ' . $fileException->getMessage(),
                        'url' => $requirement_url,
                    ];
                }
            }

            // Check if any files were successfully processed
            // $successfulFiles = array_filter($requirements_base64, function($item) {
            //     return $item['success'] === true;
            // });

            echo json_encode([
                'success' => true,
                'total_files' => count($requirements_urls),
                // "successful_files" => count($successfulFiles),
                'requirements' => $requirements_base64,
            ]);
        } catch (\Exception $e) {
            error_log('Requirements error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Internal server error: ' . $e->getMessage(),
            ]);
        }
    }

    public function getExaminationFiles64($application_id)
    {
        try {
            $examinationFilesModel = new ExaminationFilesModel(); // Adjust class name as needed
            $examination_files_urls = $examinationFilesModel->getFileUrlByApplicationId(
                $application_id,
            );

            if (!$examination_files_urls) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Examination files not found',
                ]);
                return;
            }

            $examination_files_base64 = [];
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
            ];

            // Process each URL in the array
            foreach ($examination_files_urls as $index => $examination_files_url) {
                try {
                    // Convert URL to file path
                    $parsedUrl = parse_url($examination_files_url);
                    $filePath = $_SERVER['DOCUMENT_ROOT'] . $parsedUrl['path'];

                    // Validate file exists and is readable
                    if (!file_exists($filePath) || !is_readable($filePath)) {
                        $examination_files_base64[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => 'Examination file not accessible',
                            'url' => $examination_files_url,
                        ];
                        continue;
                    }

                    // Read file and convert to base64
                    $imageData = file_get_contents($filePath);
                    if ($imageData === false) {
                        $examination_files_base64[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => 'Failed to read examination file',
                            'url' => $examination_files_url,
                        ];
                        continue;
                    }

                    // Get MIME type from file extension
                    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
                    $mimeType = $mimeTypes[$extension] ?? null;

                    // Validate it's a supported image type
                    if (!$mimeType) {
                        $examination_files_base64[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => 'Unsupported file type: ' . $extension,
                            'url' => $examination_files_url,
                        ];
                        continue;
                    }

                    // Convert to base64
                    $base64 = base64_encode($imageData);
                    $base64Image = 'data:' . $mimeType . ';base64,' . $base64;

                    $examination_files_base64[] = [
                        'index' => $index,
                        'success' => true,
                        'examination_files_base64' => $base64Image,
                        'base64' => $base64Image, // Alternative key for compatibility
                        'mime_type' => $mimeType,
                        'url' => $examination_files_url,
                    ];
                } catch (\Exception $fileException) {
                    error_log(
                        "Error processing requirement file {$index}: " .
                            $fileException->getMessage(),
                    );
                    $examination_files_base64[] = [
                        'index' => $index,
                        'success' => false,
                        'message' => 'Error processing file: ' . $fileException->getMessage(),
                        'url' => $examination_files_url,
                    ];
                }
            }

            // Check if any files were successfully processed
            // $successfulFiles = array_filter($requirements_base64, function($item) {
            //     return $item['success'] === true;
            // });

            echo json_encode([
                'success' => true,
                'total_files' => count($examination_files_urls),
                // "successful_files" => count($successfulFiles),
                'examination_files' => $examination_files_base64,
            ]);
        } catch (\Exception $e) {
            error_log('Examination files error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Internal server error: ' . $e->getMessage(),
            ]);
        }
    }

    public function getInitialInterviewFiles64($application_id)
    {
        try {
            $initialInterviewFilesModel = new InitialInterviewFilesModel(); // Adjust class name as needed
            $initial_interview_files_urls = $initialInterviewFilesModel->getFileUrlByApplicationId(
                $application_id,
            );

            if (!$initial_interview_files_urls) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Initial interview files not found',
                ]);
                return;
            }

            $initial_interview_files_base64 = [];
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
            ];

            // Process each URL in the array
            foreach ($initial_interview_files_urls as $index => $initial_interview_files_url) {
                try {
                    // Convert URL to file path
                    $parsedUrl = parse_url($initial_interview_files_url);
                    $filePath = $_SERVER['DOCUMENT_ROOT'] . $parsedUrl['path'];

                    // Validate file exists and is readable
                    if (!file_exists($filePath) || !is_readable($filePath)) {
                        $initial_interview_files_base64[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => 'Initial interview file not accessible',
                            'url' => $initial_interview_files_url,
                        ];
                        continue;
                    }

                    // Read file and convert to base64
                    $imageData = file_get_contents($filePath);
                    if ($imageData === false) {
                        $initial_interview_files_base64[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => 'Failed to read examination file',
                            'url' => $initial_interview_files_url,
                        ];
                        continue;
                    }

                    // Get MIME type from file extension
                    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
                    $mimeType = $mimeTypes[$extension] ?? null;

                    // Validate it's a supported image type
                    if (!$mimeType) {
                        $initial_interview_files_base64[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => 'Unsupported file type: ' . $extension,
                            'url' => $initial_interview_files_url,
                        ];
                        continue;
                    }

                    // Convert to base64
                    $base64 = base64_encode($imageData);
                    $base64Image = 'data:' . $mimeType . ';base64,' . $base64;

                    $initial_interview_files_base64[] = [
                        'index' => $index,
                        'success' => true,
                        'initial_interview_files_base64' => $base64Image,
                        'base64' => $base64Image, // Alternative key for compatibility
                        'mime_type' => $mimeType,
                        'url' => $initial_interview_files_url,
                    ];
                } catch (\Exception $fileException) {
                    error_log(
                        "Error processing requirement file {$index}: " .
                            $fileException->getMessage(),
                    );
                    $initial_interview_files_base64[] = [
                        'index' => $index,
                        'success' => false,
                        'message' => 'Error processing file: ' . $fileException->getMessage(),
                        'url' => $initial_interview_files_url,
                    ];
                }
            }

            // Check if any files were successfully processed
            // $successfulFiles = array_filter($requirements_base64, function($item) {
            //     return $item['success'] === true;
            // });

            echo json_encode([
                'success' => true,
                'total_files' => count($initial_interview_files_urls),
                // "successful_files" => count($successfulFiles),
                'initial_interview_files' => $initial_interview_files_base64,
            ]);
        } catch (\Exception $e) {
            error_log('Initial interview files error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Internal server error: ' . $e->getMessage(),
            ]);
        }
    }

    public function getHomeVisitationFiles64($application_id)
    {
        try {
            $homeVisitationFilesModel = new HomeVisitationFilesModel(); // Adjust class name as needed
            $home_visitation_files_urls = $homeVisitationFilesModel->getFileUrlByApplicationId(
                $application_id,
            );

            if (!$home_visitation_files_urls) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Home visitation files not found',
                ]);
                return;
            }

            $home_visitation_files_base64 = [];
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
            ];

            foreach ($home_visitation_files_urls as $index => $home_visitation_files_url) {
                try {
                    $parsedUrl = parse_url($home_visitation_files_url);
                    $filePath = $_SERVER['DOCUMENT_ROOT'] . $parsedUrl['path'];

                    if (!file_exists($filePath) || !is_readable($filePath)) {
                        $home_visitation_files_base64[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => 'Home visitation file not accessible',
                            'url' => $home_visitation_files_url,
                        ];
                        continue;
                    }

                    $imageData = file_get_contents($filePath);
                    if ($imageData === false) {
                        $home_visitation_files_base64[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => 'Failed to read home visitation file',
                            'url' => $home_visitation_files_url,
                        ];
                        continue;
                    }

                    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
                    $mimeType = $mimeTypes[$extension] ?? null;

                    if (!$mimeType) {
                        $home_visitation_files_base64[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => 'Unsupported file type: ' . $extension,
                            'url' => $home_visitation_files_url,
                        ];
                        continue;
                    }

                    $base64 = base64_encode($imageData);
                    $base64Image = 'data:' . $mimeType . ';base64,' . $base64;

                    $home_visitation_files_base64[] = [
                        'index' => $index,
                        'success' => true,
                        'home_visitation_files_base64' => $base64Image,
                        'base64' => $base64Image,
                        'mime_type' => $mimeType,
                        'url' => $home_visitation_files_url,
                    ];
                } catch (\Exception $fileException) {
                    error_log(
                        "Error processing home visitation file {$index}: " .
                            $fileException->getMessage(),
                    );
                    $home_visitation_files_base64[] = [
                        'index' => $index,
                        'success' => false,
                        'message' => 'Error processing file: ' . $fileException->getMessage(),
                        'url' => $home_visitation_files_url,
                    ];
                }
            }

            echo json_encode([
                'success' => true,
                'total_files' => count($home_visitation_files_urls),
                'home_visitation_files' => $home_visitation_files_base64,
            ]);
        } catch (\Exception $e) {
            error_log('Home visitation files error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Internal server error: ' . $e->getMessage(),
            ]);
        }
    }

    public function getFinalInterviewFiles64($application_id)
    {
        try {
            $finalInterviewFilesModel = new FinalInterviewFilesModel(); // Adjust class name as needed
            $final_interview_files_urls = $finalInterviewFilesModel->getFileUrlByApplicationId(
                $application_id,
            );

            if (!$final_interview_files_urls) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Final interview files not found',
                ]);
                return;
            }

            $final_interview_files_base64 = [];
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
            ];

            // Process each URL in the array
            foreach ($final_interview_files_urls as $index => $final_interview_files_url) {
                try {
                    // Convert URL to file path
                    $parsedUrl = parse_url($final_interview_files_url);
                    $filePath = $_SERVER['DOCUMENT_ROOT'] . $parsedUrl['path'];

                    // Validate file exists and is readable
                    if (!file_exists($filePath) || !is_readable($filePath)) {
                        $final_interview_files_base64[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => 'Final interview file not accessible',
                            'url' => $final_interview_files_url,
                        ];
                        continue;
                    }

                    // Read file and convert to base64
                    $imageData = file_get_contents($filePath);
                    if ($imageData === false) {
                        $final_interview_files_base64[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => 'Failed to read final interview file',
                            'url' => $final_interview_files_url,
                        ];
                        continue;
                    }

                    // Get MIME type from file extension
                    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
                    $mimeType = $mimeTypes[$extension] ?? null;

                    // Validate it's a supported image type
                    if (!$mimeType) {
                        $final_interview_files_base64[] = [
                            'index' => $index,
                            'success' => false,
                            'message' => 'Unsupported file type: ' . $extension,
                            'url' => $final_interview_files_url,
                        ];
                        continue;
                    }

                    // Convert to base64
                    $base64 = base64_encode($imageData);
                    $base64Image = 'data:' . $mimeType . ';base64,' . $base64;

                    $final_interview_files_base64[] = [
                        'index' => $index,
                        'success' => true,
                        'final_interview_files_base64' => $base64Image,
                        'base64' => $base64Image,
                        'mime_type' => $mimeType,
                        'url' => $final_interview_files_url,
                    ];
                } catch (\Exception $fileException) {
                    error_log(
                        "Error processing final interview file {$index}: " .
                            $fileException->getMessage(),
                    );
                    $final_interview_files_base64[] = [
                        'index' => $index,
                        'success' => false,
                        'message' => 'Error processing file: ' . $fileException->getMessage(),
                        'url' => $final_interview_files_url,
                    ];
                }
            }

            // Output JSON response
            echo json_encode([
                'success' => true,
                'total_files' => count($final_interview_files_urls),
                'final_interview_files' => $final_interview_files_base64,
            ]);
        } catch (\Exception $e) {
            error_log('Final interview files error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Internal server error: ' . $e->getMessage(),
            ]);
        }
    }

    private function handleProfilePictureUpload($file, $application_id)
    {
        $base_upload_dir = __DIR__ . '/../../public/upload/';
        $upload_dir = $base_upload_dir . 'applications/' . $application_id . '/profile/';

        // Create directories if they don't exist
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $filename = $file['name'];
        $tmp_name = $file['tmp_name'];
        $filetype = $file['type'];
        $filesize = $file['size'];

        // Get custom filename if provided
        $custom_filename = null;
        if (isset($_POST['pictureInfo'])) {
            $pictureInfo = json_decode($_POST['pictureInfo'], true);
            $custom_filename = $pictureInfo['filename'] ?? null;
        }

        $file_extension = pathinfo($filename, PATHINFO_EXTENSION);
        $unique_filename = $custom_filename ?: 'profile_' . uniqid() . '.' . $file_extension;
        $target_file = $upload_dir . $unique_filename;

        if (move_uploaded_file($tmp_name, $target_file)) {
            $db_file_path =
                '/upload/applications/' . $application_id . '/profile/' . $unique_filename;

            $profilePictureModel = new ProfilePictureModel();
            $file_data = [
                'file_name' => $filename,
                'file_path' => $db_file_path,
                'file_type' => $filetype,
                'file_size' => $filesize,
            ];

            if (!$profilePictureModel->create($file_data, $application_id)) {
                throw new \Exception('Failed to save profile picture info');
            }
        } else {
            throw new \Exception('Failed to upload profile picture boi');
        }
    }

    // private function handleProfilePictureUpload($file, $application_id)
    // {
    //     // Check for upload errors first
    //     if ($file['error'] !== UPLOAD_ERR_OK) {
    //         switch ($file['error']) {
    //             case UPLOAD_ERR_INI_SIZE:
    //             case UPLOAD_ERR_FORM_SIZE:
    //                 throw new \Exception('File size exceeds the maximum allowed (5MB)');
    //             case UPLOAD_ERR_PARTIAL:
    //                 throw new \Exception('File was only partially uploaded');
    //             case UPLOAD_ERR_NO_FILE:
    //                 throw new \Exception('No file was uploaded');
    //             default:
    //                 throw new \Exception('Upload error occurred');
    //         }
    //     }

    //     $filesize = $file['size'];
    //     $max_size = 5 * 1024 * 1024; // 5MB in bytes

    //     // Validate file size
    //     if ($filesize > $max_size) {
    //         throw new \Exception('File size must not exceed 5MB');
    //     }

    //     $base_upload_dir = __DIR__ . '/../../public/upload/';
    //     $upload_dir = $base_upload_dir . 'applications/' . $application_id . '/profile/';

    //     // Create directories if they don't exist
    //     if (!is_dir($upload_dir)) {
    //         mkdir($upload_dir, 0777, true);
    //     }

    //     $filename = $file['name'];
    //     $tmp_name = $file['tmp_name'];
    //     $filetype = $file['type'];

    //     // Get custom filename if provided
    //     $custom_filename = null;
    //     if (isset($_POST['pictureInfo'])) {
    //         $pictureInfo = json_decode($_POST['pictureInfo'], true);
    //         $custom_filename = $pictureInfo['filename'] ?? null;
    //     }

    //     $file_extension = pathinfo($filename, PATHINFO_EXTENSION);
    //     $unique_filename = $custom_filename ?: 'profile_' . uniqid() . '.' . $file_extension;
    //     $target_file = $upload_dir . $unique_filename;

    //     if (move_uploaded_file($tmp_name, $target_file)) {
    //         $db_file_path =
    //             '/upload/applications/' . $application_id . '/profile/' . $unique_filename;
    //         $profilePictureModel = new ProfilePictureModel();

    //         $file_data = [
    //             'file_name' => $filename,
    //             'file_path' => $db_file_path,
    //             'file_type' => $filetype,
    //             'file_size' => $filesize,
    //         ];

    //         if (!$profilePictureModel->create($file_data, $application_id)) {
    //             throw new \Exception('Failed to save profile picture info');
    //         }
    //     } else {
    //         throw new \Exception('Failed to upload profile picture');
    //     }
    // }

    private function handleRequirementFilesUpload($files, $application_id)
    {
        $base_upload_dir = __DIR__ . '/../../public/upload/';
        $upload_dir = $base_upload_dir . 'applications/' . $application_id . '/requirements/';

        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $requirementModel = new RequirementModel($this->pdo);

        // Handle array of files
        if (isset($files['name']) && is_array($files['name'])) {
            $count = count($files['name']);
            for ($i = 0; $i < $count; $i++) {
                $filename = $files['name'][$i];
                $tmp_name = $files['tmp_name'][$i];
                $filetype = $files['type'][$i];
                $filesize = $files['size'][$i];

                // Get additional file info if available
                $fileInfo = null;
                if (
                    isset($_POST['fileInfo']) &&
                    is_array($_POST['fileInfo']) &&
                    isset($_POST['fileInfo'][$i])
                ) {
                    $fileInfo = json_decode($_POST['fileInfo'][$i], true);
                }

                $custom_filename =
                    $fileInfo && isset($fileInfo['filename']) ? $fileInfo['filename'] : null;
                $requirement_category =
                    $fileInfo && isset($fileInfo['category']) ? $fileInfo['category'] : 'other';

                $file_extension = pathinfo($filename, PATHINFO_EXTENSION);
                $unique_filename = $custom_filename ?: uniqid() . '.' . $file_extension;
                $target_file = $upload_dir . $unique_filename;

                if (move_uploaded_file($tmp_name, $target_file)) {
                    $db_file_path =
                        '/upload/applications/' .
                        $application_id .
                        '/requirements/' .
                        $unique_filename;

                    $file_data = [
                        'file_name' => $filename,
                        'file_path' => $db_file_path,
                        'file_type' => $filetype,
                        'file_size' => $filesize,
                        'requirement_type' => 'general',
                        'requirement_category' => $requirement_category,
                    ];

                    if (!$requirementModel->create($file_data, $application_id)) {
                        throw new \Exception("Failed to save requirement file info: $filename");
                    }
                } else {
                    throw new \Exception("Failed to upload requirement file: $filename");
                }
            }
        }
    }

    private function handleRequirementFilesFromJson($uploaded_files, $application_id)
    {
        $base_upload_dir = __DIR__ . '/../../public/upload/';
        $upload_dir = $base_upload_dir . 'applications/' . $application_id . '/requirements/';

        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $requirementModel = new RequirementModel($this->pdo);

        foreach ($uploaded_files as $file) {
            if (isset($file['base64_data'])) {
                $filename = $file['filename'] ?? uniqid() . '.pdf';
                $category = $file['category'] ?? 'other';
                $target_file = $upload_dir . $filename;

                $file_data = base64_decode($file['base64_data']);

                if (file_put_contents($target_file, $file_data)) {
                    $db_file_path =
                        '/upload/applications/' . $application_id . '/requirements/' . $filename;

                    $mime_type = mime_content_type($target_file) ?: 'application/octet-stream';
                    $file_size = filesize($target_file);

                    $file_info = [
                        'file_name' => $filename,
                        'file_path' => $db_file_path,
                        'file_type' => $mime_type,
                        'file_size' => $file_size,
                        'requirement_type' => 'general',
                        'requirement_category' => $category,
                    ];

                    if (!$requirementModel->create($file_info, $application_id)) {
                        throw new \Exception("Failed to save requirement file info: $filename");
                    }
                } else {
                    throw new \Exception("Failed to save requirement file: $filename");
                }
            }
        }
    }

    private function handleProfilePictureFromJson($picture_file, $application_id)
    {
        $base_upload_dir = __DIR__ . '/../../public/upload/';
        $upload_dir = $base_upload_dir . 'applications/' . $application_id . '/profile/';

        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        if (isset($picture_file['base64_data'])) {
            $filename = $picture_file['filename'] ?? 'profile_' . uniqid() . '.jpg';
            $target_file = $upload_dir . $filename;

            $file_data = base64_decode($picture_file['base64_data']);

            if (file_put_contents($target_file, $file_data)) {
                $db_file_path = '/upload/applications/' . $application_id . '/profile/' . $filename;

                $mime_type = mime_content_type($target_file) ?: 'image/jpeg';
                $file_size = filesize($target_file);

                $profilePictureModel = new ProfilePictureModel();
                $file_info = [
                    'file_name' => $filename,
                    'file_path' => $db_file_path,
                    'file_type' => $mime_type,
                    'file_size' => $file_size,
                ];

                if (!$profilePictureModel->create($file_info, $application_id)) {
                    throw new \Exception("Failed to save profile picture info: $filename");
                }
            } else {
                throw new \Exception("Failed to save profile picture: $filename");
            }
        }
    }
}
?>
