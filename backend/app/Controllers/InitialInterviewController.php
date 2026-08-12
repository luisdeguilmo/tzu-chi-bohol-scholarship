<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';

use App\Models\ApplicationsModel;
use Config\Database;

class InitialInterviewController
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
            case 'POST':
                $this->handlePost();
                break;
            default:
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
                break;
        }
    }

    private function handlePost()
    {
        try {
            $this->pdo->beginTransaction();

            // Handle data from both FormData and direct JSON
            if (isset($_POST['applicantIds'])) {
                // Handle data from FormData
                $data = $_POST;
            } else {
                // Handle direct JSON input
                $data = json_decode(file_get_contents('php://input'), true);
            }

            // file_put_contents('log.txt', json_encode($data) . PHP_EOL, FILE_APPEND);

            if (!$data) {
                throw new \Exception('No data provided');
            }

            // Check if we have applicantIds and batch
            if (!isset($data['applicantIds']) || !isset($data['application_status'])) {
                throw new \Exception('Missing required fields: applicantIds or application status');
            }

            // Process multiple applicants
            $applicationInfo = new ApplicationsModel();
            $successCount = 0;

            foreach ($data['applicantIds'] as $applicantId) {
                if ($applicationInfo->markAsInitialInterview($applicantId, $data)) {
                    $successCount++;
                }
            }

            if ($successCount === 0) {
                throw new \Exception('Failed to add batch information to any applicant');
            }

            $this->pdo->commit();

            // Return success response
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => "Batch added successfully to {$successCount} applicant(s)",
            ]);
        } catch (\Exception $e) {
            // Roll back transaction on error
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

$controller = new InitialInterviewController();
$controller->processRequest();
?>
