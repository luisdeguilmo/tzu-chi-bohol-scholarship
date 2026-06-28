<?php
namespace App\Controllers;

header('Content-Type: application/json');

date_default_timezone_set('Asia/Manila');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/ScholarAccountModel.php';

use App\Models\AdminAccountInformationModel;
use Config\Database;
use Middleware\Auth;

class AdminAccountInformationController
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
            $result = [];
            $model = new AdminAccountInformationModel();

            // Get ID parameter if it exists
            $id = Auth::id();

            $basicInfo = $model->getBasicInformation($id);

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

    private function handlePut()
    {
        try {
            $this->pdo->beginTransaction();

            $data = json_decode(file_get_contents('php://input'), true);

            $id = Auth::id();

            if (!$id) {
                throw new \Exception('ID is required.');
            }

            $model = new AdminAccountInformationModel();

            if (!$model->updateAdmin($data, $id)) {
                throw new \Exception('Failed to update admin info');
            }

            if (!$model->updateUser($data, $id)) {
                throw new \Exception('Failed to update admin info');
            }

            $this->pdo->commit();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Admin Information Updated Successfully',
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

$controller = new AdminAccountInformationController();
$controller->processRequest();
?>
