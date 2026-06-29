<?php

namespace App\Models;

use Config\Database;

class ArchivedActivitiesModel
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function archiveActivity($data, $id)
    {
        $query =
            'INSERT INTO archived_activities (account_id, activity_id, activity_type, archived_at) VALUES (:account_id, :activity_id, :activity_type, NOW())';

        $stmt = $this->pdo->prepare($query);

        $account_id = $id;
        $activity_id = htmlspecialchars(strip_tags($data['activity_id']));
        $activity_type = htmlspecialchars(strip_tags($data['activity_type']));

        $stmt->bindParam(':account_id', $account_id, \PDO::PARAM_INT);
        $stmt->bindParam(':activity_id', $activity_id, \PDO::PARAM_INT);
        $stmt->bindParam(':activity_type', $activity_type);

        return $stmt->execute();
    }

    public function unArchiveActivity($data, $id)
    {
        $query =
            'DELETE FROM archived_activities WHERE account_id = :account_id AND activity_id = :activity_id AND activity_type = :activity_type';

        $stmt = $this->pdo->prepare($query);

        $account_id = $id;
        $activity_id = htmlspecialchars(strip_tags($data['activity_id']));
        $activity_type = htmlspecialchars(strip_tags($data['activity_type']));

        $stmt->bindParam(':account_id', $account_id, \PDO::PARAM_INT);
        $stmt->bindParam(':activity_id', $activity_id, \PDO::PARAM_INT);
        $stmt->bindParam(':activity_type', $activity_type);

        return $stmt->execute();
    }

    public function getArchivedActivityIds($account_id, $tab)
    {
        $query = '';

        if ($tab === 'all') {
            $query = 'SELECT * FROM archived_activities WHERE account_id = :account_id';
        } elseif ($tab === 'volunteer_activities') {
            $query =
                "SELECT * FROM archived_activities WHERE account_id = :account_id AND activity_type = 'volunteer'";
        } elseif ($tab === 'events') {
            $query =
                "SELECT * FROM archived_activities WHERE account_id = :account_id AND activity_type = 'event'";
        }

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam('account_id', $account_id, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getArchivedActivities($id, $tab)
    {
        $joinedScholars = new ScholarOverviewDataModel();
        $activities = $this->getArchivedActivityIds($id, $tab);
        if (!$activities) {
            return [];
        }

        $data = [];

        foreach ($activities as $activity) {
            if ($activity['activity_type'] === 'event') {
                $event = $this->getArchivedEvent($activity['activity_id']);
                $data[] = $this->getEventParticipants($event);
            } elseif ($activity['activity_type'] === 'volunteer') {
                $activity = $this->getVolunteerActivityDetails($activity['activity_id']);
                $data[] = $this->getAllActivityWithFiles($activity);
            }
        }

        return $data;
    }

    public function getArchivedEvent($id)
    {
        $query = 'SELECT * FROM events WHERE id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getArchivedVolunteerActivity($id)
    {
        $query = 'SELECT * FROM volunteer_activities WHERE id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getAllActivityWithFiles($activity)
    {
        $data = [];

        $files = $this->getFilesByBatch($activity['batch_id']);

        $filesList = [];

        foreach ($files as $file) {
            $filesList[] = [
                'id' => $file['id'],
                'application_id' => $file['application_id'],
                'file_name' => $file['file_name'],
                'file_url' =>
                    $_ENV['APP_URL'] .
                    '/index.php?type=activities&route=file/view&file=' .
                    urlencode(basename($file['file_path'])),
                'file_size' => $file['file_size'],
                'file_type' => $file['file_type'],
                'uploaded_at' => $file['uploaded_at'],
                'batch_id' => $file['batch_id'],
            ];
        }

        $data = [
            'id' => $activity['id'],
            'activity_name' => $activity['activity_name'],
            'activity_status' => $activity['activity_status'],
            'activity_date' => $activity['activity_date'],
            'activity_location' => $activity['activity_location'],
            'start_time' => $activity['start_time'],
            'end_time' => $activity['end_time'],
            'feedback' => $activity['feedback'],
            'date_submitted' => $activity['uploaded_at'],
            'batch_id' => $activity['batch_id'],
            'files' => $filesList,
        ];

        return $data;
    }

    public function getVolunteerActivityDetails($eventId)
    {
        $query = 'SELECT * FROM volunteer_activities WHERE id = :event_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getFilesByBatch($batch_id)
    {
        $query = "SELECT *
                FROM certificate_of_appearance 
                WHERE batch_id = :batch_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':batch_id', $batch_id);

        if ($stmt->execute()) {
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        }

        return null;
    }

    public function getEventParticipants($event)
    {
        $joinedScholars = new ScholarOverviewDataModel();
        $eventModel = new EventsModel();

        // Make sure $event has 'id'
        if (!isset($event['id'])) {
            return $event; // or throw an exception
        }

        $event['numberOfParticipants'] = $joinedScholars->getNumberOfJoinedScholars($event['id']);

        $scholars = $eventModel->getParticipantsIds($event['id']);

        $participants = [];

        if ($scholars && is_array($scholars)) {
            foreach ($scholars as $scholarId) {
                $participant = $eventModel->getParticipantName($scholarId['account_id']);

                if ($participant && is_array($participant)) {
                    $participants[] = [
                        'scholar_id' => $participant['application_id'] ?? null,
                        'participant_name' =>
                            ($participant['first_name'] ?? '') .
                            ' ' .
                            ($participant['last_name'] ?? ''),
                        'is_attended' => $scholarId['is_attended'] ?? null,
                    ];
                }
            }
        }

        $event['participants'] = $participants;

        return $event;
    }
}

?>
