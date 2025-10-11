<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config/Database.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Models\ApplicationModel;
use Config\Database;

class CheckEmailController
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
            $model = new ApplicationModel();

            // ✅ Use $_GET to retrieve query parameters
            $email = isset($_GET['email']) ? trim($_GET['email']) : null;

            if ($email) {
                $result = $model->checkEmailAddress($email);

                if ($result) {
                    http_response_code(200);
                    echo json_encode([
                        'success' => true,
                        'data' => true,
                    ]);
                } else {
                    http_response_code(200); // still 200, but indicates email is not used
                    echo json_encode([
                        'success' => true,
                        'data' => false,
                        'message' => 'Email not found',
                    ]);
                }
            } else {
                http_response_code(400); // Bad request
                echo json_encode([
                    'success' => false,
                    'message' => 'Email parameter is missing.',
                ]);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage(),
            ]);
        }
    }
}

// Create and execute controller
$controller = new CheckEmailController();
$controller->processRequest();
?>
