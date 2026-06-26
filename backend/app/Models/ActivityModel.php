<?php
namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class ActivityModel
{
    private $table_name = 'volunteer_activities';

    public $id;
    public $account_id;
    public $activity_id;
    public $activity_name;
    public $activity_location;
    public $activity_date;
    public $start_time;
    public $end_time;
    public $activity_status;
    public $updated_at;
    public $uploaded_at;
    public $startOfMonth;
    public $startOfNextMonth;
    public $currentDateTime;
    public $currentDate;
    public $status;

    private $pdo;

    public function __construct($pdo = null)
    {
        if ($pdo) {
            $this->pdo = $pdo;
        } else {
            $db = new Database();
            $this->pdo = $db->getConnection();
            $this->startOfMonth = date('Y-m-01');
            $this->startOfNextMonth = date('Y-m-01', strtotime('first day of next month'));
            $this->currentDate = date('Y-m-d');
            $this->currentDateTime = date('Y-m-d H:i:s');
        }
    }

    public function createActivity($activity_data, $scholarId, $batch_id)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
            SET account_id = :account_id,
                activity_name = :activity_name,
                activity_location = :activity_location,
                activity_date = :activity_date,
                start_time = :start_time,
                end_time = :end_time,
                activity_status = :activity_status,
                batch_id = :batch_id,
                uploaded_at = NOW(), 
                updated_at = NOW()";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->account_id = htmlspecialchars(strip_tags($scholarId));
        $this->activity_name = htmlspecialchars(strip_tags($activity_data['activity_name']));
        $this->activity_location = htmlspecialchars(
            strip_tags($activity_data['activity_location']),
        );
        $this->activity_date = htmlspecialchars(strip_tags($activity_data['activity_date']));
        $this->start_time = htmlspecialchars(strip_tags($activity_data['start_time']));
        $this->end_time = htmlspecialchars(strip_tags($activity_data['end_time']));
        $this->activity_status = htmlspecialchars(strip_tags($activity_data['activity_status']));
        $batch_id = $batch_id;

        // Bind values
        $stmt->bindParam(':account_id', $this->account_id);
        $stmt->bindParam(':activity_name', $this->activity_name);
        $stmt->bindParam(':activity_location', $this->activity_location);
        $stmt->bindParam(':activity_date', $this->activity_date);
        $stmt->bindParam(':start_time', $this->start_time);
        $stmt->bindParam(':end_time', $this->end_time);
        $stmt->bindParam(':activity_status', $this->activity_status);
        $stmt->bindParam(':batch_id', $batch_id);

        if ($stmt->execute()) {
            return $this->pdo->lastInsertId();
        }

        return false;
    }

    public function updateActivity($activity_data, $scholarId, $batch_id)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
            SET account_id = :account_id,
                    activity_name = :activity_name,
                    activity_location = :activity_location,
                activity_date = :activity_date,
                start_time = :start_time,
                end_time = :end_time,
                activity_status = :activity_status,
                batch_id = :batch_id,
                updated_at = NOW() WHERE id = :id";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->account_id = htmlspecialchars(strip_tags($scholarId));
        $this->activity_id = htmlspecialchars(strip_tags($activity_data['activity_id']));
        $this->activity_name = htmlspecialchars(strip_tags($activity_data['activity_name']));
        $this->activity_location = htmlspecialchars(
            strip_tags($activity_data['activity_location']),
        );
        $this->activity_date = htmlspecialchars(strip_tags($activity_data['activity_date']));
        $this->start_time = htmlspecialchars(strip_tags($activity_data['start_time']));
        $this->end_time = htmlspecialchars(strip_tags($activity_data['end_time']));
        $this->activity_status = htmlspecialchars(strip_tags($activity_data['activity_status']));
        $batch_id = $batch_id;

        // Bind values
        $stmt->bindParam(':account_id', $this->account_id);
        $stmt->bindParam(':id', $this->activity_id);
        $stmt->bindParam(':activity_name', $this->activity_name);
        $stmt->bindParam(':activity_location', $this->activity_location);
        $stmt->bindParam(':activity_date', $this->activity_date);
        $stmt->bindParam(':start_time', $this->start_time);
        $stmt->bindParam(':end_time', $this->end_time);
        $stmt->bindParam(':activity_status', $this->activity_status);
        $stmt->bindParam(':batch_id', $batch_id);

        if ($stmt->execute()) {
            return [
                'activity_id' => $this->activity_id,
                'activity_name' => $this->activity_name,
            ];
        }

        return false;
    }

    public function getRenderedHoursById($id)
    {
        $query = 'SELECT rendered_hours FROM volunteer_activities WHERE id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            return $row['rendered_hours'];
        }

        return null;
    }

    public function revertRenderedHours($accountId)
    {
        $query = 'UPDATE volunteer_activities SET rendered_hours = 0 WHERE id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $accountId);
        return $stmt->execute();
    }

    public function getVolunteerActivities($scholarId)
    {
        $query =
            "SELECT * FROM archived_activities WHERE account_id = :account_id AND activity_type = 'volunteer'";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $scholarId, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getVolunteerActivityDetails($eventId)
    {
        $query = 'SELECT * FROM volunteer_activities WHERE id = :event_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getAllVolunteerActivities($scholarId)
    {
        $query = "SELECT id, activity_date, activity_location, activity_name, activity_status, batch_id, uploaded_at, end_time, feedback, start_time FROM volunteer_activities 
                    WHERE account_id = :account_id
                    ORDER BY activity_date DESC, start_time DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $scholarId);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getVolunteerActivitiesThisMonth($scholarId)
    {
        $query = "SELECT id, activity_date, activity_location, activity_name, activity_status, batch_id, uploaded_at, end_time, feedback, start_time FROM volunteer_activities 
                    WHERE activity_date >= :start_of_month AND activity_date < :start_of_next_month AND account_id = :account_id
                    ORDER BY activity_date  DESC, start_time DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $scholarId);
        $stmt->bindParam(':start_of_month', $this->startOfMonth);
        $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getPastSubmissions($scholarId)
    {
        $query = "SELECT id, activity_date, activity_location, activity_name, activity_status, batch_id, uploaded_at, end_time, feedback, start_time FROM volunteer_activities 
                    WHERE DATE(updated_at) < :current_datetime AND account_id = :account_id
                    ORDER BY activity_date  DESC, start_time DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $scholarId);
        $stmt->bindParam(':current_datetime', $this->currentDate);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllVolunteerActivitiesByScholarId($scholarId, $tab)
    {
        $archivedVolunteerActivities = $this->getVolunteerActivities($scholarId);

        $volunteerActivities = [];

        if ($tab === 'all') {
            $volunteerActivities = $this->getAllVolunteerActivities($scholarId);
        } elseif ($tab === 'this_month') {
            $volunteerActivities = $this->getVolunteerActivitiesThisMonth($scholarId);
        } elseif ($tab === 'past') {
            $volunteerActivities = $this->getPastSubmissions($scholarId);
        }

        $volunteerActivityIds = array_map(function ($activity) {
            return $activity['activity_id'];
        }, $archivedVolunteerActivities);

        $filteredActivities = array_filter($volunteerActivities, function ($activity) use (
            $volunteerActivityIds,
        ) {
            return !in_array($activity['id'], $volunteerActivityIds);
        });

        $data = [];

        foreach ($filteredActivities as $activity) {
            $data[] = $this->getVolunteerActivityDetails($activity['id']);
        }

        return $filteredActivities;
    }

    public function getAllActivitiesWithFiles($activities, $activityModel)
    {
        $data = [];

        foreach ($activities as $activity) {
            $files = $activityModel->getFilesByBatch($activity['batch_id']);

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

            $data[] = [
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
        }

        return $data;
    }

    public function getProfileById($id)
    {
        $query = "SELECT *
                FROM profile_pictures 
                WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $id);

        if ($stmt->execute()) {
            return $stmt->fetch(\PDO::FETCH_ASSOC);
        }

        return null;
    }

    public function getAllScholarsWithFiles($scholars, $activityModel)
    {
        $data = [];

        foreach ($scholars as $scholar) {
            $files = $activityModel->getFilesByBatch($scholar['batch_id']);

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
                ];
            }

            $profile = $activityModel->getProfileById($scholar['application_id']);

            $data[] = [
                'id' => $scholar['id'],
                'application_id' => $scholar['application_id'],
                'name' => $scholar['name'] ?? $scholar['first_name'] . ' ' . $scholar['last_name'],
                'first_name' => $scholar['first_name'],
                'last_name' => $scholar['last_name'],
                'middle_name' => $scholar['middle_name'],
                'email' => $scholar['email'],
                'activity_name' => $scholar['activity_name'],
                'activity_location' => $scholar['activity_location'],
                'activity_date' => $scholar['activity_date'],
                'start_time' => $scholar['start_time'],
                'end_time' => $scholar['end_time'],
                'status' => $scholar['activity_status'],
                'date_submitted' => $scholar['uploaded_at'],
                'files' => $filesList,
                'profile' =>
                    $_ENV['APP_URL'] .
                    '/index.php?type=applications&route=profile&file=' .
                    urlencode(basename($profile['file_path'])),
            ];
        }

        return $data;
    }

    /* Staff */
    public function getActivitiesByTab($year, $month, $status, $sort)
    {
        // if ($tab === 'pending') $this->status = "Pending";
        // else if ($tab === 'recorded') $this->status = "Recorded";

        $query = "SELECT pi.application_id, pi.first_name, pi.last_name, pi.middle_name, pi.email, va.*
                FROM personal_information pi 
                JOIN volunteer_activities va ON pi.application_id = va.account_id 
                WHERE YEAR(va.uploaded_at) = :year AND MONTH(va.uploaded_at) = :month
                AND va.batch_id IS NOT NULL";

        if ($status === 'all') {
            $query .=
                " AND (va.activity_status = 'Pending' OR va.activity_status = 'Recorded' OR va.activity_status = 'Not Recorded')";
        } elseif ($status === 'pending') {
            $query .= " AND va.activity_status = 'Pending'";
        } elseif ($status === 'recorded') {
            $query .= " AND va.activity_status = 'Recorded'";
        } elseif ($status === 'not_recorded') {
            $query .= " AND va.activity_status = 'Not Recorded'";
        }

        if ($sort === 'newest') {
            $query .= ' ORDER BY va.uploaded_at DESC';
        } elseif ($sort === 'oldest') {
            $query .= ' ORDER BY va.uploaded_at ASC';
        } elseif ($sort === 'name') {
            $query .= ' ORDER BY pi.first_name ASC';
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':year', $year);
        $stmt->bindParam(':month', $month);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getPendingActivities()
    {
        $query = "SELECT * FROM volunteer_activities WHERE activity_status = 'Pending'";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getRecordedActivities()
    {
        $query = "SELECT * FROM volunteer_activities WHERE activity_status = 'Recorded'";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
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

    public function getAllActivities($account_id)
    {
        $query =
            'SELECT * FROM ' .
            $this->table_name .
            ' WHERE account_id = :account_id ORDER BY activity_date DESC, activity_time DESC';

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':account_id', $account_id);
        $stmt->execute();

        $activities = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        $data = [];

        foreach ($activities as $activity) {
            $files = $this->getFilesByBatch($activity['batch_id']);

            $filesList = [];

            foreach ($files as $file) {
                $filesList[] = [
                    'id' => $file['id'],
                    'application_id' => $file['application_id'],
                    'file_name' => $file['file_name'],
                    'file_type' => $file['file_type'],
                    'uploaded_at' => $file['uploaded_at'],
                ];
            }

            // print_r($files);

            $data[] = [
                'id' => $activity['id'],
                'activity_name' => $activity['activity_name'],
                'activity_status' => $activity['activity_status'],
                'activity_date' => $activity['activity_date'],
                'activity_location' => $activity['activity_location'],
                'start_time' => $activity['start_time'],
                'end_time' => $activity['end_time'],
                'date_submitted' => $activity['uploaded_at'],
                'files' => $filesList,
            ];
        }

        return $data;
    }

    public function getActivityById($id)
    {
        $query =
            'SELECT * FROM ' .
            $this->table_name .
            " 
                   WHERE id = ?";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();

        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function markAsNotRecordedWithFeedback($data)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " SET activity_status = 'Not Recorded', feedback = :feedback WHERE id = :id";

        $stmt = $this->pdo->prepare($query);

        $feedback = htmlspecialchars(strip_tags($data['feedback']));
        $id = htmlspecialchars(strip_tags($data['id']));

        $stmt->bindParam(':feedback', $feedback);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    public function updateActivityStatus($data)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            ' SET activity_status = :activity_status, rendered_hours = :rendered_hours WHERE id = :id';

        $stmt = $this->pdo->prepare($query);

        $activity_status = htmlspecialchars(strip_tags($data['activity_status']));
        $rendered_hours = htmlspecialchars(strip_tags($data['rendered_hours']));
        $id = htmlspecialchars(strip_tags($data['id']));

        $stmt->bindParam(':activity_status', $activity_status);
        $stmt->bindParam(':rendered_hours', $rendered_hours);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    public function deleteActivity($id)
    {
        $query = 'DELETE FROM ' . $this->table_name . ' WHERE id = ?';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(1, $id);

        return $stmt->execute();
    }
}
?>
