<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';

use App\Constants\Action;
use App\Models\AllowanceSettingsModel;
use App\Models\AuditLogModel;
use App\Models\StaffAccountModel;
use Config\Database;
use Middleware\Auth;

class AllowanceSettingsController
{
    private $pdo;
    private $auditLogModel;
    private $staffModel;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->auditLogModel = new AuditLogModel();
        $this->staffModel = new StaffAccountModel();
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

    public function handleGet()
    {
        try {
            $this->pdo->beginTransaction();

            $model = new AllowanceSettingsModel();

            $maximumHoursAndAmountPerHour = $model->getMaximumHoursAndAmountPerHour();

            $this->pdo->commit();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $maximumHoursAndAmountPerHour,
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

    private function handlePut()
    {
        try {
            // Clear any previous output
            ob_clean();

            $this->pdo->beginTransaction();

            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                throw new \Exception('No data provided or invalid JSON');
            }

            $model = new AllowanceSettingsModel();

            if (!$model->setMaximumHoursAndAmountPerHour($data)) {
                throw new \Exception('Failed to save score information');
            }

            $staffId = Auth::id();
            $staff = $this->staffModel->getStaffInfoById($staffId);

            if (
                !$this->auditLogModel->create([
                    'user_id' => $staffId,
                    'actor' => "{$staff['first_name']} {$staff['last_name']}",
                    'user_role' => 'staff',
                    'action' => Action::ALLOWANCE_SETTINGS_UPDATE,
                    'entity_type' => 'allowance',
                    'entity_id' => null,

                    'description' =>
                        $staff['first_name'] .
                        ' ' .
                        $staff['last_name'] .
                        ' updated the allowance settings.',

                    'old_values' => null,
                    'new_values' => [
                        'allowance_settings' => [
                            'maximum_hours' => $data['maximum_hours'],
                            'amount_per_hour' => $data['amount_per_hour'],
                        ],
                    ],
                    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                ])
            ) {
                throw new \Exception('Failed to create audit log');
            }

            $this->pdo->commit();

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Allowance settings updated successfully',
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

$controller = new AllowanceSettingsController();
$controller->processRequest();
?>
