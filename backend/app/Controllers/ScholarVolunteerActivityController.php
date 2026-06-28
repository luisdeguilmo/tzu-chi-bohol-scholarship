<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/BatchModel.php';

use App\Models\ActivityModel;
use App\Models\ScholarsModel;
use Config\Database;
use Exception;

class ScholarVolunteerActivityController
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
            $activity = new ActivityModel();
            $scholar = new ScholarsModel();

            // Get ID parameter if it exists
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            $tab = $_GET['tab'] ?? null;
            $year = $_GET['year'] ?? null;
            $month = $_GET['month'] ?? null;
            $status = $_GET['status'] ?? null;
            $sort = $_GET['sort'] ?? null;

            $activities = [];

            $activities = $activity->getActivitiesByTab($year, $month, $status, $sort);
            $result = $activity->getAllScholarsWithFiles($activities, $activity);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $result,
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

$controller = new ScholarVolunteerActivityController();
$controller->processRequest();
?>
