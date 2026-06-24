<?php
// login.php
require_once __DIR__ . '/../../config/bootstrap.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../middleware/Cors.php';
require_once __DIR__ . '/../config/jwt.php';

use App\Models\ScholarModel;
use App\Models\ScholarsModel;
use App\Models\SchoolYearModel;
use App\Models\UserAccountModel;
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

// try {
//     $db = new Database();
//     $pdo = $db->getConnection();

//     // Fetch account
//     $stmt = $pdo->prepare(
//         'SELECT account_id, email, status, password, type, is_temporary, temp_password_expires_at
//          FROM users
//          WHERE email = ? AND type = ?
//          LIMIT 1',
//     );
//     $stmt->execute([$email, $userType]);
//     $user = $stmt->fetch(PDO::FETCH_ASSOC);

//     // Always run password_verify to prevent timing attacks
//     $currentDateTime = date('Y-m-d H:i:s');
//     $hashToCheck = $user['password'] ?? '$2y$10$invalidsaltinvalidsaltinvalidsal';

//     if (!$user) {
//         logAuth('LOGIN FAILED – bad credentials', $email, $userType);
//         respond(false, ['message' => 'Invalid credentials.'], 401);
//     }

//     $passwordOk = password_verify($password, $user['password']);

//     if (!$user || !$passwordOk) {
//         logAuth('LOGIN FAILED – bad credentials', $email, $userType);
//         respond(false, ['message' => 'Invalid credentials.'], 401);
//     }

//     if ($user['is_temporary'] == 1) {
//         // 3. Check if the temporary password has expired
//         if ($currentDateTime > $user['temp_password_expires_at']) {
//             // EXPIRED CASE
//             // echo '❌ This temporary password has expired. Please contact your admin for a new reset.';
//             respond(
//                 false,
//                 [
//                     'message' =>
//                         'This temporary password has expired. Please contact your admin for a new reset.',
//                 ],
//                 401,
//             );
//         }

//         // // VALID TEMP PASSWORD CASE
//         // // Save user ID to session so you know who is changing their password
//         // $_SESSION['force_password_change_user_id'] = $user['id'];

//         // // Redirect them immediately to the update password form
//         // header('Location: change-password.php');
//         // exit();
//     }

//     // Status check
//     $blockedStatuses = ['graduated', 'terminated', 'suspended'];
//     if (in_array($user['status'], $blockedStatuses, true)) {
//         logAuth('LOGIN FAILED – account inactive', $email, $userType);
//         respond(false, ['message' => 'Your account is inactive. Contact the administrator.'], 403);
//     }

//     // Fetch name depending on role
//     $name = [];
//     match ($userType) {
//         'scholar' => (function () use ($pdo, $user, &$name) {
//             $s = $pdo->prepare(
//                 'SELECT first_name, last_name FROM scholars WHERE account_id = ? LIMIT 1',
//             );
//             $s->execute([$user['account_id']]);
//             $name = $s->fetch(PDO::FETCH_ASSOC) ?: [];
//         })(),
//         'staff' => (function () use ($pdo, $user, &$name) {
//             $s = $pdo->prepare(
//                 'SELECT first_name, last_name FROM staff WHERE account_id = ? LIMIT 1',
//             );
//             $s->execute([$user['account_id']]);
//             $name = $s->fetch(PDO::FETCH_ASSOC) ?: [];
//         })(),
//         'admin' => (function () use ($pdo, $user, &$name) {
//             $s = $pdo->prepare('SELECT name FROM admin WHERE id = ? LIMIT 1');
//             $s->execute([$user['account_id']]);
//             $name = $s->fetch(PDO::FETCH_ASSOC) ?: [];
//         })(),
//     };

//     // Build JWT
//     $now = time();
//     $payload = [
//         'iss' => $_ENV['ALLOWED_ORIGIN'] ?? 'app',
//         'iat' => $now,
//         'exp' => $now + Jwt::expiry(),
//         'user_id' => $user['account_id'],
//         'type' => $user['type'],
//         'account_status' => $user['status'],
//     ];

//     $jwt = FirebaseJWT::encode($payload, Jwt::secret(), 'HS256');

//     logAuth('LOGIN SUCCESS', $email, $userType);

//     $accountModel = new UserAccountModel();
//     $scholar = new ScholarModel();
//     $schoolYear = new SchoolYearModel();

//     $schoolYear = $schoolYear->getActiveSchoolYear();

//     $profile = $accountModel->getAccountProfile(
//         $user['type'] === 'scholar' ? 'applications' : 'users',
//         $user['account_id'],
//         $accountModel,
//     );
//     $scholar_type = $scholar->getScholarType($user['account_id'], $schoolYear);

//     respond(true, [
//         'token' => $jwt,
//         'user' => [
//             'user_id' => $user['account_id'],
//             'email' => $user['email'],
//             'type' => $user['type'],
//             'scholar_type' => $scholar_type,
//             'account_status' => $user['status'],
//             'first_name' => $name['first_name'] ?? null,
//             'last_name' => $name['last_name'] ?? null,
//             'profile' => $profile,
//             'name' => $name['name'] ?? null,
//         ],
//     ]);
// } catch (PDOException $e) {
//     logAuth('LOGIN ERROR – DB: ' . $e->getMessage(), $email, $userType);
//     respond(false, ['message' => 'Database error. Please try again.'], 500);
// }

