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

    public function getPrivateCommentById($id)
    {
        $query = 'SELECT id FROM private_comments WHERE id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getUnreadScholarPrivateCommentsByEventId($eventId)
    {
        $query = 'SELECT COUNT(*) as total
                FROM private_comments
                WHERE event_id = :event_id AND is_read = 0 AND staff_id IS NULL';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['total'] ?? 0;
    }

    public function getUnreadStaffPrivateCommentsByEventId($eventId, $accountId)
    {
        $query = 'SELECT COUNT(*) as total
                FROM private_comments
                WHERE event_id = :event_id AND scholar_id = :scholar_id AND is_read = 0 AND staff_id IS NOT NULL';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        $stmt->bindParam(':scholar_id', $accountId, \PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['total'] ?? 0;
    }

    public function getScholarUnreadCommentsByScholarId($scholarId)
    {
        $query = 'SELECT COUNT(*) as total
                FROM private_comments
                WHERE scholar_id = :scholar_id AND is_read = 0 AND staff_id IS NOT NULL';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId, \PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['total'] ?? 0;
    }

    public function getStaffUnreadComments()
    {
        $query = 'SELECT COUNT(*) as total
                FROM private_comments
                WHERE is_read = 0 AND staff_id IS NULL';
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['total'] ?? 0;
    }

    public function getPrivateCommentsByScholarId($eventId, $accountId)
    {
        $query = 'SELECT id, first_name, last_name, created_at, message
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
        $query = 'SELECT id, scholar_id, first_name, last_name, created_at, message
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

    public function addPrivateComment(
        $eventId,
        $accountId,
        $staffId,
        $reason,
        $firstName,
        $lastName,
    ) {
        $query =
            'INSERT INTO private_comments SET scholar_id = :account_id, staff_id = :staff_id, message = :reason, event_id = :event_id, first_name = :first_name, last_name = :last_name, created_at = NOW()';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':reason', $reason);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        $stmt->bindParam(':account_id', $accountId, \PDO::PARAM_INT);
        $stmt->bindParam(':staff_id', $staffId, \PDO::PARAM_INT);
        $stmt->bindParam(':first_name', $firstName);
        $stmt->bindParam(':last_name', $lastName);
        return $stmt->execute();
    }

    public function markStaffCommentsAsRead($eventId, $accountId)
    {
        $query =
            'UPDATE private_comments SET is_read = 1 WHERE event_id = :event_id AND scholar_id = :scholar_id AND staff_id IS NOT NULL AND is_read = 0';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        $stmt->bindParam(':scholar_id', $accountId, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function markScholarCommentsAsRead($eventId)
    {
        $query =
            'UPDATE private_comments SET is_read = 1 WHERE event_id = :event_id AND staff_id IS NULL AND is_read = 0';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deletePrivateComment($id)
    {
        $query = 'DELETE FROM private_comments WHERE id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        return $stmt->execute();
    }
}

?>
