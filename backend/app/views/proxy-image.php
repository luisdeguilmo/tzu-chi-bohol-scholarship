<?php
// proxy-image.php - Place this in your backend/api/ directory

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$imageUrl = $_GET['url'] ?? '';

if (empty($imageUrl)) {
    http_response_code(400);
    echo json_encode(['error' => 'URL parameter is required']);
    exit();
}

// Validate that the URL is from your domain (security measure)
$allowedDomains = ['localhost:8000', 'your-domain.com'];
$parsedUrl = parse_url($imageUrl);
$host = $parsedUrl['host'] . (isset($parsedUrl['port']) ? ':' . $parsedUrl['port'] : '');

if (!in_array($host, $allowedDomains)) {
    http_response_code(403);
    echo json_encode(['error' => 'Domain not allowed']);
    exit();
}

try {
    // Fetch the image
    $imageContent = file_get_contents($imageUrl);
    
    if ($imageContent === false) {
        http_response_code(404);
        echo json_encode(['error' => 'Image not found']);
        exit();
    }
    
    // Get image info to set proper content type
    $imageInfo = getimagesizefromstring($imageContent);
    
    if ($imageInfo === false) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid image']);
        exit();
    }
    
    // Set appropriate headers
    header('Content-Type: ' . $imageInfo['mime']);
    header('Content-Length: ' . strlen($imageContent));
    header('Cache-Control: public, max-age=3600'); // Cache for 1 hour
    
    // Output the image
    echo $imageContent;
    
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>