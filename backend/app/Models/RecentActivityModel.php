<?php

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class RecentActivityModel
{
    private $table_name = 'recent_activities';
    private $startOfMonth;
    private $startOfNextMonth;
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->startOfMonth = date('Y-m-01');
        $this->startOfNextMonth = date('Y-m-01', strtotime('first day of next month'));
    }

    public function getRecentActivities($id)
    {
        $query =
            'SELECT id, activity_name, activity_date, activity_start_time, activity_end_time, activity_location, rendered_hours FROM ' .
            $this->table_name .
            ' WHERE scholar_id = :scholar_id AND activity_date >= :start_of_month AND activity_date < :start_of_next_month ORDER BY activity_date DESC, activity_start_time DESC';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $id);
        $stmt->bindParam(':start_of_month', $this->startOfMonth);
        $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function createRecentCommunityService($data)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            ' SET activity_id = :activity_id, scholar_id = :scholar_id, activity_type = :activity_type, activity_name = :activity_name, activity_date = :activity_date, activity_start_time = :start_time, activity_end_time = :end_time, activity_location = :activity_location, rendered_hours = :rendered_hours, created_at = NOW()';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':activity_id', $data['id']);
        $stmt->bindParam(':scholar_id', $data['account_id']);
        $stmt->bindParam(':activity_type', $data['activity_type']);
        $stmt->bindParam(':activity_name', $data['activity_name']);
        $stmt->bindParam(':activity_date', $data['activity_date']);
        $stmt->bindParam(':start_time', $data['start_time']);
        $stmt->bindParam(':end_time', $data['end_time']);
        $stmt->bindParam(':activity_location', $data['activity_location']);
        $stmt->bindParam(':rendered_hours', $data['rendered_hours']);
        return $stmt->execute();
    }

    public function createRecentEvent($scholarId, $data)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            ' SET activity_id = :activity_id, scholar_id = :scholar_id, activity_type = :activity_type, activity_name = :activity_name, activity_date = :activity_date, activity_start_time = :start_time, activity_end_time = :end_time, activity_location = :activity_location, rendered_hours = :rendered_hours, created_at = NOW()';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':activity_id', $data['event_id']);
        $stmt->bindParam(':scholar_id', $scholarId);
        $stmt->bindParam(':activity_type', $data['event_type']);
        $stmt->bindParam(':activity_name', $data['event_name']);
        $stmt->bindParam(':activity_date', $data['event_date']);
        $stmt->bindParam(':start_time', $data['event_start_time']);
        $stmt->bindParam(':end_time', $data['event_end_time']);
        $stmt->bindParam(':activity_location', $data['event_location']);
        $stmt->bindParam(':rendered_hours', $data['rendered_hours']);
        return $stmt->execute();
    }

    public function removeRecentActivityById($id)
    {
        $query = 'DELETE FROM ' . $this->table_name . ' WHERE activity_id = :activity_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':activity_id', $id, \PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>
