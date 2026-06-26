<?php
// login.php
require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../middleware/Cors.php';
require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../../config/Database.php';

use App\Services\AuthService;
use Middleware\Cors;

Cors::handle();

// ── helpers ────────────────────────────────────────────────────────────────

function respond(bool $success, array $data = [], int $status = 200): never
{
    http_response_code($status);
    echo json_encode(array_merge(['success' => $success], $data));
    exit();
}

// ── input validation ───────────────────────────────────────────────────────

$input = json_decode(file_get_contents('php://input'), true);

$email    = trim(filter_var($input['email']    ?? '', FILTER_SANITIZE_EMAIL));
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

// ── authenticate ───────────────────────────────────────────────────────────

$auth   = new AuthService();
$result = $auth->login($email, $password, $userType);

if (!$result['success']) {
    if ($result['status'] === 429 && isset($result['retry_after'])) {
        header('Retry-After: ' . $result['retry_after']);
    }
    respond(false, ['message' => $result['message']], $result['status']);
}

respond(true, [
    'token' => $result['token'],
    'user'  => $result['user'],
]);
