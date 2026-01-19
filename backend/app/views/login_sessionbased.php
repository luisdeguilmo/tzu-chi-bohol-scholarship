<?php
// Start session at the very beginning
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Expires: 0');

session_start();

header('Access-Control-Allow-Credentials: true');
$allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
$allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With'];

require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../../config/Database.php';

use Config\Database;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Function to log authentication attempts
function logAuthAttempt($message, $email = null, $userType = null)
{
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

    error_log($logMessage, 3, __DIR__ . '/../../logs/auth.log');
    error_log('AUTH LOG: ' . trim($logMessage));
}

$db = new Database();
$pdo = $db->getConnection();

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['email']) || !isset($input['password']) || !isset($input['type'])) {
    logAuthAttempt(
        'LOGIN FAILED - Missing required fields',
        $input['email'] ?? null,
        $input['type'] ?? null,
    );

    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$password = $input['password'];
$userType = $input['type'];

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    logAuthAttempt('LOGIN FAILED - Invalid email format', $email, $userType);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

// Log the login attempt
logAuthAttempt('LOGIN ATTEMPT', $email, $userType);

try {
    // Validate user
    $stmt = $pdo->prepare(
        'SELECT account_id, email, status, password, type FROM users WHERE email = ? AND type = ?',
    );
    $stmt->execute([$email, $userType]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    $userName = [];

    if ($userType === 'scholar') {
        $stmt = $pdo->prepare('SELECT first_name, last_name FROM scholars WHERE account_id = ?');
        $stmt->execute([$user['account_id']]);
        $userName = $stmt->fetch(PDO::FETCH_ASSOC);
    } elseif ($userType === 'staff') {
        $stmt = $pdo->prepare('SELECT first_name, last_name FROM staff WHERE account_id = ?');
        $stmt->execute([$user['account_id']]);
        $userName = $stmt->fetch(PDO::FETCH_ASSOC);
    } elseif ($userType === 'admin') {
        $stmt = $pdo->prepare('SELECT name FROM admin WHERE id = ?');
        $stmt->execute([$user['account_id']]);
        $userName = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if (!$user) {
        logAuthAttempt('LOGIN FAILED - User not found or incorrect user type', $email, $userType);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid credentials',
        ]);
        exit();
    }

    // Check password
    if (!password_verify($password, $user['password'])) {
        logAuthAttempt('LOGIN FAILED - Incorrect password', $email, $userType);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid credentials',
        ]);
        exit();
    }

    if ($user['status'] === 'graduated' || $user['status'] === 'terminated') {
        echo json_encode([
            'success' => false,
            'message' => 'Your account has been deactivated. Please contact the administrator.',
        ]);
        exit();
    }

    // Login successful - Store data in session
    logAuthAttempt('LOGIN SUCCESS', $email, $userType);

    // Regenerate session ID to prevent session fixation attacks
    session_regenerate_id(true);

    // Store user data in session
    $_SESSION['user_id'] = $user['account_id'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['type'] = $user['type'];
    $_SESSION['account_status'] = $user['status'];
    $_SESSION['name'] = $userName['name'] ?? null;
    $_SESSION['first_name'] = $userName['first_name'] ?? null;
    $_SESSION['last_name'] = $userName['last_name'] ?? null;
    $_SESSION['logged_in'] = true;
    $_SESSION['login_time'] = time();

    // Return success with user data (no token needed)
    echo json_encode([
        'success' => true,
        'user' => [
            'user_id' => $user['account_id'],
            'name' => $userName['name'] ?? null,
            'first_name' => $userName['first_name'] ?? null,
            'last_name' => $userName['last_name'] ?? null,
            'email' => $user['email'],
            'type' => $user['type'],
            'account_status' => $user['status'],
        ],
    ]);
} catch (PDOException $e) {
    logAuthAttempt('LOGIN FAILED - Database error: ' . $e->getMessage(), $email, $userType);
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred',
    ]);
} catch (Exception $e) {
    logAuthAttempt('LOGIN FAILED - General error: ' . $e->getMessage(), $email, $userType);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred during login',
    ]);
}
?>
