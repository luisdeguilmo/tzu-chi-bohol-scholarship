<?php
namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class ActivityModel {
    private $table_name = "volunteer_activities";
    
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
    public $status;
    
    private $pdo;
    
    public function __construct($pdo = null) {
        if ($pdo) {
            $this->pdo = $pdo;
        } else {
            $db = new Database();
            $this->pdo = $db->getConnection();   
            $this->startOfMonth = date('Y-m-01'); 
            $this->startOfNextMonth = date('Y-m-01', strtotime('first day of next month'));
            $this->currentDateTime = date('Y-m-d H:i:s');
        }
    }

    // public function getScholarWithCurrentMonthActivities($tab) {
    //     $query = "SELECT 
    //                 pi.application_id, 
    //                 pi.first_name,
    //                 pi.last_name,
    //                 pi.email, 
    //                 va.*,
    //                 ca.*
    //             FROM personal_information pi
    //             JOIN volunteer_activities va ON pi.application_id = va.account_id
    //             JOIN certificate_of_appearance ca ON pi.application_id = ca.application_id
    //             WHERE 
    //                 va.activity_date >= :start_of_month AND va.activity_date < :start_of_next_month AND va.activity_status = 'pending'";

    //     $query = "SELECT 
    //                 pi.application_id,
    //                 va.activity_name,
    //                 ca.file_path,
    //                 ca.uploaded_at
    //             FROM personal_information pi
    //             JOIN volunteer_activities va ON pi.application_id = va.application_id
    //             JOIN certificate_of_appearance ca ON pi.application_id = ca.application_id
    //             WHERE 
    //                 va.activity_date >= :start_of_month
    //                 AND va.activity_date < :start_of_next_month
    //                 AND va.activity_status = 'pending'
    //                 AND (ca.application_id, ca.uploaded_at) IN (
    //                     SELECT application_id, uploaded_at
    //                     FROM certificate_of_appearance
    //                     GROUP BY application_id, uploaded_at
    //                     HAVING COUNT(*) > 1  -- Only get uploaded_at values with multiple files
    //                 )
    //             ORDER BY pi.application_id, ca.uploaded_at, ca.file_path;

    //     ";

    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->bindParam(':start_of_month', $this->startOfMonth);
    //     $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);
    //     $stmt->execute();

    //     return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    // } 
    
    public function createActivity($activity_data, $batch_id) {
        $query = "INSERT INTO " . $this->table_name . " 
            SET account_id = :account_id,
                activity_name = :activity_name,
                activity_location = :activity_location,
                activity_date = :activity_date,
                start_time = :start_time,
                end_time = :end_time,
                activity_status = :activity_status,
                batch_id = :batch_id,
                uploaded_at = :uploaded_at,
                updated_at = :updated_at";
        
        $stmt = $this->pdo->prepare($query);
        
        // Sanitize inputs
        $this->account_id = htmlspecialchars(strip_tags($activity_data['application_id']));
        $this->activity_name = htmlspecialchars(strip_tags($activity_data['activity_name']));
        $this->activity_location = htmlspecialchars(strip_tags($activity_data['activity_location']));
        $this->activity_date = htmlspecialchars(strip_tags($activity_data['activity_date']));
        $this->start_time = htmlspecialchars(strip_tags($activity_data['start_time']));
        $this->end_time = htmlspecialchars(strip_tags($activity_data['end_time']));
        $this->activity_status = htmlspecialchars(strip_tags($activity_data['activity_status']));
        $batch_id = $batch_id;
        $this->uploaded_at = date('Y-m-d H:i:s');
        $this->updated_at = date('Y-m-d H:i:s');
        
        // Bind values
        $stmt->bindParam(":account_id", $this->account_id);
        $stmt->bindParam(":activity_name", $this->activity_name);
        $stmt->bindParam(":activity_location", $this->activity_location);
        $stmt->bindParam(":activity_date", $this->activity_date);
        $stmt->bindParam(":start_time", $this->start_time);
        $stmt->bindParam(":end_time", $this->end_time);
        $stmt->bindParam(":activity_status", $this->activity_status);
        $stmt->bindParam(":batch_id", $batch_id);
        $stmt->bindParam(":uploaded_at", $this->uploaded_at);
        $stmt->bindParam(":updated_at", $this->updated_at);
        
        if ($stmt->execute()) {
            return $this->account_id;
        }
        
        return false;
    }

    public function updateActivity($activity_data, $batch_id) {
        $query = "UPDATE " . $this->table_name . " 
            SET account_id = :account_id,
                    activity_name = :activity_name,
                    activity_location = :activity_location,
                activity_date = :activity_date,
                start_time = :start_time,
                end_time = :end_time,
                activity_status = :activity_status,
                batch_id = :batch_id,
                uploaded_at = :uploaded_at,
                updated_at = :updated_at WHERE id = :id";
        
        $stmt = $this->pdo->prepare($query);
        
        // Sanitize inputs
        $this->account_id = htmlspecialchars(strip_tags($activity_data['application_id']));
        $this->activity_id = htmlspecialchars(strip_tags($activity_data['activity_id']));
        $this->activity_name = htmlspecialchars(strip_tags($activity_data['activity_name']));
        $this->activity_location = htmlspecialchars(strip_tags($activity_data['activity_location']));
        $this->activity_date = htmlspecialchars(strip_tags($activity_data['activity_date']));
        $this->start_time = htmlspecialchars(strip_tags($activity_data['start_time']));
        $this->end_time = htmlspecialchars(strip_tags($activity_data['end_time']));
        $this->activity_status = htmlspecialchars(strip_tags($activity_data['activity_status']));
        $batch_id = $batch_id;
        $this->uploaded_at = date('Y-m-d H:i:s');
        $this->updated_at = date('Y-m-d H:i:s');
        
        // Bind values
        $stmt->bindParam(":account_id", $this->account_id);
        $stmt->bindParam(":id", $this->activity_id);
        $stmt->bindParam(":activity_name", $this->activity_name);
        $stmt->bindParam(":activity_location", $this->activity_location);
        $stmt->bindParam(":activity_date", $this->activity_date);
        $stmt->bindParam(":start_time", $this->start_time);
        $stmt->bindParam(":end_time", $this->end_time);
        $stmt->bindParam(":activity_status", $this->activity_status);
        $stmt->bindParam(":batch_id", $batch_id);
        $stmt->bindParam(":uploaded_at", $this->uploaded_at);
        $stmt->bindParam(":updated_at", $this->updated_at);
        
        if ($stmt->execute()) {
            return $this->account_id;
        }
        
        return false;
    }

    public function getVolunteerActivities($scholarId) {
        $query = "SELECT * FROM archived_activities WHERE account_id = :account_id AND activity_type = 'volunteer'";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $scholarId, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getVolunteerActivityDetails($eventId) {
        $query = "SELECT * FROM volunteer_activities WHERE id = :event_id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getAllVolunteerActivities($scholarId) {
        $query = "SELECT * FROM volunteer_activities 
                    WHERE account_id = :account_id
                    ORDER BY activity_date DESC, start_time DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $scholarId);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getVolunteerActivitiesThisMonth($scholarId) {
        $query = "SELECT * FROM volunteer_activities 
                    WHERE activity_date >= :start_of_month AND activity_date < :start_of_next_month AND account_id = :account_id
                    ORDER BY activity_date  DESC, start_time DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $scholarId);
        $stmt->bindParam(':start_of_month', $this->startOfMonth);
        $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getPastSubmissions($scholarId) {
        $query = "SELECT * FROM volunteer_activities 
                    WHERE CONCAT(activity_date, ' ', start_time) < :current_datetime AND account_id = :account_id
                    ORDER BY activity_date  DESC, start_time DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $scholarId);
        $stmt->bindParam(':current_datetime', $this->currentDateTime);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllVolunteerActivitiesByScholarId($scholarId, $tab) {
        $archivedVolunteerActivities = $this->getVolunteerActivities($scholarId);
        
        $volunteerActivities  = [];
        
        if ($tab === "all") {
            $volunteerActivities = $this->getAllVolunteerActivities($scholarId);
        } else if ($tab === "this_month") {
            $volunteerActivities = $this->getVolunteerActivitiesThisMonth($scholarId);
        } else if ($tab === "past") {
            $volunteerActivities = $this->getPastSubmissions($scholarId);
        } 

        $volunteerActivityIds = array_map(function($activity) {
            return $activity['activity_id'];
        }, $archivedVolunteerActivities);

        $filteredActivities = array_filter($volunteerActivities, function($activity) use ($volunteerActivityIds) {
            return !in_array($activity['id'], $volunteerActivityIds);
        });

        $data = [];

        foreach ($filteredActivities as $activity) {
            $data[] = $this->getVolunteerActivityDetails($activity['id']);
        }

        return $filteredActivities;
    }

    public function getAllActivitiesWithFiles($activities, $activityModel) {
        $data = [];

        foreach ($activities as $activity) {
            $files = $activityModel->getFilesByBatch($activity['batch_id']);
            
            $filesList = [];

            foreach ($files as $file) {
                $filesList[] = [  
                                'id' => $file['id'],
                                'application_id' => $file['application_id'],  
                                'file_name' => $file['file_name'],
                                'file_path' => $file['file_path'], 
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
                'files' => $filesList
            ];
        }

        return $data;
    }

    public function getAllScholarsWithFiles($scholars, $activityModel) {
        $data = [];

        foreach ($scholars as $scholar) {
            $files = $activityModel->getFilesByBatch($scholar['batch_id']);
            
            $filesList = [];

            foreach ($files as $file) {
                $filesList[] = [  
                                'id' => $file['id'],
                                'application_id' => $file['application_id'],  
                                'file_name' => $file['file_name'],
                                'file_path' => $file['file_path'], 
                                'file_size' => $file['file_size'], 
                                'file_type' => $file['file_type'],
                                'uploaded_at' => $file['uploaded_at'],
                                ];
            }

            $data[] = [
                'id' => $scholar['id'],
                'application_id' => $scholar['application_id'],
                'name' => $scholar['name'] ?? $scholar['first_name'] . ' ' . $scholar['last_name'],
                'email' => $scholar['email'],
                'activity_name' => $scholar['activity_name'],
                'activity_location' => $scholar['activity_location'],
                'activity_date' => $scholar['activity_date'],
                'start_time' => $scholar['start_time'],
                'end_time' => $scholar['end_time'],
                'status' => $scholar['activity_status'],
                'date_submitted' => $scholar['uploaded_at'],
                'files' => $filesList
            ];
        }

        return $data;
    }

    /* Staff */
    public function getActivitiesByTab($year, $month, $status, $sort) {
        // if ($tab === 'pending') $this->status = "Pending";
        // else if ($tab === 'recorded') $this->status = "Recorded";

        $query = "SELECT pi.application_id, pi.first_name, pi.last_name, pi.email, va.*
                FROM personal_information pi 
                JOIN volunteer_activities va ON pi.application_id = va.account_id 
                WHERE YEAR(va.uploaded_at) = :year AND MONTH(va.uploaded_at) = :month
                AND va.batch_id IS NOT NULL";

        if ($status === 'all') {
            $query .= " AND (va.activity_status = 'Pending' OR va.activity_status = 'Recorded' OR va.activity_status = 'Not Recorded')";
        } else if ($status === 'pending') {
            $query .= " AND va.activity_status = 'Pending'";
        } else if ($status === 'recorded') {
            $query .= " AND va.activity_status = 'Recorded'";
        } else if ($status === 'not_recorded') {
            $query .= " AND va.activity_status = 'Not Recorded'";
        }

        if ($sort === 'newest') {
            $query .= " ORDER BY va.uploaded_at DESC";
        } else if ($sort === 'oldest') {
            $query .= " ORDER BY va.uploaded_at ASC";
        } else if ($sort === 'name') {
            $query .= " ORDER BY pi.first_name ASC";
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':year', $year);
        $stmt->bindParam(':month', $month);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getPendingActivities() {
        $query = "SELECT * FROM volunteer_activities WHERE activity_status = 'Pending'";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getRecordedActivities() {
        $query = "SELECT * FROM volunteer_activities WHERE activity_status = 'Recorded'";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }













    public function getCurrentMonthActivities($account_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
              WHERE account_id = :account_id AND activity_date >= :start_of_month AND activity_date < :start_of_next_month ORDER BY activity_date DESC, start_time DESC";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $account_id);
        $stmt->bindParam(':start_of_month', $this->startOfMonth);
        $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);
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
                                'file_path' => $file['file_path'], 
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
                'files' => $filesList
            ];
        }

        return $data;
    }  

    public function getScholarWithActivities($tab) {
        $query = "SELECT pi.application_id, pi.first_name, pi.last_name, pi.email, va.id, va.activity_name, va.batch_id, uploaded_at
                FROM personal_information pi 
                JOIN volunteer_activities va ON pi.application_id = va.account_id 
                WHERE va.activity_status = :tab 
                AND va.uploaded_at >= :start_of_month 
                AND va.uploaded_at < :start_of_next_month
                AND va.batch_id IS NOT NULL";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':tab', $tab);
        $stmt->bindParam(':start_of_month', $this->startOfMonth);
        $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);
        $stmt->execute();
        $scholars = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        // $count = 0;
        $data = [];
        foreach ($scholars as $scholar) {
            // print_r($scholars);
            $files = $this->getFilesByBatch($scholar['batch_id']);
            
            $filesList = [];

            foreach ($files as $file) {
                $filesList[] = [  
                                'id' => $file['id'],
                                'application_id' => $file['application_id'],  
                                'file_name' => $file['file_name'],
                                'file_path' => $file['file_path'], 
                                'file_type' => $file['file_type'],
                                'uploaded_at' => $file['uploaded_at'],
                                ];
            }

            // print_r($files);
        
            $data[] = [
                'id' => $scholar['id'],
                'application_id' => $scholar['application_id'],
                'name' => $scholar['name'] ?? $scholar['first_name'] . ' ' . $scholar['last_name'],
                'email' => $scholar['email'],
                'activity' => $scholar['activity_name'],
                'date_submitted' => $scholar['uploaded_at'],
                'files' => $filesList
            ];

            // $count++;
            // echo "Count: " . $count;
        }        
        return $data;
    }

    public function getFilesByBatch($batch_id) {
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
    
    public function getAllActivities($account_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE account_id = :account_id ORDER BY activity_date DESC, activity_time DESC";
        
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
                                'file_path' => $file['file_path'], 
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
                'files' => $filesList
            ];
        }

        return $data;
    }
    
    public function getActivityById($id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                   WHERE id = ?";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function markAsNotRecordedWithFeedback($data) {
        $query = "UPDATE " . $this->table_name . " SET activity_status = 'Not Recorded', feedback = :feedback WHERE id = :id";

        $stmt = $this->pdo->prepare($query);

        $feedback = htmlspecialchars(strip_tags($data['feedback']));
        $id = htmlspecialchars(strip_tags($data['id']));

        $stmt->bindParam(':feedback', $feedback);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    public function updateActivityStatus($data) {
        $query = "UPDATE " . $this->table_name . " SET activity_status = :activity_status WHERE id = :id";

        $stmt = $this->pdo->prepare($query);

        $activity_status = htmlspecialchars(strip_tags($data['activity_status']));
        $id = htmlspecialchars(strip_tags($data['id']));

        $stmt->bindParam(':activity_status', $activity_status);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }
    
    public function deleteActivity($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(1, $id);
        
        return $stmt->execute();
    }
}
?>