<?php
/**
 * Certificate of Appearance API Router
 * 
 * Handles routing for Certificate of Appearance related endpoints
 */

require_once __DIR__ . '/../controllers/CertificateOfAppearanceController.php';
use App\Controllers\CertificateOfAppearanceController;

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Parse the URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// Find the API endpoint
$endpoint = null;
foreach ($uri as $key => $value) {
    if ($value === 'coa') {
        $endpoint = 'coa';
        // Check if next segment exists (could be application_id)
        $param = $uri[$key + 1] ?? null;
        break;
    }
}

// Initialize controller
$controller = new CertificateOfAppearanceController();

// Route based on endpoint and HTTP method
if ($endpoint === 'coa') {
    
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'POST':
            // Create new application
            $controller->createApplication();
            break;
            
        case 'GET':
            // Check if we have an application ID parameter
            if (isset($param) && !empty($param)) {
                // Get files for specific application ID
                $controller->getFiles($param);
            } else {
                // Invalid request - missing application ID
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Missing application ID"
                ]);
            }
            break;
            
        case 'DELETE':
            // Check if we have a file ID parameter
            if (isset($param) && !empty($param)) {
                // Delete specific file
                $controller->deleteFile($param);
            } else {
                // Invalid request - missing file ID
                http_response_code(400);
                echo json_encode([
                    "success" => false,
                    "message" => "Missing file ID"
                ]);
            }
            break;
            
        default:
            // Method not allowed
            http_response_code(405);
            echo json_encode([
                "success" => false,
                "message" => "Method not allowed"
            ]);
    }
} else {
    // Endpoint not found
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Endpoint not found"
    ]);
}