<?php
// Database configuration
$allowedMethods = ['GET', 'POST', 'OPTIONS'];
$allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With'];

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 3600');

require_once __DIR__ . '/../../config/bootstrap.php';
// require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Services/PHPMailerBrevoService.php'; // Add this line

// Load environment variables
try {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
    $dotenv->safeLoad();
} catch (\Exception $e) {
    error_log('Could not load .env file: ' . $e->getMessage());
}

use App\Services\PHPMailerBrevoService;
use Config\Database;
use Middleware\Auth;

$db = new Database();
$pdo = $db->getConnection();

// Helper function to generate secure token
function generateSecureToken($length = 64)
{
    return bin2hex(random_bytes($length / 2));
}

function temporaryPassword(int $length = 12): string
{
    // Define the character pools
    $lowercase = 'abcdefghijklmnopqrstuvwxyz';
    $uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $numbers = '0123456789';

    // Combine all characters
    $allCharacters = $lowercase . $uppercase . $numbers;
    $maxIndex = strlen($allCharacters) - 1;

    $password = '';

    // Cryptographically secure random character selection
    for ($i = 0; $i < $length; $i++) {
        $password .= $allCharacters[random_int(0, $maxIndex)];
    }

    return $password;
}

$requiredEnvVars = ['BREVO_EMAIL', 'BREVO_SMTP_KEY', 'ORG_NAME', 'ORG_ADDRESS', 'ORG_CONTACT'];

foreach ($requiredEnvVars as $var) {
    if (empty($_ENV[$var])) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => "Missing required environment variable: $var",
        ]);
        return;
    }
}

$emailService = new PHPMailerBrevoService(
    $_ENV['BREVO_EMAIL'],
    $_ENV['BREVO_SMTP_KEY'],
    $_ENV['ORG_NAME'],
    $_ENV['ORG_ADDRESS'],
    $_ENV['ORG_CONTACT'],
);

$action = $_GET['action'] ?? '';

