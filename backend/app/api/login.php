<?php
require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../middleware/Cors.php';
require_once __DIR__ . '/../config/jwt.php';

use Config\Database;
use Config\Jwt;
use Firebase\JWT\JWT as FirebaseJWT;
use Middleware\Cors;

Cors::handle();

require_once __DIR__ . '/../../config/Database.php';

// ── helpers ────────────────────────────────────────────────────────────────

function logAuth(string $message, ?string $email = null, ?string $userType = null): void
{
    $ts = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $line = "[$ts] [IP: $ip]";
    if ($email) {
        $line .= " [Email: $email]";
    }
    if ($userType) {
        $line .= " [Type: $userType]";
    }
    $line .= " $message" . PHP_EOL;

    $logDir = __DIR__ . '/../../logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0750, true);
    }
    error_log($line, 3, $logDir . '/auth.log');
}

function respond(bool $success, array $data = [], int $status = 200): never
{
    http_response_code($status);
    echo json_encode(array_merge(['success' => $success], $data));
    exit();
}

// ── input validation ───────────────────────────────────────────────────────

$input = json_decode(file_get_contents('php://input'), true);

$email = trim(filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL));
$password = $input['password'] ?? '';
$userType = trim($input['type'] ?? '');

$allowedTypes = ['scholar', 'staff', 'admin'];

if (!$email || !$password || !$userType) {
    respond(false, ['message' => 'Email, password, and type are required.'], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, ['message' => 'Invalid email format.'], 422);
}

if (!in_array($userType, $allowedTypes, true)) {
    respond(false, ['message' => 'Invalid user type.'], 422);
}

// ── database ───────────────────────────────────────────────────────────────

try {
    $db = new Database();
    $pdo = $db->getConnection();

    // Fetch account
    $stmt = $pdo->prepare(
        'SELECT account_id, email, status, password, type
         FROM users
         WHERE email = ? AND type = ?
         LIMIT 1',
    );
    $stmt->execute([$email, $userType]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Always run password_verify to prevent timing attacks
    $hashToCheck = $user['password'] ?? '$2y$10$invalidsaltinvalidsaltinvalidsal';
    $passwordOk = password_verify($password, $user['password']);

    if (!$user || !$passwordOk) {
        logAuth('LOGIN FAILED – bad credentials', $email, $userType);
        respond(false, ['message' => 'Invalid credentials.'], 401);
    }

    // Status check
    $blockedStatuses = ['graduated', 'terminated', 'suspended'];
    if (in_array($user['status'], $blockedStatuses, true)) {
        logAuth('LOGIN FAILED – account inactive', $email, $userType);
        respond(false, ['message' => 'Your account is inactive. Contact the administrator.'], 403);
    }

    // Fetch name depending on role
    $name = [];
    match ($userType) {
        'scholar' => (function () use ($pdo, $user, &$name) {
            $s = $pdo->prepare(
                'SELECT first_name, last_name FROM scholars WHERE account_id = ? LIMIT 1',
            );
            $s->execute([$user['account_id']]);
            $name = $s->fetch(PDO::FETCH_ASSOC) ?: [];
        })(),
        'staff' => (function () use ($pdo, $user, &$name) {
            $s = $pdo->prepare(
                'SELECT first_name, last_name FROM staff WHERE account_id = ? LIMIT 1',
            );
            $s->execute([$user['account_id']]);
            $name = $s->fetch(PDO::FETCH_ASSOC) ?: [];
        })(),
        'admin' => (function () use ($pdo, $user, &$name) {
            $s = $pdo->prepare('SELECT name FROM admin WHERE id = ? LIMIT 1');
            $s->execute([$user['account_id']]);
            $name = $s->fetch(PDO::FETCH_ASSOC) ?: [];
        })(),
    };

    // Build JWT
    $now = time();
    $payload = [
        'iss' => $_ENV['ALLOWED_ORIGIN'] ?? 'app',
        'iat' => $now,
        'exp' => $now + Jwt::expiry(),
        'user_id' => $user['account_id'],
        'type' => $user['type'],
        'account_status' => $user['status'],
    ];

    $jwt = FirebaseJWT::encode($payload, Jwt::secret(), 'HS256');

    logAuth('LOGIN SUCCESS', $email, $userType);

    respond(true, [
        'token' => $jwt,
        'user' => [
            'user_id' => $user['account_id'],
            'email' => $user['email'],
            'type' => $user['type'],
            'account_status' => $user['status'],
            'first_name' => $name['first_name'] ?? null,
            'last_name' => $name['last_name'] ?? null,
            'name' => $name['name'] ?? null,
        ],
    ]);
} catch (PDOException $e) {
    logAuth('LOGIN ERROR – DB: ' . $e->getMessage(), $email, $userType);
    respond(false, ['message' => 'Database error. Please try again.'], 500);
}
