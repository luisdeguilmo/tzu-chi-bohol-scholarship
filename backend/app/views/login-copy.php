<?php

require_once __DIR__ . "/../cors.php";

// header("Access-Control-Allow-Origin: https://c0mkgnv7-5173.asse.devtunnels.ms");
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");


require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . '/../../config/Database.php';

use Config\Database;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Function to log authentication attempts
function logAuthAttempt($message, $email = null, $userType = null) {
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
    
    $logMessage = "[$timestamp] [IP: $ip] [User-Agent: $userAgent] ";
    if ($email) {
        $logMessage .= "[Email: $email] ";
    }
    if ($userType) {
        $logMessage .= "[Type: $userType] ";
    }
    $logMessage .= $message . PHP_EOL;
    
    // Log to file (make sure the logs directory exists and is writable)
    error_log($logMessage, 3, __DIR__ . '/../../logs/auth.log');
    
    // Also log to PHP error log for development
    error_log("AUTH LOG: " . trim($logMessage));
}

$db = new Database();
$pdo = $db->getConnection();

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['email']) || !isset($input['password']) || !isset($input['type'])) {
    logAuthAttempt("LOGIN FAILED - Missing required fields", 
                   $input['email'] ?? null, 
                   $input['type'] ?? null);
    
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$password = $input['password'];
$userType = $input['type'];

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    logAuthAttempt("LOGIN FAILED - Invalid email format", $email, $userType);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Log the login attempt
logAuthAttempt("LOGIN ATTEMPT", $email, $userType);

try {
    // Validate user
    $stmt = $pdo->prepare("SELECT account_id, email, password, type FROM users WHERE email = ? AND type = ?");
    $stmt->execute([$email, $userType]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        // User not found or wrong type
        logAuthAttempt("LOGIN FAILED - User not found or incorrect user type", $email, $userType);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid credentials'
        ]);
        exit;
    }
    
    // Check password
    if (!password_verify($password, $user['password'])) {
        logAuthAttempt("LOGIN FAILED - Incorrect password", $email, $userType);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid credentials'
        ]);
        exit;
    }
    
    // Login successful
    logAuthAttempt("LOGIN SUCCESS", $email, $userType);
    
    $secret_key = "your-super-secret-jwt-key-change-this-in-production";
    
    $payload = [
        'user_id' => $user['account_id'],
        'email' => $user['email'],
        'type' => $user['type'],
        'iat' => time(),
        'exp' => time() + (24 * 60 * 60) // 24 hours
    ];
    
    $jwt = JWT::encode($payload, $secret_key, 'HS256');
    
    echo json_encode([
        'success' => true,
        'token' => $jwt,
        'user' => [
            'user_id' => $user['account_id'],
            'email' => $user['email'],
            'type' => $user['type']
        ]
    ]);
    
} catch (PDOException $e) {
    logAuthAttempt("LOGIN FAILED - Database error: " . $e->getMessage(), $email, $userType);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred'
    ]);
} catch (Exception $e) {
    logAuthAttempt("LOGIN FAILED - General error: " . $e->getMessage(), $email, $userType);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred during login'
    ]);
}
?>