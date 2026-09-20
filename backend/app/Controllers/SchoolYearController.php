<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/BatchModel.php';

use App\Models\SchoolYearModel;
use Config\Database;

class SchoolYearController
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
            $year = new SchoolYearModel();

            $status = $_GET['action'] ?? null;
            $result = null;

            if ($status && $status === 'active') {
                $result = $year->getActiveSchoolYear();
            } else {
                $result = $year->getAllSchoolYears();
            }

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

    private function handlePut()
    {
        try {
            $this->pdo->beginTransaction();

            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                throw new \Exception('No data provided');
            }

            if (!isset($data['id'])) {
                throw new \Exception('ID is required for update');
            }

            $id = $data['id'];
            $model = new SchoolYearModel();

            $selected = $model->getSchoolYearById($id);

            if (!$selected) {
                throw new \Exception('School year not found');
            }

            // Only the non-active one of the two newest school years can be activated
            // Only the non-active one of the two newest school years can be activated
            $latestTwo = $model->getLatestTwoSchoolYears();
            $allowedIds = array_column(
                array_filter($latestTwo, fn($sy) => $sy['status'] !== 'active'),
                'id',
            );

            if (!in_array($id, $allowedIds)) {
                throw new \Exception('This school year cannot be activated');
            }

            // The newest school year (getLatestTwoSchoolYears is ordered newest first)
            $newest = $latestTwo[0];

            // 1. Handle the currently active school year
            $previousActive = $model->getPreviousActiveSchoolYear($id);

            if ($previousActive) {
                // The newest school year goes back to upcoming, older ones are archived
                $newStatus = $previousActive['id'] == $newest['id'] ? 'upcoming' : 'archived';

                if (!$model->updateStatus($previousActive['id'], $newStatus)) {
                    throw new \Exception('Failed to update previous school year');
                }
            }

            // 2. Activate the selected school year
            if (!$model->updateStatus($id, 'active')) {
                throw new \Exception('Failed to activate selected school year');
            }

            // 3. The newest school year is always upcoming (unless it is the one just activated)
            if ($newest['id'] != $id && !$model->updateStatus($newest['id'], 'upcoming')) {
                throw new \Exception('Failed to set the newest school year as upcoming');
            }

            $this->pdo->commit();

            http_response_code(200);

            echo json_encode([
                'success' => true,
                'message' => 'School year updated successfully',
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

$controller = new SchoolYearController();
$controller->processRequest();
?>
