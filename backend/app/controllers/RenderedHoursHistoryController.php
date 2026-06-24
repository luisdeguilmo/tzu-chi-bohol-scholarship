<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../models/RecentActivityModel.php';

use App\Models\RecentActivityModel;
use App\Models\RenderedHoursHistoryModel;
use Config\Database;
use Middleware\Auth;

class RenderedHoursHistoryController
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function processRequest()
    {
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
            $historyModel = new RenderedHoursHistoryModel();

            $id = Auth::id();

            if (!$id) {
                throw new \Exception('ID is required.');
            }

            $results = $historyModel->getRenderedHoursHistory($id);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $results,
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }
}

$controller = new RenderedHoursHistoryController();
$controller->processRequest();
?>
