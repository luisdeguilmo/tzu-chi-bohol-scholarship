<?php
// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the image path from the query parameter
$imagePath = $_GET['path'] ?? null;

// Basic security check to prevent directory traversal
if (!$imagePath || strpos($imagePath, '..') !== false) {
    http_response_code(400);
    echo "Invalid path";
    exit;
}

// Convert relative path to absolute if needed
if (strpos($imagePath, '/') === 0) {
    // If path starts with /, it's a relative path from web root
    $fullPath = $_SERVER['DOCUMENT_ROOT'] . $imagePath;
} else {
    // Otherwise, it's relative to this script
    $fullPath = __DIR__ . '/' . $imagePath;
}

// Debug - log the path for troubleshooting
error_log("Accessing file: " . $fullPath);

// Check if file exists
if (!file_exists($fullPath)) {
    http_response_code(404);
    echo "File not found: " . $fullPath;
    exit;
}

// Check if file is readable
if (!is_readable($fullPath)) {
    http_response_code(403);
    echo "File not readable";
    exit;
}

// Get file extension
$extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));

// Set content type based on file extension
$contentType = 'application/octet-stream'; // Default
switch ($extension) {
    case 'jpg':
    case 'jpeg':
        $contentType = 'image/jpeg';
        break;
    case 'png':
        $contentType = 'image/png';
        break;
    case 'gif':
        $contentType = 'image/gif';
        break;
    case 'pdf':
        $contentType = 'application/pdf';
        break;
    // Add more types as needed
}

// Also try to get MIME type using finfo
$fileInfo = finfo_open(FILEINFO_MIME_TYPE);
$detectedType = finfo_file($fileInfo, $fullPath);
finfo_close($fileInfo);

// Use detected type if it's a recognized image type
if (strpos($detectedType, 'image/') === 0) {
    $contentType = $detectedType;
}

// Set cache control to improve performance
header("Cache-Control: public, max-age=86400");

// Set the content type header
header("Content-Type: {$contentType}");
header("Content-Length: " . filesize($fullPath));

// Output the file
readfile($fullPath);
exit;
?>