<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config/Database.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Models\ScholarsModel;
use Config\Database;

class AccountStatusController
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

            default:
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
                break;
        }
    }

    private function handleGet()
    {
        try {
            $model = new ScholarsModel();

            // âœ… Retrieve and sanitize query parameters
            $id = isset($_GET['id']) ? (int) $_GET['id'] : null;

            $accountStatus = $model->getAccountStatus($id);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $accountStatus,
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage(),
            ]);
        }
    }
}

// Create and execute controller
$controller = new AccountStatusController();
$controller->processRequest();
?>
