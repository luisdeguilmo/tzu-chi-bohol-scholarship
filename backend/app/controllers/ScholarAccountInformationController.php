<?php
namespace App\Controllers;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

date_default_timezone_set('Asia/Manila');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/ScholarAccountModel.php';

use App\Models\ScholarAccountInformationModel;
use App\Models\ScholarAccountModel;
use Config\Database;

class ScholarAccountInformationController
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
            case 'DELETE':
                // $this->handleDelete();
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
            $model = new ScholarAccountInformationModel();

            // Get ID parameter if it exists
            $scholarId = isset($_GET['scholar_id']) ? $_GET['scholar_id'] : null;
            $currentSchoolYear = isset($_GET['current_school_year'])
                ? $_GET['current_school_year']
                : null;

            if (!$scholarId || !$currentSchoolYear) {
                throw new \Exception(
                    'Missing required parameters: scholar_id and current_school_year',
                );
            }

            $basicInfo = $model->getBasicInformation($scholarId, $currentSchoolYear);
            $scholarStatus = $model->getScholarStatus($scholarId);
            $renderedHours = $model->getRenderedHours($scholarId);

            $result = [
                'basic_information' => $basicInfo,
                'scholar_status' => $scholarStatus,
                'rendered_hours' => $renderedHours,
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

$controller = new ScholarAccountInformationController();
$controller->processRequest();
?>
