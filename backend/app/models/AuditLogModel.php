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
            " 
                  SET name = :name";

        $stmt = $this->pdo->prepare($query);
        $name = strip_tags($data);
        $stmt->bindParam(':name', $name);
        return $stmt->execute();
    }

    public function getAuditLogs()
    {
        $query = 'SELECT * FROM ' . $this->table_name;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}
?>
