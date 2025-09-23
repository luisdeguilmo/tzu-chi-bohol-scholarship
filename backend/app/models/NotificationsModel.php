<?php 

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class NotificationsModel {
    private $table_one_name = "notifications";
    private $table_two_name = "user_notifications";

    public $id;
    public $batch_name;
    public $schedule;
    private $currentYear;
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->currentYear = 2024;
    }

    public function getAllNotifications($id) {
        $query = "SELECT n.id, n.type, n.title, n.message, un.is_read, n.created_at 
                  FROM " . $this->table_one_name . " n JOIN " . $this->table_two_name . " un ON n.id = un.notification_id WHERE un.user_id = :id AND un.is_deleted = 0
                  ORDER BY n.created_at DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getCommunityServiceDetails($id) {
        $query = "SELECT * FROM volunteer_activities WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function createEventNotification($data) {
        $id = $this->createNotification([
            'type' => 'event',
            'title' => 'New Event',
            'message' => 'A new event "' . $data['event_name'] . '" has been created and you’re invited to join!. Check it out and don’t miss the chance to be part of this event!'
        ]);

        if ($id) {
            return $this->createUsersNotification($id);
        } else {
            return false;
        }
    }
 
    public function createActivityNotification($data) {
        $communityService = $this->getCommunityServiceDetails($data['id']);
        $status = $communityService['activity_status'];
        $message = "";

        if ($status === 'Recorded') {
            $message = 'Your community service ' . $communityService['activity_name'] . ' has been successfully recorded.';
        } else if ($status === 'Not Recorded') {
            $message = 'Your community service ' . $communityService['activity_name'] . ' was not recorded. Please check the feedback for details.';
        }

        $id = $this->createNotification([
            'type' => 'community_service',
            'title' => 'Community Service Status',
            'message' => $message
        ]);

        if ($id) {
            return $this->createUserNotification($data['account_id'], $id);
        } else {
            return false;
        }
    }

    public function createNotification($data) {
        $type = $data['type'];
        $title = $data['title'];
        $message = $data['message'];

        $query = "INSERT INTO notifications (type, title, message) VALUES (:type, :title, :message)";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':message', $message);
        
        if ($stmt->execute()) {
            return $this->pdo->lastInsertId();
        } else {
            return false;
        }
    }

    public function createUserNotification($userId, $notificationId) {
        $query = "INSERT INTO user_notifications (user_id, notification_id) VALUES (:user_id, :notification_id)";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':notification_id', $notificationId);
        
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function createUsersNotification($notificationId) {
        $query = "INSERT INTO user_notifications (user_id, notification_id) SELECT account_id, :notification_id FROM scholars";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':notification_id', $notificationId);
        
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function markAsRead($userId, $notificationId) {
        $query = "UPDATE user_notifications SET is_read = 1 WHERE user_id = :user_id AND notification_id = :notification_id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':notification_id', $notificationId);
        return $stmt->execute();
    }
 
    public function deleteNotification($id) {
        $query = "DELETE FROM notifications WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function deleteUserNotification($id) {
        $query = "DELETE FROM user_notifications WHERE notification_id = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function deleteUserEventNotification($userId, $notificationId) {
        $query = "DELETE FROM user_notifications WHERE user_id = :user_id AND notification_id = :notification_id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':notification_id', $notificationId);
        return $stmt->execute();
    }
}
?>