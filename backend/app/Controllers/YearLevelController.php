<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config/Database.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
// require_once __DIR__ . '/../Middleware/Auth.php';

use App\Models\ScholarModel;
use Config\Database;
use Middleware\Auth;

class YearLevelController
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
            $scholar = new ScholarModel();

            $id = Auth::id();
            $schoolYear = $_GET['school_year'] ?? null;

            $yearLevel = $scholar->getCurrentYearLevel($id, $schoolYear);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $yearLevel,
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

$controller = new YearLevelController();
$controller->processRequest();
?>
