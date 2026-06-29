<?php
namespace App\Controllers;

header('Content-Type: application/json');

date_default_timezone_set('Asia/Manila');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/ScholarAccountModel.php';

use App\Models\ScholarAccountInformationModel;
use App\Models\ScholarAccountModel;
use App\Models\StaffAccountInformationModel;
use Config\Database;
use App\Middleware\Auth;

class StaffAccountInformationController
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
            $result = [];
            $model = new StaffAccountInformationModel();

            // Get ID parameter if it exists
            $staffId = Auth::id();

            $basicInfo = $model->getBasicInformation($staffId);

            $result = [
                'basic_information' => $basicInfo,
            ];

            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $result]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }
}

$controller = new StaffAccountInformationController();
$controller->processRequest();
?>
