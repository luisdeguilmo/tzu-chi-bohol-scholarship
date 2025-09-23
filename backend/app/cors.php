<?php
function handleCORS() {
    // Allow from specific origin
    $allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: *");
    }
    
        // header("Access-Control-Allow-Origin: https://c0mkgnv7-5173.asse.devtunnels.ms");

    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 3600"); // Cache preflight for 1 hour
    
    // Handle preflight
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Call this at the start of your PHP files
handleCORS();
?>