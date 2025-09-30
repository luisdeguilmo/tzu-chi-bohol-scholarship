<?php

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/app/services/PHPMailerBrevoService.php'; // Add this line

// Load environment variables
try {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->safeLoad();
} catch (\Exception $e) {
    error_log('Could not load .env file: ' . $e->getMessage());
}

date_default_timezone_set('Asia/Manila');

use App\Models\NotificationsModel;
use App\Models\StaffAccountModel;
use Config\Database;
use App\Services\PHPMailerBrevoService;

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

$db = new Database();
$pdo = $db->getConnection();

$yesterday = date('Y-m-d', strtotime('-1 day'));
$currentDate = date('F j, Y');
$previousDate = date('F j, Y', strtotime('-1 day'));

$stmt = $pdo->prepare('SELECT COUNT(*) as total FROM application_info WHERE DATE(created_at) = ?');
$stmt->execute([$yesterday]);
$result = $stmt->fetch(\PDO::FETCH_ASSOC);
$total = $result['total'] ?? 0;

if ($total > 0) {
    $staffModel = new StaffAccountModel();
    $notification = new NotificationsModel();

    // $staff = $staffModel->getStaffInfoById(8725963);

    // if (!$emailService->sendDailyDigest($staff, $total)) {
    //     throw new \Exception('Failed to send email');
    // }

    // if (!$notification->createDailyDigest($total)) {
    //     throw new \Exception('Failed to create notification');
    // }

    $staffs = $staffModel->getAllStaffs();

    foreach ($staffs as $staff) {
        if (!$emailService->sendDailyDigest($staff, $total, $currentDate, $previousDate)) {
            throw new \Exception('Failed to send email');
        }
    }

    if (!$notification->createDailyDigest($total, $currentDate, $previousDate)) {
        throw new \Exception('Failed to create notification');
    }

    // $pdo->commit();
}

?>
