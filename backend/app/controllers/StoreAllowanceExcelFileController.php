<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config/Database.php';

date_default_timezone_set('Asia/Manila');

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Models\AllowanceCycleModel;
use Config\Database;

class StoreAllowanceExcelFileController
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function processRequest()
    {
        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            return;
        }

        $requestMethod = $_SERVER['REQUEST_METHOD'];

        switch ($requestMethod) {
            case 'POST':
                $this->handlePost();
                break;
            case 'GET':
                $this->handleGet();
                break;

            default:
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
                break;
        }
    }

    private function handleGet()
    {
        try {
            // Get file ID from query parameter
            if (!isset($_GET['id']) || empty($_GET['id'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'File ID is required',
                ]);
                return;
            }

            $fileId = filter_var($_GET['id'], FILTER_VALIDATE_INT);

            if ($fileId === false) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid file ID',
                ]);
                return;
            }

            $allowanceCycleModel = new AllowanceCycleModel();
            $this->download($fileId, $allowanceCycleModel);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function download($id, $allowanceFile)
    {
        try {
            $file = $allowanceFile->getById($id);

            if (!$file) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'File not found',
                ]);
                return;
            }

            // Clear any output buffers
            if (ob_get_level()) {
                ob_end_clean();
            }

            // Set headers for file download
            header(
                'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            );
            header('Content-Disposition: attachment; filename="' . $file['file_name'] . '"');
            header('Content-Length: ' . strlen($file['file_data']));
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Access-Control-Expose-Headers: Content-Disposition');

            // Output file data
            echo $file['file_data'];
            exit(); // Important: Stop script execution after outputting file
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error downloading file: ' . $e->getMessage(),
            ]);
        }
    }

    private function handlePost()
    {
        try {
            // Validate file upload first (before starting transaction)
            if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'No file uploaded or upload error occurred',
                ]);
                return;
            }

            $file = $_FILES['file'];
            $fileName = isset($_POST['file_name']) ? $_POST['file_name'] : $file['name'];
            $total = isset($_POST['grand_total']) ? $_POST['grand_total'] : null; // Fixed: Use ternary operator, not null coalescing with isset

            // Validate file type
            $allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
            ];

            if (!in_array($file['type'], $allowedTypes)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid file type. Only Excel files are allowed.',
                ]);
                return;
            }

            // Validate file size (max 16MB)
            $maxSize = 16 * 1024 * 1024;
            if ($file['size'] > $maxSize) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'File size exceeds maximum limit of 16MB',
                ]);

                return;
            }

            // Read file data
            $fileData = file_get_contents($file['tmp_name']);

            if ($fileData === false) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to read file data',
                ]);
                return;
            }

            // Now start transaction
            $this->pdo->beginTransaction();

            $allowanceCycleModel = new AllowanceCycleModel();

            // Store to database
            $totalResult = $allowanceCycleModel->storeTotalAmount($total); // Check result
            $result = $allowanceCycleModel->storeExcelFile($fileName, $fileData);

            if ($result['success'] && $totalResult) {
                // Check both results
                $this->pdo->commit();
                http_response_code(201);
                echo json_encode($result);
            } else {
                $this->pdo->rollBack();
                http_response_code(500);
                echo json_encode($result);
            }
        } catch (\Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }
}

// Create and execute controller
$controller = new StoreAllowanceExcelFileController();
$controller->processRequest();
?>
