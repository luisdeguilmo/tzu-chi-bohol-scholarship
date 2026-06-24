<?php
namespace App\Controllers;

header('Content-Type: application/json');

date_default_timezone_set('Asia/Manila');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../models/UserAccountModel.php';

use App\Models\UserAccountModel;
use Config\Database;

class UserAccountController
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
            case 'PUT':
                $this->handlePut();
                break;
            default:
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
                break;
        }
    }

    private function handlePut()
    {
        try {
            $this->pdo->beginTransaction();

            $data = json_decode(file_get_contents('php://input'), true);
            $action = $_GET['action'] ?? null;

            if (!$data || !isset($data['userId'])) {
                throw new \Exception('Missing required field: userId');
            }

            $model = new UserAccountModel();

            if ($action === 'activate') {
                if (!$model->updateAccountStatus($data['userId'], 'active')) {
                    throw new \Exception('Failed to activate account');
                }
            } else {
                if (!$model->updateAccountStatus($data['userId'], 'deactivated')) {
                    throw new \Exception('Failed to deactivate account');
                }
            }

            $this->pdo->commit();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Account status updated successfully',
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

$controller = new UserAccountController();
$controller->processRequest();
?>
