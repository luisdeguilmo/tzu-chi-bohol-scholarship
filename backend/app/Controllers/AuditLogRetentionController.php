<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';

use App\Models\ApplicantModel;
use App\Models\AuditLogRetentionModel;
use Config\Database;

class AuditLogRetentionController
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
            case 'PATCH':
                $this->handlePatch();
                break;
            default:
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
                break;
        }
    }

    public function handleGet()
    {
        try {
            $this->pdo->beginTransaction();

            $log_retention_model = new AuditLogRetentionModel();

            $log_retention = $log_retention_model->getLogRetention();

            $this->pdo->commit();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'logRetention' => $log_retention,
            ]);
        } catch (\Exception $e) {
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

    private function handlePatch()
    {
        try {
            // Clear any previous output
            ob_clean();

            $this->pdo->beginTransaction();

            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                throw new \Exception('No data provided or invalid JSON');
            }

            $log_retention_model = new AuditLogRetentionModel();

            if (!$log_retention_model->updateLogRetention($data)) {
                throw new \Exception('Failed to save score information');
            }

            $this->pdo->commit();

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Log retention updated successfully',
            ]);
        } catch (\Exception $e) {
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

$controller = new AuditLogRetentionController();
$controller->processRequest();
?>
