<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config/Database.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Models\ScholarModel;
use App\Models\SchoolYearModel;
use Config\Database;
use Middleware\Auth;

class ScholarController
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
            case 'GET':
                $this->handleGet();
                break;
            case 'PUT':
                $this->handlePut();
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
            $scholar = new ScholarModel();
            $schoolYear = new SchoolYearModel();

            $id = Auth::id();
            $schoolYear = $schoolYear->getActiveSchoolYear();

            $type = $scholar->getScholarType($id, $schoolYear);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $type,
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function handlePut()
    {
        try {
            $this->pdo->beginTransaction();

            // Get data from request body
            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Check if ID is provided
            if (!isset($data['account_id'])) {
                throw new \Exception('ID is required for update');
            }

            $scholarModel = new ScholarModel();

            if (!$scholarModel->updateAllowanceStatus($data)) {
                throw new \Exception('Failed to update status');
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Application period updated successfully',
            ]);
        } catch (\Exception $e) {
            // Roll back transaction on error
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }
}

// Create and execute controller
$controller = new ScholarController();
$controller->processRequest();
?>
