<?php
// logout.php
// Start session at the very beginning
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

session_start();

header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

$allowedMethods = ['POST', 'OPTIONS'];
$allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With'];

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed',
    ]);
    exit();
}

// Function to log logout events
function logLogout($message, $userId = null, $email = null, $userType = null)
{
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
    $sessionId = session_id();
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

    $logMessage = "[$timestamp] [IP: $ip] [Session: $sessionId] [User-Agent: $userAgent] ";
    if ($userId) {
        $logMessage .= "[User ID: $userId] ";
    }
    if ($email) {
        $logMessage .= "[Email: $email] ";
    }
    if ($userType) {
        $logMessage .= "[Type: $userType] ";
    }
    $logMessage .= $message . PHP_EOL;

    error_log($logMessage, 3, __DIR__ . '/../../logs/auth.log');
    error_log('LOGOUT LOG: ' . trim($logMessage));
}

try {
    // Capture user info before destroying session
    $userId = $_SESSION['user_id'] ?? null;
    $email = $_SESSION['email'] ?? null;
    $userType = $_SESSION['type'] ?? null;
    $wasLoggedIn = isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;

    if ($wasLoggedIn) {
        logLogout('LOGOUT SUCCESS - User logged out', $userId, $email, $userType);

        // Calculate session duration if login_time exists
        if (isset($_SESSION['login_time'])) {
            $sessionDuration = time() - $_SESSION['login_time'];
            $hours = floor($sessionDuration / 3600);
            $minutes = floor(($sessionDuration % 3600) / 60);
            logLogout("Session duration: {$hours}h {$minutes}m", $userId, $email, $userType);
        }

        // Unset all session variables
        $_SESSION = [];

        // Delete the session cookie
        if (isset($_COOKIE[session_name()])) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly'],
            );
        }

        // Destroy the session
        session_destroy();

        echo json_encode([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    } else {
        logLogout('LOGOUT ATTEMPT - No active session to logout');

        // Even if no session, clean up anyway
        session_unset();
        session_destroy();

        echo json_encode([
            'success' => true,
            'message' => 'No active session found',
        ]);
    }
} catch (Exception $e) {
    logLogout(
        'LOGOUT FAILED - Error: ' . $e->getMessage(),
        $userId ?? null,
        $email ?? null,
        $userType ?? null,
    );

    // Try to clean up session anyway
    try {
        session_unset();
        session_destroy();
    } catch (Exception $cleanupError) {
        logLogout('LOGOUT CLEANUP FAILED: ' . $cleanupError->getMessage());
    }

    echo json_encode([
        'success' => false,
        'message' => 'Error during logout',
        'error' => $e->getMessage(),
    ]);
}
?>
