<?php
// Start session at the very beginning
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

session_start();

header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

$allowedMethods = ['GET', 'OPTIONS'];
$allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With'];

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'authenticated' => false,
        'message' => 'Method not allowed',
    ]);
    exit();
}

// Function to log session checks
function logSessionCheck($message, $userId = null)
{
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
    $sessionId = session_id();

    $logMessage = "[$timestamp] [IP: $ip] [Session: $sessionId] ";
    if ($userId) {
        $logMessage .= "[User ID: $userId] ";
    }
    $logMessage .= $message . PHP_EOL;

    error_log($logMessage, 3, __DIR__ . '/../../logs/session.log');
}

try {
    // Check if user is logged in
    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        logSessionCheck('SESSION CHECK - No active session');

        echo json_encode([
            'authenticated' => false,
            'user' => null,
            'message' => 'No active session',
        ]);
        exit();
    }

    // Check if session has expired (optional - 24 hours timeout)
    $sessionTimeout = 24 * 60 * 60; // 24 hours in seconds
    if (isset($_SESSION['login_time']) && time() - $_SESSION['login_time'] > $sessionTimeout) {
        logSessionCheck('SESSION CHECK - Session expired', $_SESSION['user_id'] ?? null);

        // Clear the session
        session_unset();
        session_destroy();

        echo json_encode([
            'authenticated' => false,
            'user' => null,
            'message' => 'Session expired',
        ]);
        exit();
    }

    // Validate required session data
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['email']) || !isset($_SESSION['type'])) {
        logSessionCheck('SESSION CHECK - Invalid session data');

        // Clear invalid session
        session_unset();
        session_destroy();

        echo json_encode([
            'authenticated' => false,
            'user' => null,
            'message' => 'Invalid session data',
        ]);
        exit();
    }

    // Update last activity time
    $_SESSION['last_activity'] = time();

    // Build user data from session
    $userData = [
        'user_id' => $_SESSION['user_id'],
        'email' => $_SESSION['email'],
        'type' => $_SESSION['type'],
        'account_status' => $_SESSION['account_status'] ?? 'active',
    ];

    // Add name fields based on user type
    if ($_SESSION['type'] === 'admin' && isset($_SESSION['name'])) {
        $userData['name'] = $_SESSION['name'];
    } else {
        if (isset($_SESSION['first_name'])) {
            $userData['first_name'] = $_SESSION['first_name'];
        }
        if (isset($_SESSION['last_name'])) {
            $userData['last_name'] = $_SESSION['last_name'];
        }
    }

    logSessionCheck('SESSION CHECK - Valid session', $_SESSION['user_id']);

    // Return authenticated response
    echo json_encode([
        'authenticated' => true,
        'user' => $userData,
        'message' => 'Session valid',
    ]);
} catch (Exception $e) {
    logSessionCheck('SESSION CHECK - Error: ' . $e->getMessage());

    echo json_encode([
        'authenticated' => false,
        'user' => null,
        'message' => 'Error checking session',
    ]);
}
?>
