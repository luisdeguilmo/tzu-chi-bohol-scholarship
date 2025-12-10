<?php

namespace App\Models;

use Config\Database;

class PrivateCommentsModel
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getPrivateCommentsByScholarId($eventId, $accountId)
    {
        $query = 'SELECT *
                FROM private_comments
                WHERE event_id = :event_id AND scholar_id = :scholar_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $accountId, \PDO::PARAM_INT);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getPrivateComments($eventId)
    {
        $query = 'SELECT *
                FROM private_comments
                WHERE event_id = :event_id
                ORDER BY event_id, id;
                ';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        // $stmt->bindParam(':account_id', $accountId, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function addPrivateComment($eventId, $accountId, $reason, $firstName, $lastName)
    {
        $query =
            'INSERT INTO private_comments SET scholar_id = :account_id, message = :reason, event_id = :event_id, first_name = :first_name, last_name = :last_name, created_at = NOW()';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':reason', $reason);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        $stmt->bindParam(':account_id', $accountId, \PDO::PARAM_INT);
        $stmt->bindParam(':first_name', $firstName);
        $stmt->bindParam(':last_name', $lastName);
        return $stmt->execute();
    }
}

?>
