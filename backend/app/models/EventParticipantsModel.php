<?php

namespace App\Models;

use Config\Database;

class EventParticipantsModel
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function addParticipant($eventId, $userId)
    {
        $query =
            'INSERT INTO event_participants (event_id, account_id) VALUES (:event_id, :user_id)';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId);
        $stmt->bindParam(':user_id', $userId);
        return $stmt->execute();
    }

    public function setScholarAsAttended($eventId, $accountId)
    {
        $query =
            "UPDATE event_participants SET is_attended = '1' WHERE event_id = :event_id AND account_id = :account_id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId);
        $stmt->bindParam(':account_id', $accountId);
        $stmt->execute();
    }

    public function removeParticipant($eventId, $userId)
    {
        $query =
            'DELETE FROM event_participants WHERE event_id = :event_id AND account_id = :user_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId);
        $stmt->bindParam(':user_id', $userId);
        return $stmt->execute();
    }

    public function getParticipantsById($eventId)
    {
        $query = 'SELECT account_id FROM event_participants WHERE event_id = :event_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function checkUserParticipation($eventId, $scholarId)
    {
        $query =
            'SELECT COUNT(*) FROM event_participants WHERE event_id = :event_id AND account_id = :account_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        $stmt->bindParam(':account_id', $scholarId, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    public function checkEventExists($eventId)
    {
        $query = 'SELECT COUNT(*) FROM events WHERE id = :event_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    public function addReason($eventId, $accountId, $reason)
    {
        $query =
            "INSERT INTO event_participants SET is_not_available = '1', reason = :reason WHERE event_id = :event_id AND account_id = :account_id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':reason', $reason);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        $stmt->bindParam(':account_id', $accountId, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deleteEventParticipants($eventId)
    {
        $query = 'DELETE FROM event_participants WHERE event_id = :event_id';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        return $stmt->execute();
    }
}

?>
