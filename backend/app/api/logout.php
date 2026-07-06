<?php
// logout.php
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

Cors::handle();

$header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$auth   = new AuthService();

if (preg_match('/Bearer\s(\S+)/', $header, $m)) {
    try {
        $decoded = FirebaseJWT::decode($m[1], new Key(Jwt::secret(), 'HS256'));
        $auth->logout($decoded->jti);
    } catch (\Throwable $e) {
        // Token already invalid/expired — nothing to clean up, that's fine.
    }
}

http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Logged out.']);