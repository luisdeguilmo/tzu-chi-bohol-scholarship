<?php
// ApplicationFileController.php
namespace App\Controllers;

// CRITICAL: Suppress all output before JSON response
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Services/ApplicationFileService.php';
require_once __DIR__ . '/../Services/ActivityService.php';
require_once __DIR__ . '/../Models/CertificateOfAppearanceModel.php';

use App\Models\ProfilePictureModel;
use App\Services\ProfilePictureService;
use Config\Database;
use Middleware\Auth;

class ApplicationFileController
{
    private $pdo;
    private $service;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->service = new ProfilePictureService($this->pdo);
    }

    public function processRequest()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        $requestMethod = $_SERVER['REQUEST_METHOD'];

        switch ($requestMethod) {
            case 'GET':
                $this->handleGet();
                break;
            case 'POST':
                $this->createFile();
                break;
            case 'PUT':
                $this->updateFiles();
                break;
            default:
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
                break;
        }
    }

    public function createFile()
    {
        try {
            $this->pdo->beginTransaction();

            // Parse input data
            $data = $this->parseInputData();

            if (!$data || !isset($data['entrance_examination'])) {
                throw new \Exception('No activity data provided');
            }

            // Extract files
            $files = $_FILES['files'] ?? null;
            $base64Files = $data['uploaded_files'] ?? null;

            $applicationId = $data['entrance_examination']['application_id'];
            $type = $data['entrance_examination']['type'];

            // Create activity with files
            $fileId = $this->service->createFiles($applicationId, $files, $base64Files, $type);

            $this->pdo->commit();

            $this->sendResponse(201, [
                'success' => true,
                'message' => 'File(s) uploaded successfully',
                'activity_id' => $fileId,
            ]);
        } catch (\Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            $this->sendResponse(400, [
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function updateFiles()
    {
        $this->pdo->beginTransaction();

        try {
            // Parse input data
            $data = $this->parseInputData();
            $file_type = $_GET['type'] ?? null;

            if (!$data || !isset($data[$file_type])) {
                throw new \Exception('No activity data provided');
            }

            // Extract files
            $files = $_FILES['files'] ?? null;
            $base64Files = $data['uploaded_files'] ?? null;

            $applicationId = Auth::id();
            $type = $data[$file_type]['type'];

            // Create activity with files
            $activityId = $this->service->updateFiles(
                $applicationId,
                $data['existing_files_removed'],
                $files,
                $base64Files,
                $type,
            );

            $this->pdo->commit();

            $this->sendResponse(201, [
                'success' => true,
                'message' => 'Profile picture updated successfully',
                'activity_id' => $activityId,
            ]);
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            $this->sendResponse(400, [
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function parseInputData()
    {
        if (isset($_POST['activityData'])) {
            return json_decode($_POST['activityData'], true);
        }

        return json_decode(file_get_contents('php://input'), true);
    }

    private function sendResponse($statusCode, $data)
    {
        http_response_code($statusCode);
        echo json_encode($data);
        exit();
    }

    // private function handleGet()
    // {
    //     try {
    //         $model = new ProfilePictureModel();

    //         // Get ID parameter if it exists
    //         $id = isset($_GET['id']) ? $_GET['id'] : null;
    //         $type = $_GET['type'] ?? null;

    //         $result = [];

    //         $result = $model->getAllFiles($id, $type);

    //         http_response_code(200);
    //         echo json_encode([
    //             'success' => true,
    //             'data' => $result,
    //         ]);
    //     } catch (\Exception $e) {
    //         http_response_code(500);
    //         echo json_encode([
    //             'success' => false,
    //             'message' => $e->getMessage(),
    //         ]);
    //     }
    // }
}

$controller = new ApplicationFileController();
$controller->processRequest();
?>
