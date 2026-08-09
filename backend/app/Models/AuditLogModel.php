<?php
namespace App\Models;
use Config\Database;

date_default_timezone_set('Asia/Manila');

class AuditLogModel
{
    private $pdo;
    public $table_name = 'audit_logs';

    public function __construct()
    {
        header('Content-Type: application/json');
        // Set timezone and initialize date/time properties in constructor
        date_default_timezone_set('Asia/Manila');

        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($data)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " SET user_id = :user_id,
                actor = :actor,
                user_role = :user_role,
                action = :action,
                entity_type = :entity_type,
                entity_id = :entity_id,
                description = :description,
                old_values = :old_values,
                new_values = :new_values,
                ip_address = :ip_address,
                user_agent = :user_agent";

        $stmt = $this->pdo->prepare($query);

        $oldValues = isset($data['old_values']) ? json_encode($data['old_values']) : null;
        $newValues = isset($data['new_values']) ? json_encode($data['new_values']) : null;

        $stmt->bindParam(':user_id', $data['user_id']);
        $stmt->bindParam(':actor', $data['actor']);
        $stmt->bindParam(':user_role', $data['user_role']);
        $stmt->bindParam(':action', $data['action']);
        $stmt->bindParam(':entity_type', $data['entity_type']);
        $stmt->bindParam(':entity_id', $data['entity_id']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':old_values', $oldValues);
        $stmt->bindParam(':new_values', $newValues);
        $stmt->bindParam(':ip_address', $data['ip_address']);
        $stmt->bindParam(':user_agent', $data['user_agent']);
        return $stmt->execute();
    }

    public function getAuditLogs()
    {
        $query = "
            SELECT
                al.*,

                sc.first_name AS scholar_first_name,
                sc.last_name  AS scholar_last_name,

                st.first_name AS staff_first_name,
                st.last_name  AS staff_last_name,

                ad.name AS admin_name

            FROM {$this->table_name} al

            LEFT JOIN scholars sc
                ON sc.account_id = al.user_id AND al.user_role = 'scholar'

            LEFT JOIN staff st
                ON st.account_id = al.user_id AND al.user_role = 'staff'

            LEFT JOIN admin ad
                ON ad.id = al.user_id AND al.user_role = 'admin'

            ORDER BY al.created_at DESC
        ";

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}
?>
