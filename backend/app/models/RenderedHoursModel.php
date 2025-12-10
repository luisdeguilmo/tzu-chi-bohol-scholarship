<?php

namespace App\Models;

use Config\Database;

class RenderedHoursModel
{
    public $table_name = 'scholars';
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function recordHours($accountId)
    {
        $communityServiceRenderedHours = $this->getScholarCommunityServiceRenderedHoursById(
            $accountId,
        );
        $eventRenderedHours = $this->getScholarEventRenderedHoursById($accountId);

        if ($communityServiceRenderedHours === null) {
            throw new \Exception('Scholar not found');
        }

        if ($eventRenderedHours === null) {
            throw new \Exception('Scholar not found');
        }

        $query =
            'UPDATE ' .
            $this->table_name .
            ' SET rendered_hours = :rendered_hours WHERE account_id = :account_id';

        $stmt = $this->pdo->prepare($query);

        $rendered_hours = strip_tags($communityServiceRenderedHours + $eventRenderedHours);

        $stmt->bindParam(':rendered_hours', $rendered_hours);
        $stmt->bindParam(':account_id', $accountId);

        return $stmt->execute();
    }

    public function addCommunityServiceEntry($data)
    {
        $query =
            'INSERT INTO community_service_entries (activity_id, scholar_id, hours_earned, date_served, description, created_at) VALUES (:activity_id, :account_id, :hours_earned, :date_served, :description, NOW())';
        $stmt = $this->pdo->prepare($query);

        $id = strip_tags($data['id']);
        $account_id = strip_tags($data['account_id']);
        $hours = strip_tags($data['rendered_hours']);
        $date = strip_tags($data['activity_date']);
        $description = strip_tags($data['activity_name']);

        $stmt->bindParam(':activity_id', $id, \PDO::PARAM_INT);
        $stmt->bindParam(':account_id', $account_id, \PDO::PARAM_INT);
        $stmt->bindParam(':hours_earned', $hours, \PDO::PARAM_INT);
        $stmt->bindParam(':date_served', $date);
        $stmt->bindParam(':description', $description);
        return $stmt->execute();
    }

    public function removeCommunityServiceEntry($id)
    {
        $query = 'DELETE FROM community_service_entries WHERE activity_id = :activity_id';
        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':activity_id', $id, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function recordCommunityServiceRenderedHours($accountId, $renderedHours)
    {
        $scholarRenderedHours = $this->getScholarCommunityServiceRenderedHoursById($accountId);
        if ($scholarRenderedHours === null) {
            throw new \Exception('Scholar not found');
        }

        $query =
            'UPDATE ' .
            $this->table_name .
            ' SET community_service_rendered_hours = :rendered_hours WHERE account_id = :account_id';

        $stmt = $this->pdo->prepare($query);

        $rendered_hours = strip_tags($renderedHours + $scholarRenderedHours);

        $stmt->bindParam(':rendered_hours', $rendered_hours);
        $stmt->bindParam(':account_id', $accountId);

        return $stmt->execute();
    }

    public function revokeRecordedCommunityServiceRenderedHours($accountId, $renderedHours)
    {
        $scholarRenderedHours = $this->getScholarCommunityServiceRenderedHoursById($accountId);

        if ($scholarRenderedHours === null) {
            throw new \Exception('Scholar not found');
        }

        $rendered_hours = $scholarRenderedHours - $renderedHours;

        if ($rendered_hours < 0) {
            throw new \Exception('Rendered hours cannot be negative');
        }

        $query =
            'UPDATE ' .
            $this->table_name .
            ' SET community_service_rendered_hours = :rendered_hours
              WHERE account_id = :account_id';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':rendered_hours', $rendered_hours, \PDO::PARAM_INT);
        $stmt->bindParam(':account_id', $accountId, \PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function recordEventRenderedHours($accountId, $renderedHours)
    {
        $scholarRenderedHours = $this->getScholarEventRenderedHoursById($accountId);
        if ($scholarRenderedHours === null) {
            throw new \Exception('Scholar not found');
        }

        $query =
            'UPDATE ' .
            $this->table_name .
            ' SET event_rendered_hours = :rendered_hours WHERE account_id = :account_id';

        $stmt = $this->pdo->prepare($query);

        $rendered_hours = strip_tags($renderedHours + $scholarRenderedHours);

        $stmt->bindParam(':rendered_hours', $rendered_hours);
        $stmt->bindParam(':account_id', $accountId);

        return $stmt->execute();
    }

    public function AttendedEvents($accountId)
    {
        $scholarAttendedEvents = $this->getScholarAttendedEventsById($accountId);
        if ($scholarAttendedEvents === null) {
            throw new \Exception('Scholar not found');
        }

        $query =
            'UPDATE ' .
            $this->table_name .
            ' SET attended_events = :attended_events WHERE account_id = :account_id';

        $stmt = $this->pdo->prepare($query);

        $attended_events = strip_tags(1 + $scholarAttendedEvents);

        $stmt->bindParam(':attended_events', $attended_events);
        $stmt->bindParam(':account_id', $accountId);

        return $stmt->execute();
    }

    public function getScholarById($account_id)
    {
        $query = 'SELECT * FROM ' . $this->table_name . ' WHERE account_id = :account_id';
        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':account_id', $account_id);
        $stmt->execute();

        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getScholarRenderedHoursById($account_id)
    {
        $query =
            'SELECT rendered_hours FROM ' . $this->table_name . ' WHERE account_id = :account_id';

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':account_id', $account_id, \PDO::PARAM_INT);

        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            // Return the complete URL to access the file
            return $row['rendered_hours'];
        }

        return null;
    }

    public function getScholarCommunityServiceRenderedHoursById($account_id)
    {
        $query =
            'SELECT community_service_rendered_hours FROM ' .
            $this->table_name .
            ' WHERE account_id = :account_id';

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':account_id', $account_id, \PDO::PARAM_INT);

        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            // Return the complete URL to access the file
            return $row['community_service_rendered_hours'];
        }

        return null;
    }

    public function getScholarEventRenderedHoursById($account_id)
    {
        $query =
            'SELECT event_rendered_hours FROM ' .
            $this->table_name .
            ' WHERE account_id = :account_id';

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':account_id', $account_id, \PDO::PARAM_INT);

        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            // Return the complete URL to access the file
            return $row['event_rendered_hours'];
        }

        return null;
    }

    public function getScholarAttendedEventsById($account_id)
    {
        $query =
            'SELECT attended_events FROM ' . $this->table_name . ' WHERE account_id = :account_id';

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':account_id', $account_id, \PDO::PARAM_INT);

        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            // Return the complete URL to access the file
            return $row['attended_events'];
        }

        return null;
    }
}

?>
