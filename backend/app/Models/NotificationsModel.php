<?php

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class NotificationsModel
{
    private $table_one_name = 'notifications';
    private $table_two_name = 'user_notifications';

    public $id;
    public $batch_name;
    public $schedule;
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getAllNotifications($id)
    {
        $query =
            "SELECT n.id, n.type, n.title, n.message, un.is_read, n.created_at 
                  FROM " .
            $this->table_one_name .
            ' n JOIN ' .
            $this->table_two_name .
            " un ON n.id = un.notification_id WHERE un.user_id = :id AND un.is_deleted = 0
                  ORDER BY n.created_at DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getCommunityServiceDetails($id)
    {
        $query = 'SELECT activity_status, activity_name FROM volunteer_activities WHERE id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getLastPendingScholarNotification($currentYear)
    {
        $query =
            "SELECT message, created_at FROM notifications WHERE type = 'pending_scholars' AND YEAR(created_at) = :year ORDER BY created_at DESC LIMIT 1";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':year', $currentYear);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    // Staff
    public function createDailyDigest($total, $currentDate, $previousDate)
    {
        $id = $this->createNotification([
            'type' => 'application',
            'title' => 'Daily Scholarship Application Update - ' . $currentDate,
            'message' =>
                'A total of ' .
                $total .
                ' new scholarship applications were submitted on ' .
                $previousDate .
                '.',
        ]);

        if ($id) {
            return $this->createStaffNotification($id);
        } else {
            return false;
        }
    }

    public function createNotificationForSubmittedCommunityService($data)
    {
        $id = $this->createNotification([
            'type' => 'community_service',
            'title' => 'New Community Service Submitted',
            'message' =>
                $data['first_name'] .
                ' ' .
                $data['last_name'] .
                ' has submitted a new Community Service Report.',
        ]);

        if ($id) {
            return $this->createStaffNotification($id);
        } else {
            return false;
        }
    }

    public function createNotificationForSubmittedCoeGrades($data)
    {
        $id = $this->createNotification([
            'type' => 'coe_grades',
            'title' => 'COE and Grades Submitted',
            'message' =>
                $data['first_name'] .
                ' ' .
                $data['last_name'] .
                ' has submitted Certificate of Enrollment and Grades.',
        ]);

        if ($id) {
            return $this->createStaffNotification($id);
        } else {
            return false;
        }
    }

    public function createNewPendingScholarsNotification($pendingScholarsCount)
    {
        $id = $this->createNotification([
            'type' => 'pending_scholars',
            'title' => 'New Scholar Account Awaiting Approval',
            'message' => $pendingScholarsCount . ' scholar accounts are now pending approval.',
        ]);

        if ($id) {
            return $this->createAdminNotification($id);
        } else {
            return false;
        }
    }

    // Scholar
    public function createEventNotification($data)
    {
        $id = $this->createNotification([
            'type' => 'event',
            'title' => 'New Event',
            'message' =>
                'A new event ' .
                $data['event_name'] .
                " has been created and you are invited to join!. Check it out and don't miss the chance to be part of this event!",
        ]);

        if ($id) {
            return $this->createUsersNotification($id);
        } else {
            return false;
        }
    }

    public function createRenewalApplicationPeriodNotification($data)
    {
        $id = $this->createNotification([
            'type' => 'application_period',
            'title' => 'Renewal Application Open',
            'message' => $data['announcementMessage'],
        ]);

        if ($id) {
            return $this->createUsersNotification($id);
        } else {
            return false;
        }
    }

    public function createActivityNotification($data)
    {
        $communityService = $this->getCommunityServiceDetails($data['id']);
        $status = $communityService['activity_status'];
        $message = '';

        if ($status === 'Recorded') {
            $message =
                'Your community service ' .
                $communityService['activity_name'] .
                ' has been successfully recorded.';
        } elseif ($status === 'Not Recorded') {
            $message =
                'Your community service ' .
                $communityService['activity_name'] .
                ' was not recorded. Please check the feedback for details.';
        }

        $id = $this->createNotification([
            'type' => 'community_service',
            'title' => 'Community Service Status',
            'message' => $message,
        ]);

        if ($id) {
            return $this->createUserNotification($data['account_id'], $id);
        } else {
            return false;
        }
    }

    public function createScholarUnreadCommentsNotification($scholarId)
    {
        $model = new PrivateCommentsModel();
        $numberOfUnreadComments = $model->getScholarUnreadCommentsByScholarId($scholarId);
        $message = '';

        $totalComments = $numberOfUnreadComments > 1 ? 'comments.' : 'comment.';

        $message = 'Your have ' . $numberOfUnreadComments . ' new unread ' . $totalComments;

        $id = $this->createNotification([
            'type' => 'private_comments',
            'title' => 'Unread Private Comments',
            'message' => $message,
        ]);

        if ($id) {
            return $this->createUserNotification($scholarId, $id);
        } else {
            return false;
        }
    }

    public function createStaffUnreadCommentsNotification()
    {
        $model = new PrivateCommentsModel();
        $numberOfUnreadComments = $model->getStaffUnreadComments();
        $message = '';

        $totalComments = $numberOfUnreadComments > 1 ? 'comments.' : 'comment.';

        $message = 'Your have ' . $numberOfUnreadComments . ' new unread ' . $totalComments;

        $id = $this->createNotification([
            'type' => 'private_comments',
            'title' => 'Unread Private Comments',
            'message' => $message,
        ]);

        if ($id) {
            return $this->createStaffNotification($id);
        } else {
            return false;
        }
    }

    public function createNotification($data)
    {
        $type = $data['type'];
        $title = $data['title'];
        $message = $data['message'];

        $query =
            'INSERT INTO notifications (type, title, message) VALUES (:type, :title, :message)';
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

    public function createUserNotification($userId, $notificationId)
    {
        $query =
            'INSERT INTO user_notifications (user_id, notification_id) VALUES (:user_id, :notification_id)';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':notification_id', $notificationId);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function createUsersNotification($notificationId)
    {
        $query =
            'INSERT INTO user_notifications (user_id, notification_id) SELECT account_id, :notification_id FROM scholars';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':notification_id', $notificationId);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function createStaffNotification($notificationId)
    {
        $query =
            'INSERT INTO user_notifications (user_id, notification_id) SELECT account_id, :notification_id FROM staff';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':notification_id', $notificationId);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function createAdminNotification($notificationId)
    {
        $query =
            'INSERT INTO user_notifications (user_id, notification_id) SELECT id, :notification_id FROM admin';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':notification_id', $notificationId);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function markAsRead($userId, $notificationId)
    {
        $query =
            'UPDATE user_notifications SET is_read = 1 WHERE user_id = :user_id AND notification_id = :notification_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':notification_id', $notificationId);
        return $stmt->execute();
    }

    public function deleteNotification($id)
    {
        $query = 'DELETE FROM notifications WHERE id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function deleteUserNotification($id)
    {
        $query = 'DELETE FROM user_notifications WHERE notification_id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function deleteUserEventNotification($userId, $notificationId)
    {
        $query =
            'DELETE FROM user_notifications WHERE user_id = :user_id AND notification_id = :notification_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':notification_id', $notificationId);
        return $stmt->execute();
    }
}
?>
