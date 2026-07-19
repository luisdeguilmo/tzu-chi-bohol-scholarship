<?php
namespace App\Models;
use Config\Database;

date_default_timezone_set('Asia/Manila');

class EventsModel
{
    private $pdo;
    public $table_name = 'events';
    public $event_name;
    public $event_date;
    public $event_time;
    public $event_location;
    public $announcement_message;
    public $currentDate;
    public $currentTime;
    public $currentDateTime;
    public $startOfMonth;
    public $startOfNextMonth;

    public function __construct()
    {
        // Set timezone and initialize date/time properties in constructor
        date_default_timezone_set('Asia/Manila');
        $this->currentDate = date('Y-m-d');
        $this->currentTime = date('H:i:s');
        $this->currentDateTime = date('Y-m-d H:i:s');
        $this->startOfMonth = date('Y-m-01');
        $this->startOfNextMonth = date('Y-m-01', strtotime('first day of next month'));

        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function createEvent($data)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                SET event_name = :event_name,
                    event_type = :event_type,
                    `date` = :event_date,
                    start_time = :start_time,
                    end_time = :end_time,
                    event_location = :event_location,
                    participant_limit = :participant_limit,
                    created_at = NOW()";

        $stmt = $this->pdo->prepare($query);

        $event_name = trim(strip_tags($data['event_name']));
        $event_type = trim(strip_tags($data['event_type']));
        $event_date = trim(strip_tags($data['event_date']));
        $start_time = trim(strip_tags($data['start_time']));
        $end_time = trim(strip_tags($data['end_time']));
        $event_location = trim(strip_tags($data['event_location']));
        $participant_limit = trim(strip_tags($data['participant_limit']));

        $stmt->bindParam(':event_name', $event_name);
        $stmt->bindParam(':event_type', $event_type);
        $stmt->bindParam(':event_date', $event_date);
        $stmt->bindParam(':start_time', $start_time);
        $stmt->bindParam(':end_time', $end_time);
        $stmt->bindParam(':event_location', $event_location);
        $stmt->bindParam(':participant_limit', $participant_limit);

        if ($stmt->execute()) {
            return $this->pdo->lastInsertId();
        } else {
            return null;
        }
    }

    public function updateEvent($data)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                SET event_name = :event_name,
                    event_type = :event_type,
                    `date` = :event_date,
                    start_time = :start_time,
                    end_time = :end_time,
                    event_location = :event_location,
                    participant_limit = :participant_limit 
                    WHERE id = :id";

        $stmt = $this->pdo->prepare($query);

        $event_name = trim(strip_tags($data['event_name']));
        $event_type = trim(strip_tags($data['event_type']));
        $event_date = trim(strip_tags($data['event_date']));
        $start_time = trim(strip_tags($data['start_time']));
        $end_time = trim(strip_tags($data['end_time']));
        $event_location = trim(strip_tags($data['event_location']));
        $participant_limit = trim(strip_tags($data['participant_limit']));
        $event_id = trim(strip_tags($data['event_id']));

        $stmt->bindParam(':event_name', $event_name);
        $stmt->bindParam(':event_type', $event_type);
        $stmt->bindParam(':event_date', $event_date);
        $stmt->bindParam(':start_time', $start_time);
        $stmt->bindParam(':end_time', $end_time);
        $stmt->bindParam(':event_location', $event_location);
        $stmt->bindParam(':participant_limit', $participant_limit);
        $stmt->bindParam(':id', $event_id);

