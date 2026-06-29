<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config/Database.php';

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Models\ApplicationModel;
use Config\Database;
use App\Middleware\Auth;

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

    // private function handleGet()
    // {
    //     try {
    //         $model = new ApplicationModel();

    //         // âœ… Retrieve and sanitize query parameters
    //         $email = isset($_GET['email']) ? trim($_GET['email']) : null;
    //         $id = Auth::id();

    //         if (!$email) {
    //             http_response_code(200);
    //             echo json_encode([
    //                 'success' => false,
    //                 'message' => 'Email parameter is missing.',
    //             ]);
    //             return;
    //         }

    //         // âœ… Renewal check (email + id provided)
    //         if ($id) {
    //             $result = $model->checkEmailAddressForRenewal($email);

    //             if ($result && array_key_exists('scholar_id', $result)) {
    //                 $scholarId = $result['scholar_id']; // may be null or int

    //                 if ($scholarId !== null) {
    //                     $scholarId = (int) $scholarId;
    //                 }

    //                 if ($scholarId > 0 && $scholarId === $id) {
    //                     // Same scholar â€“ renewal allowed
    //                     http_response_code(200);
    //                     echo json_encode([
    //                         'success' => true,
    //                         'data' => false,
    //                     ]);
    //                 } elseif ($scholarId === null || $scholarId !== $id) {
    //                     // Scholar ID is null OR belongs to another scholar
    //                     http_response_code(200);
    //                     echo json_encode([
    //                         'success' => true,
    //                         'data' => true,
    //                     ]);
    //                 } else {
    //                     // Fallback (should not be reached)
    //                     http_response_code(200);
    //                     echo json_encode([
    //                         'success' => true,
    //                         'data' => false,
    //                     ]);
    //                 }
    //             } else {
    //                 // No record found for this email
    //                 http_response_code(200);
    //                 echo json_encode([
    //                     'success' => true,
    //                     'data' => false,
    //                 ]);
    //             }
    //         }

    //         // âœ… New application check (email only)
    //         else {
    //             $result = $model->checkEmailAddressForNew($email);

    //             if ($result) {
    //                 http_response_code(200);
    //                 echo json_encode([
    //                     'success' => true,
    //                     'data' => true,
    //                 ]);
    //             } else {
    //                 http_response_code(200);
    //                 echo json_encode([
    //                     'success' => true,
    //                     'data' => false,
    //                     'message' => 'Email not found',
    //                 ]);
    //             }
    //         }
    //     } catch (\Exception $e) {
    //         http_response_code(500);
    //         echo json_encode([
    //             'success' => false,
    //             'message' => 'Server error: ' . $e->getMessage(),
    //         ]);
    //     }
    // }

    private function handleGet()
    {
        try {
            $model = new ApplicationModel();

            // Get and sanitize email
            $email = isset($_GET['email']) ? trim($_GET['email']) : null;
            $id = isset($_GET['id']) ? trim($_GET['id']) : null;

            if (!$email) {
                http_response_code(400);

                echo json_encode([
                    'success' => false,
                    'message' => 'Email parameter is missing.',
                ]);

                return;
            }

            /**
             * =========================================
             * RENEWAL CHECK (LOGGED IN USER)
             * =========================================
             */
            if ($id) {
                $result = $model->checkEmailAddressForRenewal($email);

                // No existing email found
                if (!$result) {
                    http_response_code(200);

                    echo json_encode([
                        'success' => true,
                        'data' => false,
                    ]);

                    return;
                }

                $scholarId = isset($result['scholar_id']) ? (int) $result['scholar_id'] : null;

                // Same user = allowed
                if ($scholarId === (int) $id) {
                    http_response_code(200);

                    echo json_encode([
                        'success' => true,
                        'data' => false,
                    ]);

                    return;
                }

                // Email already belongs to another user
                http_response_code(200);

                echo json_encode([
                    'success' => true,
                    'data' => true,
                ]);

                return;
            }

            /**
             * =========================================
             * NEW APPLICATION CHECK
             * =========================================
             */
            $result = $model->checkEmailAddressForNew($email);

            http_response_code(200);

            echo json_encode([
                'success' => true,
                'data' => (bool) $result,
            ]);
        } catch (\Exception $e) {
            http_response_code(500);

            echo json_encode([
                'success' => false,
                'message' => 'Server error',
                'error' => $e->getMessage(),
            ]);
        }
    }
}

// Create and execute controller
$controller = new CheckEmailController();
$controller->processRequest();
?>
