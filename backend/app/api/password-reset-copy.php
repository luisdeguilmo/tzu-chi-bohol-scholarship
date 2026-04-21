<?php
// Database configuration
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/Database.php';

use Config\Database;

$db = new Database();
$pdo = $db->getConnection();

// Helper function to generate secure token
function generateSecureToken($length = 64) {
    return bin2hex(random_bytes($length / 2));
}

// Helper function to send email (basic implementation)
function sendResetEmail($email, $token) {
    $resetLink = "https://yourapp.com/reset-password.php?token=" . $token;
    $subject = "Password Reset Request";
    $message = "Click the following link to reset your password:\n\n" . $resetLink . "\n\nThis link expires in 1 hour.";
    $headers = "From: noreply@yourapp.com";
    
    return mail($email, $subject, $message, $headers);
}

// STEP 1: Request Password Reset
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'request_reset') {
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    
    if (!$email) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }
    
    // Check if email exists in users table
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if ($user) {
        // Generate secure token
        $token = generateSecureToken();
        $expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 hour from now
        
        // Delete any existing reset tokens for this email
        $deleteStmt = $pdo->prepare("DELETE FROM password_resets WHERE email = ?");
        $deleteStmt->execute([$email]);
        
        // Insert new reset token
        $insertStmt = $pdo->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)");
        $insertStmt->execute([$email, $token, $expiresAt]);
        
        // Send reset email
        if (sendResetEmail($email, $token)) {
            echo json_encode(['success' => true, 'message' => 'Password reset link sent to your email']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to send email']);
        }
    } else {
        // Don't reveal if email exists or not for security
        echo json_encode(['success' => true, 'message' => 'If the email exists, a reset link has been sent']);
    }
    exit;
}

// STEP 2: Verify Reset Token
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['token'])) {
    $token = $_GET['token'];
    
    // Check if token exists and is not expired
    $stmt = $pdo->prepare("SELECT email FROM password_resets WHERE token = ? AND expires_at > NOW()");
    $stmt->execute([$token]);
    $resetRequest = $stmt->fetch();
    
    if ($resetRequest) {
        echo json_encode(['success' => true, 'message' => 'Token is valid', 'email' => $resetRequest['email']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired reset token']);
    }
    exit;
}

// STEP 3: Update Password
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_password') {
    $token = $_POST['token'] ?? '';
    $newPassword = $_POST['new_password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';
    
    // Validate input
    if (empty($token) || empty($newPassword) || empty($confirmPassword)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }
    
    if ($newPassword !== $confirmPassword) {
        echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
        exit;
    }
    
    if (strlen($newPassword) < 8) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long']);
        exit;
    }
    
    // Verify token and get email
    $stmt = $pdo->prepare("SELECT email FROM password_resets WHERE token = ? AND expires_at > NOW()");
    $stmt->execute([$token]);
    $resetRequest = $stmt->fetch();
    
    if (!$resetRequest) {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired reset token']);
        exit;
    }
    
    $email = $resetRequest['email'];
    
    // Hash new password
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
    
    // Update user's password
    $updateStmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
    $updateSuccess = $updateStmt->execute([$hashedPassword, $email]);
    
    if ($updateSuccess) {
        // Delete the used token
        $deleteStmt = $pdo->prepare("DELETE FROM password_resets WHERE token = ?");
        $deleteStmt->execute([$token]);
        
        echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update password']);
    }
    exit;
}

// Clean up expired tokens (optional - run this periodically)
if (isset($_GET['cleanup'])) {
    $cleanupStmt = $pdo->prepare("DELETE FROM password_resets WHERE expires_at < NOW()");
    $cleanupStmt->execute();
    echo json_encode(['success' => true, 'message' => 'Expired tokens cleaned up']);
    exit;
}

// Default response for invalid requests
echo json_encode(['success' => false, 'message' => 'Invalid request']);
?>