        return $stmt->execute();
    }

    public function checkParticipant($accountId, $eventId): bool
    {
        $query = "
        SELECT 1
        FROM event_participants
        WHERE account_id = :account_id
          AND event_id = :event_id
        LIMIT 1
    ";

        $stmt = $this->pdo->prepare($query);
        $stmt->execute([
            ':account_id' => $accountId,
            ':event_id' => $eventId,
        ]);

        return (bool) $stmt->fetchColumn();
    }

    public function addToEventParticipant($accountId, $eventId)
    {
        $query =
            'INSERT INTO event_participants SET account_id = :account_id, event_id = :event_id';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $accountId, \PDO::PARAM_INT);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function makeAllScholarsAsParticipants($eventId)
    {
        // $query =
        //     'INSERT INTO event_participants (account_id, event_id) SELECT account_id, :event_id FROM scholars WHERE ';

        $query =
            "INSERT INTO event_participants (account_id, event_id) SELECT s.account_id, :event_id FROM scholars s JOIN users u ON s.account_id = u.account_id WHERE u.status = 'active'";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function getEvents($scholarId)
    {
        $query =
            "SELECT activity_id FROM archived_activities WHERE account_id = :account_id AND activity_type = 'event'";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $scholarId, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getEventDetails($eventId)
    {
        $query =
            'SELECT id, event_name, event_type, event_location, date, start_time, end_time, participant_limit FROM events WHERE id = :event_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getAllEvents()
    {
        $query = "SELECT id, event_name, event_type, event_location, date, start_time, end_time, participant_limit FROM events 
                    ORDER BY date DESC, start_time DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getUpcomingEvents()
    {
        $query =
            'SELECT id, event_name, event_type, event_location, date, start_time, end_time, participant_limit FROM ' .
            $this->table_name .
            " 
                WHERE CONCAT(date, ' ', start_time) > :current_datetime 
                ORDER BY date DESC, start_time DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':current_datetime', $this->currentDateTime);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getEventsThisMonth()
    {
        $query =
            'SELECT id, event_name, event_type, event_location, date, start_time, end_time, participant_limit FROM ' .
            $this->table_name .
            " 
                WHERE date >= :start_of_month AND date < :start_of_next_month
                ORDER BY date DESC, start_time DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':start_of_month', $this->startOfMonth);
        $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getPastEvents()
    {
        $query =
            'SELECT id, event_name, event_type, event_location, date, start_time, end_time, participant_limit FROM ' .
            $this->table_name .
            " 
                WHERE CONCAT(date, ' ', start_time) < :current_datetime 
                ORDER BY date DESC, start_time DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':current_datetime', $this->currentDateTime);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getRecentEvents()
    {
        $query =
            'SELECT id, event_name, event_type, event_location, date, start_time, end_time, participant_limit FROM ' .
            $this->table_name .
            " 
                WHERE date >= :start_of_month AND date < :current_date AND date < :start_of_next_month
                ORDER BY date DESC, start_time DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':start_of_month', $this->startOfMonth);
        $stmt->bindParam(':current_date', $this->currentDate);
        $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllEventsByScholarId($scholarId, $tab)
    {
        $archivedEvents = $this->getEvents($scholarId);

        $events = [];

        if ($tab === 'all') {
            $events = $this->getAllEvents();
        } elseif ($tab === 'this_month') {
            $events = $this->getEventsThisMonth();
        } elseif ($tab === 'past') {
            $events = $this->getPastEvents();
        }

        $eventIds = array_map(function ($event) {
            return $event['activity_id'];
        }, $archivedEvents);

        $filteredEvents = array_filter($events, function ($event) use ($eventIds) {
            return !in_array($event['id'], $eventIds);
        });

        $data = [];

        foreach ($filteredEvents as $event) {
            $data[] = $this->getEventDetails($event['id']);
        }

        return $data;
    }

    public function getParticipantsIds($eventId)
    {
        $query = 'SELECT account_id, is_attended, reason FROM event_participants WHERE event_id = :event_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getParticipantName($scholarId)
    {
        $query = 'SELECT first_name, last_name FROM scholars WHERE account_id = :application_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $scholarId, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getEventsByTabAndScholarId($tab, $id, $joinedScholars)
    {
        $result = [];

        if ($tab === 'all') {
            $result = $this->getAllEventsByScholarId($id, $tab);
        } elseif ($tab === 'this_month') {
            $result = $this->getAllEventsByScholarId($id, $tab);
        } elseif ($tab === 'upcoming') {
            $result = $this->getUpcomingEvents();
        } elseif ($tab === 'past') {
            $result = $this->getAllEventsByScholarId($id, $tab);
        }

        return $this->getEventParticipants($result, $joinedScholars, $id);
    }

    public function getEventParticipants(array $events, $joinedScholars, $userId): array
    {
        $privateComment = new PrivateCommentsModel();
        $result = [];

        foreach ($events as $event) {
            $eventId = $event['id'];

            // Get number of participants
            $event['numberOfParticipants'] = $joinedScholars->getNumberOfJoinedScholars($eventId);
            $event[
                'numberOfScholarUnreadComments'
            ] = $privateComment->getUnreadScholarPrivateCommentsByEventId($eventId);
            $event['numberOfStaffUnreadComments'] =
                $privateComment->getUnreadStaffPrivateCommentsByEventId($eventId, $userId) ?? 0;

            // Fetch raw scholar participation info
            $scholarRecords = $this->getParticipantsIds($eventId);

            $participants = [];

            foreach ($scholarRecords as $record) {
                $participantInfo = $this->getParticipantName($record['account_id']);

                $participants[] = [
                    'scholar_id' => $record['account_id'] ?? null,
                    'participant_name' => trim(
                        ($participantInfo['first_name'] ?? '') .
                            ' ' .
                            ($participantInfo['last_name'] ?? ''),
                    ),
                    'is_attended' => $record['is_attended'] ?? false,
                    // 'is_not_availab' => $record['is_attended'] ?? false,
                    'reason' => $record['reason'] ?? false,
                ];
            }

            $event['participants'] = $participants;
            $result[] = $event;
        }

        return $result;
    }

    public function getEventsOnStaff($year, $status, $sort, $joinedScholars)
    {
        $query =
            'SELECT id, event_name, event_type, event_location, date, start_time, end_time, participant_limit FROM ' .
            $this->table_name .
            " 
                WHERE YEAR(date) = :year";

        if ($status === 'all') {
            $query .=
                " AND (CONCAT(date, ' ', start_time) > :current_datetime OR CONCAT(date, ' ', start_time) < :current_datetime)";
        } elseif ($status === 'upcoming') {
            $query .= " AND CONCAT(date, ' ', start_time) > :current_datetime";
        } elseif ($status === 'ended') {
            $query .= " AND CONCAT(date, ' ', start_time) < :current_datetime";
        }

        if ($sort === 'newest') {
            $query .= ' ORDER BY created_at DESC';
        } elseif ($sort === 'oldest') {
            $query .= ' ORDER BY created_at ASC';
        } elseif ($sort === 'name') {
            $query .= ' ORDER BY event_name ASC';
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':year', $year);
        $stmt->bindParam(':current_datetime', $this->currentDateTime);
        $stmt->execute();
        $events = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        return $this->getEventParticipants($events, $joinedScholars, null);
    }
}
?>
