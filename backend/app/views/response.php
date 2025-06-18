<?php
# response.php
require_once __DIR__ . '/../controllers/ApplicationController.php';

use App\Controllers\ApplicationController;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Router
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

$controller = new ApplicationController();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller->createApplication();
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Handle convert-image endpoint
    // Expected URL: /backend/api/convert-image
    // if (count($uri) >= 4 && $uri[3] === 'convert-image') {
    //     // Instead of including a separate file, handle the logic here
    //     handleImageConversion();
    //     exit();
    // }
        
    // Keep basic profile picture endpoint for other uses
    // Expected URL: /backend/api/applications/{applicationId}/profile-picture
    if (count($uri) >= 6 && $uri[5] === 'profile-picture') {
        $applicationId = $uri[4];
        $controller->getProfilePicture($applicationId);
        exit();
    }

    if (count($uri) >= 6 && $uri[5] === '2x2-picture') {
        $applicationId = $uri[4];
        $controller->getProfilePicture64($applicationId);
        exit();
    }
}

// Function to handle image conversion
function handleImageConversion() {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    // Create a log function for debugging
    function logError($message) {
        error_log("[Image Converter] " . $message);
    }

    if (!isset($_GET['imageUrl'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Image URL not provided'
        ]);
        return;
    }

    $imageUrl = urldecode($_GET['imageUrl']);
    logError("Received URL: " . $imageUrl);

    // Get the file path from URL
    $parsedUrl = parse_url($imageUrl);
    $filePath = $_SERVER['DOCUMENT_ROOT'] . $parsedUrl['path'];
    logError("Converted to file path: " . $filePath);

    // Validate file exists and is readable
    if (!file_exists($filePath) || !is_readable($filePath)) {
        logError("File not found or not readable: " . $filePath);
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Image file not accessible',
            'debug' => [
                'path' => $filePath,
                'exists' => file_exists($filePath),
                'readable' => is_readable($filePath)
            ]
        ]);
        return;
    }

    try {
        // Read file directly from filesystem
        $imageData = file_get_contents($filePath);
        if ($imageData === false) {
            throw new Exception("Failed to read file contents");
        }

        // Verify image type
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->buffer($imageData);
            
        if (!in_array($mimeType, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'])) {
            throw new Exception("Invalid mime type: " . $mimeType);
        }

        $base64 = base64_encode($imageData);
        // In your PHP controller, add this validation before returning
        
        // Validate base64 encoding
        // if (base64_decode($base64, true) === false) {
        //     http_response_code(500);
        //     echo json_encode([
        //         "success" => false,
        //         "message" => "Failed to encode image as base64"
        //     ]);
        //     return;
        // }

        // Ensure proper data URL format
        $base64Image = 'data:' . $mimeType . ';base64,' . $base64;

        echo json_encode([
            'success' => true,
            'base64' => $base64Image,
            'mimeType' => $mimeType
        ]);

    } catch (Exception $e) {
        logError("Error: " . $e->getMessage());
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage(),
            'debug' => [
                'url' => $imageUrl,
                'path' => $filePath
            ]
        ]);
    }
}

// Default if method is not supported
http_response_code(405);
echo json_encode(["message" => "Method not allowed"]);
?>