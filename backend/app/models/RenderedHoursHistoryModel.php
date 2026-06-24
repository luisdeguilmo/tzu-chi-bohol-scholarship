<?php

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class RenderedHoursHistoryModel
{
    private $table_name = 'rendered_hours_history';
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getRenderedHoursHistory($id)
    {
        $query = "
        SELECT 
            DATE_FORMAT(created_at, '%M %Y') AS month_group,
            id,
            scholar_id,
            transaction_type,
            event_name,
            source_type,
            hours,
            created_at
        FROM {$this->table_name}
        WHERE scholar_id = :scholar_id
        ORDER BY created_at DESC
    ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $id);
        $stmt->execute();

        $results = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        // Group records by month
        $grouped = [];

        foreach ($results as $row) {
            $month = $row['month_group'];

            if (!isset($grouped[$month])) {
                $grouped[$month] = [];
            }

            $grouped[$month][] = [
                'id' => $row['id'],
                'scholar_id' => $row['scholar_id'],
                'transaction_type' => $row['transaction_type'],
                'event_name' => $row['event_name'],
                'source_type' => $row['source_type'],
                'hours' => $row['hours'],
                'created_at' => $row['created_at'],
            ];
        }

        return $grouped;
    }

    public function createHistory($data)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            ' SET scholar_id = :scholar_id, transaction_type = :transaction_type, event_name = :event_name, source_type = :source_type, hours = :hours, created_at = NOW()';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $data['account_id']);
        $stmt->bindParam(':transaction_type', $data['transaction_type']);
        $stmt->bindParam(':event_name', $data['event_name']);
        $stmt->bindParam(':source_type', $data['source_type']);
        $stmt->bindParam(':hours', $data['hours']);
        return $stmt->execute();
    }
}
?>
