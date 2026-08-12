<?php

namespace App\Models;

use Config\Database;

class AuditLogRetentionModel
{
    private $table_name = 'settings';

    public $id;
    public $score;
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getLogRetention()
    {
        $query = 'SELECT log_retention FROM ' . $this->table_name;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            return $row['log_retention'];
        }

        return null;
    }

    public function updateLogRetention($data)
    {
        try {
            $query = 'UPDATE ' . $this->table_name . ' SET log_retention = :log_retention';
            $stmt = $this->pdo->prepare($query);

            $log_retention = htmlspecialchars(strip_tags($data['log_retention']));

            $stmt->bindParam(':log_retention', $log_retention);

            return $stmt->execute();
        } catch (\Exception $e) {
            error_log('createScore error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function runLogRetention()
    {
        $log_retention = $this->getLogRetention();
        $logRetentionDays = (int) $log_retention;

        if ($logRetentionDays < 0) {
            throw new \Exception('Invalid audit log retention period.');
        }

        $stmt = $this->pdo->prepare(
            "DELETE FROM audit_logs
     WHERE created_at < DATE_SUB(NOW(), INTERVAL {$logRetentionDays} DAY)",
        );

        $stmt->execute();
    }
}
?>