// STEP 1: Request Password Reset
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'request_reset') {
    // $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? false;

    if (!$email) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit();
    }

    // Check if email exists in users table
    $stmt = $pdo->prepare('SELECT account_id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        // Generate secure token
        $token = generateSecureToken();
        $expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 hour from now

        // Delete any existing reset tokens for this email
        $deleteStmt = $pdo->prepare('DELETE FROM password_resets WHERE email = ?');
        $deleteStmt->execute([$email]);

        // Insert new reset token
        $insertStmt = $pdo->prepare(
            'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
        );
        $insertStmt->execute([$email, $token, $expiresAt]);

        // Send reset email
        if ($emailService->sendResetLinkEmail($email, $token)) {
            echo json_encode([
                'success' => true,
                'message' => 'Password reset link sent to your email',
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to send email']);
        }
    } else {
        // Don't reveal if email exists or not for security
        echo json_encode([
            'success' => true,
            'message' => 'If the email exists, a reset link has been sent',
        ]);
    }
    exit();
}

// // STEP 2: Verify Reset Token
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['token'])) {
    $token = $_GET['token'];

    // Check if token exists and is not expired
    $stmt = $pdo->prepare(
        'SELECT email FROM password_resets WHERE token = ? AND expires_at > NOW()',
    );
    $stmt->execute([$token]);
    $resetRequest = $stmt->fetch();

    if ($resetRequest) {
        echo json_encode([
            'success' => true,
            'message' => 'Token is valid',
            'email' => $resetRequest['email'],
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired reset token']);
    }
    exit();
}

// // STEP 3: Update Password
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'update_password') {
    $token = $_POST['token'] ?? '';
    $newPassword = $_POST['new_password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    // Validate input
    if (empty($token) || empty($newPassword) || empty($confirmPassword)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit();
    }

    if ($newPassword !== $confirmPassword) {
        echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
        exit();
    }

    if (strlen($newPassword) < 8) {
        echo json_encode([
            'success' => false,
            'message' => 'Password must be at least 8 characters long',
        ]);
        exit();
    }

    // Verify token and get email
    $stmt = $pdo->prepare(
        'SELECT email FROM password_resets WHERE token = ? AND expires_at < NOW()',
    );
    $stmt->execute([$token]);
    $resetRequest = $stmt->fetch();

    if (!$resetRequest) {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired reset token']);
        exit();
    }

    $email = $resetRequest['email'];

    // Hash new password
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

    // Update user's password
    $updateStmt = $pdo->prepare(
        'UPDATE users SET password = ?, is_temporary = ?, temp_password_expires_at = ? WHERE email = ?',
    );
    $updateSuccess = $updateStmt->execute([$hashedPassword, 0, null, $email]);

    if ($updateSuccess) {
        // Delete the used token
        $type = $pdo->prepare('SELECT type FROM users WHERE email = ?');
        $type->execute([$email]);
        $user_type = $type->fetch();
        $deleteStmt = $pdo->prepare('DELETE FROM password_resets WHERE token = ?');
        $deleteStmt->execute([$token]);

        echo json_encode([
            'success' => true,
            'message' => 'Password updated successfully',
            'data' => $user_type,
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update password']);
    }
    exit();
}

// Change Password
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['action'] === 'change_password') {
    // $account_id = $_POST['account_id'] ?? '';
    $account_id = Auth::id();
    $currentPassword = $_POST['current_password'] ?? '';
    $newPassword = $_POST['new_password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    // Validate input
    if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit();
    }

    if ($newPassword !== $confirmPassword) {
        echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
        exit();
    }

    if (strlen($newPassword) < 8) {
        echo json_encode([
            'success' => false,
            'message' => 'Password must be at least 8 characters long',
        ]);
        exit();
    }

    // Verify token and get email
    $stmt = $pdo->prepare('SELECT password FROM users WHERE account_id = ?');
    $stmt->execute([$account_id]);
    $password = $stmt->fetch();

    if (!$password) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit();
    }
    // Hash new password
    // $hashedCurrentPassword = password_hash($currentPassword, password_verify());
    $hashedNewPassword = password_hash($newPassword, PASSWORD_BCRYPT);

    if (!password_verify($currentPassword, $password['password'])) {
        echo json_encode(['success' => false, 'message' => 'Incorrect current password']);
        exit();
    }

    // Update user's password
    $updateStmt = $pdo->prepare(
        'UPDATE users SET password = ?, is_temporary = ?, temp_password_expires_at = ? WHERE account_id = ?',
    );
    $updateSuccess = $updateStmt->execute([$hashedNewPassword, 0, null, $account_id]);

    if ($updateSuccess) {
        echo json_encode([
            'success' => true,
            'message' => 'Password updated successfully',
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update password']);
    }
    exit();
}

// Reset Password
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['action'] === 'reset_password') {
    // Generate the password and hash it
    $account_id = $_POST['account_id'] ?? '';
    $email = $_POST['email'] ?? '';
    $tempPassword = temporaryPassword(12);
    $hashedPassword = password_hash($tempPassword, PASSWORD_DEFAULT);

    // Calculate expiration time (24 hours from now)
    $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

    // Update the database
    // $query = "UPDATE users SET
    //         password = :password,
    //         is_temporary = 1,
    //         temp_password_expires_at = :expires_at
    //       WHERE id = :user_id";

    // $email = $pdo->prepare("SELECT email FROM users WHERE account_id = '$account_id'");

    if ($emailService->sendTempPasswordEmail($email, $tempPassword)) {
        $updateStmt = $pdo->prepare('UPDATE users SET 
            password = ?, 
            is_temporary = ?, 
            temp_password_expires_at = ? 
          WHERE account_id = ?');
        $updateSuccess = $updateStmt->execute([$hashedPassword, 1, $expiresAt, $account_id]);

        echo json_encode([
            'success' => true,
            'message' => 'Password reset link sent to your email',
        ]);
        exit();
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send email']);
        exit();
    }

    // ... Execute query and email the plain-text $tempPassword to the user ...
    // $account_id = $_POST['account_id'] ?? '';
    // $newPassword = $_POST['new_password'] ?? '';
    // $confirmPassword = $_POST['confirm_password'] ?? '';

    // // Validate input
    // if (empty($newPassword) || empty($confirmPassword)) {
    //     echo json_encode(['success' => false, 'message' => 'All fields are required']);
    //     exit();
    // }

    // if ($newPassword !== $confirmPassword) {
    //     echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
    //     exit();
    // }

    // if (strlen($newPassword) < 8) {
    //     echo json_encode([
    //         'success' => false,
    //         'message' => 'Password must be at least 8 characters long',
    //     ]);
    //     exit();
    // }

    // $hashedNewPassword = password_hash($newPassword, PASSWORD_BCRYPT);

    // // Update user's password
    // $updateStmt = $pdo->prepare('UPDATE users SET password = ? WHERE account_id = ?');
    // $updateSuccess = $updateStmt->execute([$hashedNewPassword, $account_id]);

    // if ($updateSuccess) {
    //     echo json_encode([
    //         'success' => true,
    //         'message' => 'Password updated successfully',
    //     ]);
    // } else {
    //     echo json_encode(['success' => false, 'message' => 'Failed to update password']);
    // }
    exit();
}

// Clean up expired tokens (optional - run this periodically)
if (isset($_GET['cleanup'])) {
    $cleanupStmt = $pdo->prepare('DELETE FROM password_resets WHERE expires_at < NOW()');
    $cleanupStmt->execute();
    echo json_encode(['success' => true, 'message' => 'Expired tokens cleaned up']);
    exit();
}

// Default response for invalid requests
echo json_encode(['success' => false, 'message' => 'Invalid request']);
?>
