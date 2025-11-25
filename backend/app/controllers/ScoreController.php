<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/BatchModel.php';

use App\Models\ApplicantModel;
use App\Models\ScoreModel;
use App\Models\SettingsModel;
use Config\Database;

class ScoreController
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
                // $this->handleGet();
                break;
            case 'POST':
                // $this->handlePost();
                break;
            case 'PUT':
                $this->handlePut();
                break;
            case 'DELETE':
                // $this->handleDelete();
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
            // Clear any previous output
            ob_clean();

            $this->pdo->beginTransaction();

            // $id = isset($_GET['id']) ? $_GET['id'] : null;

            $data = json_decode(file_get_contents('php://input'), true);

            $id = $data['id'] ?? null;

            if (!$id) {
                throw new \Exception('ID is required');
            }

            if (!$data) {
                throw new \Exception('No data provided or invalid JSON');
            }

            $criteria = new ScoreModel();
            $applicant = new ApplicantModel();
            $settings = new SettingsModel();

            if (!$criteria->createScore($data, $id)) {
                throw new \Exception('Failed to save score information');
            }

            $passingScore = $settings->getPassingScore();

            if ($data['score'] >= $passingScore) {
                if (!$applicant->updateStatusToExamPassed($id)) {
                    throw new \Exception('Failed to update status');
                }
            } else {
                if (!$applicant->updateStatusToExamFailed($id)) {
                    throw new \Exception('Failed to update status');
                }
            }

            $this->pdo->commit();

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Schedule created successfully',
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

$controller = new ScoreController();
$controller->processRequest();
?>
