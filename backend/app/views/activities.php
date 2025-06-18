<?php
// events.php - Router file for handling activity requests

require_once __DIR__ . "/../controllers/ActivityController.php";

use App\Controllers\ActivityController;
use App\Models\ActivityModel;

// // Handle CORS preflight requests
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     header("Access-Control-Allow-Origin: *");
//     header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
//     header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
//     header("Access-Control-Max-Age: 86400");
//     http_response_code(200);
//     exit();
// }

// // Set CORS headers for actual requests
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
// header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
// header("Content-Type: application/json");


// try {
//     $controller = new ActivityController();
    
//     $method = $_SERVER['REQUEST_METHOD'];
    
//     switch ($method) {
//         case 'POST':
//             // Handle activity creation
//             $controller->createActivity();
//             break;
            
//         case 'GET':
            
//             if (isset($_GET['id'])) {
//                 // Get specific activity
//                 $activity->getActivity($_GET['id']);
//             } else {
//                 // Get all activities
//                 $activity->getAllActivities();
//             }
//             break;
            
//         case 'PUT':
//             // Handle activity updates (you can implement this later)
//             if (isset($_GET['id'])) {
//                 $controller->updateActivity($_GET['id']);
//             } else {
//                 http_response_code(400);
//                 echo json_encode(['success' => false, 'message' => 'Activity ID is required for update']);
//             }
//             break;
            
//         case 'DELETE':
//             // Handle activity deletion (you can implement this later)
//             if (isset($_GET['id'])) {
//                 $controller->deleteActivity($_GET['id']);
//             } else {
//                 http_response_code(400);
//                 echo json_encode(['success' => false, 'message' => 'Activity ID is required for deletion']);
//             }
//             break;
            
//         default:
//             http_response_code(405);
//             echo json_encode(['success' => false, 'message' => 'Method not allowed']);
//             break;
//     }
    
// } catch (Exception $e) {
//     http_response_code(500);
//     echo json_encode([
//         'success' => false, 
//         'message' => 'Server error: ' . $e->getMessage()
//     ]);
// }
?>