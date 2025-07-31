<?php

namespace App\Models;

use Config\Database;

class ArchivedActivitiesModel {
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function archiveActivity($data) {
        $query = "INSERT INTO archived_activities (account_id, activity_id, activity_type, archived_at) VALUES (:account_id, :activity_id, :activity_type, NOW())";

        $stmt = $this->pdo->prepare($query);

        $account_id = htmlspecialchars(strip_tags($data['account_id']));
        $activity_id = htmlspecialchars(strip_tags($data['activity_id']));
        $activity_type = htmlspecialchars(strip_tags($data['activity_type']));

        $stmt->bindParam(':account_id', $account_id, \PDO::PARAM_INT);
        $stmt->bindParam(':activity_id', $activity_id, \PDO::PARAM_INT);
        $stmt->bindParam(':activity_type', $activity_type);

        return $stmt->execute();
    }

    public function unArchiveActivity($data) {
        $query = "DELETE FROM archived_activities WHERE account_id = :account_id AND activity_id = :activity_id AND activity_type = :activity_type";

        $stmt = $this->pdo->prepare($query);

        $account_id = htmlspecialchars(strip_tags($data['account_id']));
        $activity_id = htmlspecialchars(strip_tags($data['activity_id']));
        $activity_type = htmlspecialchars(strip_tags($data['activity_type']));

        $stmt->bindParam(':account_id', $account_id, \PDO::PARAM_INT);
        $stmt->bindParam(':activity_id', $activity_id, \PDO::PARAM_INT);
        $stmt->bindParam(':activity_type', $activity_type);

        return $stmt->execute();
    }

    public function getArchivedActivityIds($account_id, $tab) {
        $query = "";

        if ($tab === 'all') {
            $query = "SELECT * FROM archived_activities WHERE account_id = :account_id";
        } else if ($tab === 'volunteer_activities') {
            $query = "SELECT * FROM archived_activities WHERE account_id = :account_id AND activity_type = 'volunteer'";
        } else if ($tab === 'events') {
            $query = "SELECT * FROM archived_activities WHERE account_id = :account_id AND activity_type = 'event'";
        }

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam('account_id', $account_id, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getArchivedActivities($id, $tab) {
        $activities = $this->getArchivedActivityIds($id, $tab);
        if (!$activities) {
            throw new \Error("No archived activities.");
        }

        $data = [];

        foreach ($activities as $activity) {
            if ($activity['activity_type'] == 'event') {
                $data[] = $this->getArchivedEvent($activity['activity_id']);
            } else if ($activity['activity_type'] == 'volunteer') {
                $data[] = $this->getArchivedVolunteerActivity($activity['activity_id']);
            }
        }

        return $data;
    }

    public function getArchivedEvent($id) {
        $query = "SELECT * FROM events WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getArchivedVolunteerActivity($id) {
        $query = "SELECT * FROM volunteer_activities WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    // public function getArchivedActivities() {
    //     $firstQuery = "SELECT * FROM volunteer_activities WHERE is_archived = 1";
    //     $secondQuery = "SELECT * FROM events WHERE is_archived = 1";

    //     $firstStmt = $this->pdo->prepare($firstQuery);
    //     $secondStmt = $this->pdo->prepare($secondQuery);

    //     $firstStmt->execute();
    //     $secondStmt->execute();

    //     $volunteerActivities = $firstStmt->fetchAll(\PDO::FETCH_ASSOC);
    //     $events = $secondStmt->fetchAll(\PDO::FETCH_ASSOC);

    //     $data = array_merge($volunteerActivities, $events);

    //     return $data;
    // }
}

?>