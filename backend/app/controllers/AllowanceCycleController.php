<?php
namespace App\Controllers;

date_default_timezone_set('Asia/Manila');
require_once __DIR__ . '/../../config/Database.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Models\AllowanceCycleModel;
use App\Models\ScholarsModel;
use App\Services\AllowanceService;
use Config\Database;

class AllowanceCycleController
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
            $cycleModel = new AllowanceCycleModel();

            $isProcessed = $cycleModel->isPreviousMonthProcessed();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $isProcessed,
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function handlePost()
    {
        try {
            $this->pdo->beginTransaction();

            $allowanceCycleModel = new AllowanceCycleModel();
            $scholarsModel = new ScholarsModel();

            if ($allowanceCycleModel->isCycleStartedThisMonth()) {
                http_response_code(200);
                echo json_encode([
                    'success' => false,
                    'message' => 'A cycle has already been started for this month.',
                ]);
                return;
            }

            $allowanceCycleModel->resetAllowanceCycle();
            $allowanceCycleModel->createNewCycle();
            $scholarsModel->resetAllScholarsAllowanceStatusToPending();

            $this->pdo->commit();

            // Return success response
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Scholars allowance processed successfully',
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
$controller = new AllowanceCycleController();
$controller->processRequest();
?>
