<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config/Database.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Models\ScholarModel;
use App\Models\ScholarsModel;
use Config\Database;

class ScholarAllowancesController
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

            $scholarAllowances = $model->getAllScholarAllowances();

            // Format results
            $results = array_map(function ($scholar) {
                return [
                    'Name' => $scholar['first_name'] . ' ' . $scholar['last_name'],
                    'Allowance' => $scholar['allowance'],
                    'Transport Allowance' => $scholar['transport_allowance'],
                    'Load Allowance' => $scholar['load_allowance'],
                ];
            }, $scholarAllowances);

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

// Create and execute controller
$controller = new ScholarAllowancesController();
$controller->processRequest();
?>
