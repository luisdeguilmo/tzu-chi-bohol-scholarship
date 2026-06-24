<?php
namespace App\Controllers;

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Models/BatchModel.php';
require_once __DIR__ . '/../Services/PHPMailerBrevoService.php'; // Add this line

// Load environment variables
try {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
    $dotenv->safeLoad();
} catch (\Exception $e) {
    error_log('Could not load .env file: ' . $e->getMessage());
}

use App\Models\BatchModel;
use App\Services\PHPMailerBrevoService;
use Config\Database;

class ScheduleController
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
        $requiredEnvVars = [
            'BREVO_EMAIL',
            'BREVO_SMTP_KEY',
            'ORG_NAME',
            'ORG_ADDRESS',
            'ORG_CONTACT',
        ];

        foreach ($requiredEnvVars as $var) {
            if (empty($_ENV[$var])) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => "Missing required environment variable: $var",
                ]);
                return;
            }
        }

        $emailService = new PHPMailerBrevoService(
            $_ENV['BREVO_EMAIL'],
            $_ENV['BREVO_SMTP_KEY'],
            $_ENV['ORG_NAME'],
            $_ENV['ORG_ADDRESS'],
            $_ENV['ORG_CONTACT'],
        );

        try {
            // Clear any previous output
            ob_clean();

            $this->pdo->beginTransaction();

            $id = isset($_GET['id']) ? $_GET['id'] : null;

            if (!$id) {
                throw new \Exception('ID is required');
            }

            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                throw new \Exception('No data provided or invalid JSON');
            }

            $criteria = new BatchModel();

            if (!$criteria->createSchedule($data, $id)) {
                throw new \Exception('Failed to save schedule information');
            }

            foreach ($data['applicants'] as $applicant) {
                if (
                    !$emailService->sendExaminationScheduleEmail(
                        $applicant,
                        $data['batch'],
                        $data['date'],
                        $data['time'],
                        $data['venue'],
                    )
                ) {
                    throw new \Exception('Failed to send examination schedule email');
                }
            }

            $this->pdo->commit();

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Schedule Created Successfully',
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

$controller = new ScheduleController();
$controller->processRequest();
?>
