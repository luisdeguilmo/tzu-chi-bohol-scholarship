<?php 

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class ScholarOverviewDataModel {

    private $pdo;
    private $startOfMonth;
    private $startOfNextMonth;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->startOfMonth = date('Y-m-01'); 
        $this->startOfNextMonth = date('Y-m-01', strtotime('first day of next month'));
    }

    /* Volunteer Activities */
    public function getNumberOfPendingActivities($id) {
        $query = "SELECT COUNT(*) AS pending_count FROM volunteer_activities WHERE activity_status = 'Pending' AND activity_date >= :start_of_month AND activity_date < :start_of_next_month AND account_id = :id";

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->bindParam(':start_of_month', $this->startOfMonth);
        $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);   

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['pending_count'] ?? 0;
    }

    public function getNumberOfRecordedActivities($id) {
        $query = "SELECT COUNT(*) AS recorded_count FROM volunteer_activities WHERE activity_status = 'Recorded' AND activity_date >= :start_of_month AND activity_date < :start_of_next_month AND account_id = :id";

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->bindParam(':start_of_month', $this->startOfMonth);
        $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);   

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['recorded_count'] ?? 0;
    }

    public function getNumberOfActivities($id) {
        $query = "SELECT COUNT(*) AS activities_count FROM volunteer_activities WHERE activity_date >= :start_of_month AND activity_date < :start_of_next_month AND account_id = :id";

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->bindParam(':start_of_month', $this->startOfMonth);
        $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);   

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['activities_count'] ?? 0;
    }

    public function getNumberOfHoursEveryActivity($id) {
        $query = "SELECT TIMEDIFF(end_time, start_time) AS hours FROM volunteer_activities WHERE activity_status = 'Recorded' AND activity_date >= :start_of_month AND activity_date < :start_of_next_month AND account_id = :id";

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->bindParam(':start_of_month', $this->startOfMonth);
        $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);   

        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }   

    public function getTotalHours($id) {
        $hours = $this->getNumberOfHoursEveryActivity($id);
        $totalSeconds = 0;

        foreach ($hours as $row) {
            $time = $row['hours']; // get the 'hours' string, e.g. "01:30:00"
            $timeParts = explode(':', $time); // [hours, minutes, seconds]

            if (count($timeParts) === 3) {
                $h = (int)$timeParts[0];
                $m = (int)$timeParts[1];
                $s = (int)$timeParts[2];
                $totalSeconds += ($h * 3600) + ($m * 60) + $s;
            }
        }

        // Convert total seconds to total hours (can return float or rounded/floored integer)
        $totalHours = $totalSeconds / 3600;
        return round($totalHours, 2); // return with 2 decimal places
    }

    /* Events */
    public function getNumberOfEvents() {
        $query = "SELECT COUNT(*) AS events_count FROM events WHERE date >= :start_of_month AND date < :start_of_next_month";

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':start_of_month', $this->startOfMonth);
        $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);   

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['events_count'] ?? 0;
    }

    public function getNumberOfJoinedScholars($eventId) {
        $query = "SELECT COUNT(DISTINCT account_id) AS joined_scholars_count FROM event_participants WHERE event_id = :event_id AND account_id IS NOT NULL";

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':event_id', $eventId, \PDO::PARAM_INT);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['joined_scholars_count'] ?? 0;
    }
}

?>