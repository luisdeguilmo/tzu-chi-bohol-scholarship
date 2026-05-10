<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config/Database.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Models\ApplicationRecordsModel;
use Config\Database;

class ApplicationRecordsController
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function processRequest()
    {
        // Handle preflight requests
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
            $applicant = new ApplicationRecordsModel();

            // Get ID parameter if it exists
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            $tab = $_GET['tab'] ?? null;
            $status = $_GET['status'] ?? null;
            $school_year = $_GET['school_year'] ?? null;
            $sort = $_GET['sort'] ?? null;

            $applicants = [];
            $results = [];

            if ($tab === 'new') {
                $applicants = $applicant->getAllNewApplicants($status, $school_year, $sort);
            } elseif ($tab === 'old') {
                $applicants = $applicant->getAllOldApplicants($status, $school_year, $sort);
            }

            $results = $applicant->getApplicantsWithProfile($tab, $applicants, $applicant);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $results,
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

// Create and execute controller
$controller = new ApplicationRecordsController();
$controller->processRequest();
?>
