<?php
#convert-image.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Accept");

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
    exit;
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
    exit;
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