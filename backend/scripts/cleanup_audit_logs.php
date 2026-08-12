<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../app/Models/AuditLogRetentionModel.php';

use App\Models\AuditLogRetentionModel;
use Config\Database;

// Reject execution over the web — this is a CLI-only maintenance script.
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    echo "Forbidden: this script may only be run from the command line.\n";
    exit(1);
}

function logLine(string $message): void
{
    $ts = date('Y-m-d H:i:s');
    echo "[$ts] $message\n";
}

try {
    $db = new Database();
    $pdo = $db->getConnection();

    $currentDateTime = date('Y-m-d H:i:s');

    $log_retention_model = new AuditLogRetentionModel();
    $log_retention = $log_retention_model->getLogRetention();

    $allowedRetention = ['7', '30', '90', '180', '365'];

    if ($log_retention === 'never') {
        logLine('Audit log retention is set to never. No logs deleted.');
        exit(0);
    }

    if (!in_array((string) $log_retention, $allowedRetention, true)) {
        throw new RuntimeException('Invalid audit log retention value.');
    }

    $logRetentionDays = (int) $log_retention;

    if ($logRetentionDays <= 0) {
        throw new RuntimeException('Invalid audit log retention value.');
    }

    $stmt = $pdo->prepare(
        "DELETE FROM audit_logs
     WHERE created_at < DATE_SUB(NOW(), INTERVAL {$logRetentionDays} DAY)",
    );

    $stmt->execute();

    $auditLogDeleted = $stmt->rowCount();

    logLine("Deleted {$auditLogDeleted} audit log(s).");

    exit(0);
} catch (\Throwable $e) {
    error_log('[cleanup_audit_logs.php] ' . $e->getMessage());
    logLine('ERROR: ' . $e->getMessage());
    exit(1);
}