try {
    $db = new Database();
    $pdo = $db->getConnection();

    /*
     * Fetch account
     */
    $stmt = $pdo->prepare(
        'SELECT 
            account_id,
            email,
            status,
            password,
            type,
            is_temporary,
            temp_password_expires_at
         FROM users
         WHERE email = ?
         AND type = ?
         LIMIT 1',
    );

    $stmt->execute([$email, $userType]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    /*
     * Always execute password_verify()
     * to reduce timing differences
     */
    $dummyHash = '$2y$10$7wWf3P6J0J9Y7k3h4Yj5Oe9u9uH4x2K5W3g3s9q8f7d6e5c4b3a2';

    $hashToCheck = $user['password'] ?? $dummyHash;

    $passwordOk = password_verify($password, $hashToCheck);

    /*
     * Generic login failure
     */
    if (!$user || !$passwordOk) {
        logAuth('LOGIN FAILED - bad credentials', $email, $userType);

        respond(
            false,
            [
                'message' => 'Invalid credentials.',
            ],
            401,
        );
    }

    /*
     * Upgrade old password hashes automatically
     */
    if (password_needs_rehash($user['password'], PASSWORD_DEFAULT)) {
        $newHash = password_hash($password, PASSWORD_DEFAULT);

        $update = $pdo->prepare(
            'UPDATE users
             SET password = ?
             WHERE account_id = ?',
        );

        $update->execute([$newHash, $user['account_id']]);
    }

    /*
     * Temporary password validation
     */
    if ((int) $user['is_temporary'] === 1) {
        if (
            empty($user['temp_password_expires_at']) ||
            new DateTime() > new DateTime($user['temp_password_expires_at'])
        ) {
            respond(
                false,
                [
                    'message' =>
                        'This temporary password has expired. Please contact your administrator.',
                ],
                401,
            );
        }
    }

    /*
     * Account status check
     */
    $blockedStatuses = ['graduated', 'terminated', 'suspended'];

    if (in_array($user['status'], $blockedStatuses, true)) {
        logAuth('LOGIN FAILED - inactive account', $email, $userType);

        respond(
            false,
            [
                'message' => 'Your account is inactive. Contact the administrator.',
            ],
            403,
        );
    }

    /*
     * Get user name
     */
    $name = [];

    switch ($userType) {
        case 'scholar':
            $s = $pdo->prepare(
                'SELECT first_name, last_name
                 FROM scholars
                 WHERE account_id = ?
                 LIMIT 1',
            );

            $s->execute([$user['account_id']]);

            $name = $s->fetch(PDO::FETCH_ASSOC) ?: [];

            break;

        case 'staff':
            $s = $pdo->prepare(
                'SELECT first_name, last_name
                 FROM staff
                 WHERE account_id = ?
                 LIMIT 1',
            );

            $s->execute([$user['account_id']]);

            $name = $s->fetch(PDO::FETCH_ASSOC) ?: [];

            break;

        case 'admin':
            $s = $pdo->prepare(
                'SELECT name
                 FROM admin
                 WHERE id = ?
                 LIMIT 1',
            );

            $s->execute([$user['account_id']]);

            $name = $s->fetch(PDO::FETCH_ASSOC) ?: [];

            break;
    }

    /*
     * Create JWT
     */
    $now = time();

    $payload = [
        'iss' => $_ENV['ALLOWED_ORIGIN'] ?? 'app',

        'iat' => $now,

        'nbf' => $now,

        'exp' => $now + Jwt::expiry(),

        'jti' => bin2hex(random_bytes(16)),

        'user_id' => $user['account_id'],

        'type' => $user['type'],

        'account_status' => $user['status'],
    ];

    $jwt = FirebaseJWT::encode($payload, Jwt::secret(), 'HS256');

    logAuth('LOGIN SUCCESS', $email, $userType);

    /*
     * Load additional data
     */
    $accountModel = new UserAccountModel();
    $scholarModel = new ScholarModel();
    $schoolYearModel = new SchoolYearModel();

    $schoolYear = $schoolYearModel->getActiveSchoolYear();

    $profile = $accountModel->getAccountProfile(
        $user['type'] === 'scholar' ? 'applications' : 'users',
        $user['account_id'],
        $accountModel,
    );

    $scholarType = $scholarModel->getScholarType($user['account_id'], $schoolYear);

    /*
     * Response
     */
    respond(true, [
        'token' => $jwt,

        'user' => [
            'user_id' => $user['account_id'],

            'email' => $user['email'],

            'type' => $user['type'],

            'scholar_type' => $scholarType,

            'account_status' => $user['status'],

            'first_name' => $name['first_name'] ?? null,

            'last_name' => $name['last_name'] ?? null,

            'name' => $name['name'] ?? null,

            'profile' => $profile,
        ],
    ]);
} catch (PDOException $e) {
    /*
     * Log internally only
     */
    error_log($e->getMessage());

    logAuth('LOGIN ERROR - DATABASE', $email, $userType);

    respond(
        false,
        [
            'message' => 'Internal server error.',
        ],
        500,
    );
}
