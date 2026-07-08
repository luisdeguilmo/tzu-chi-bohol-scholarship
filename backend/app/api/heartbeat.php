<?php
// heartbeat.php
require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../Middleware/Cors.php';
require_once __DIR__ . '/../Config/Jwt.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../Services/AuthService.php';

use App\Middleware\Cors;
use App\Config\Jwt;
use App\Services\AuthService;
use Firebase\JWT\JWT as FirebaseJWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

Cors::handle();

$header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

if (!preg_match('/Bearer\s(\S+)/', $header, $m)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Missing token.']);
    exit();
}

try {
    $decoded = FirebaseJWT::decode($m[1], new Key(Jwt::secret(), 'HS256'));
} catch (ExpiredException $e) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Token expired.']);
    exit();
} catch (\Throwable $e) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid token.']);
    exit();
}

try {
    $auth  = new AuthService();
    $found = $auth->heartbeat($decoded->jti);
} catch (\Throwable $e) {
    // DB hiccup — don't conflate this with "session doesn't exist"
    error_log('[heartbeat.php] ' . $e->getMessage());
    http_response_code(503); // Service Unavailable, distinctly NOT 401
    echo json_encode(['success' => false, 'message' => 'Temporarily unavailable.']);
    exit();
}

if (!$found) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Session not found.']);
    exit();
}

http_response_code(200);
echo json_encode(['success' => true]);