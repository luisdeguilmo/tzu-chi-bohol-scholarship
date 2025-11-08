<?php
namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class ScholarDashboardDataModel
{
    private $pdo;
    private $currentYear;
    private $currentDateTime;
    private $startOfMonth;
    private $startOfNextMonth;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->currentDateTime = date('Y-m-d H:i:s');
        $this->currentYear = date('Y');
        $this->startOfMonth = date('Y-m-01');
        $this->startOfNextMonth = date('Y-m-01', strtotime('first day of next month'));
    }

    public function getUserName($id)
    {
        $query = 'SELECT first_name FROM scholars WHERE account_id = :account_id';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            return $row['first_name'];
        }

        return null;
    }

    public function isSubmittedLivingInfo($id)
    {
        $query = 'SELECT has_submitted_living_info FROM scholars WHERE account_id = :account_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result && (bool) $result['has_submitted_living_info'];
    }

    public function getRenderedHours($id)
    {
        $query = 'SELECT rendered_hours FROM scholars WHERE account_id = :account_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            return $row['rendered_hours'];
        }

        return null;
    }

    public function getAttendedEvents($id)
    {
        $query = 'SELECT attended_events FROM scholars WHERE account_id = :account_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            return $row['attended_events'];
        }

        return null;
    }

    public function getNumberOfUpcomingEvents()
    {
        $query =
            "SELECT COUNT(*) AS event_count FROM events WHERE CONCAT(date, ' ', start_time) > :current_datetime";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':current_datetime', $this->currentDateTime);
        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['event_count'] ?? 0;
    }

    public function getNumberOfCommunityServices($id)
    {
        $query =
            'SELECT COUNT(*) AS community_service_count FROM volunteer_activities WHERE activity_date >= :start_of_month AND activity_date < :start_of_next_month AND account_id = :account_id';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $id);
        $stmt->bindParam(':start_of_month', $this->startOfMonth);
        $stmt->bindParam(':start_of_next_month', $this->startOfNextMonth);
        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['community_service_count'] ?? 0;
    }

    public function getRenewalApplicationStatus($id)
    {
        $query =
            "SELECT is_application_approved, is_application_rejected, created_at FROM application_info WHERE (status = 'scholar' OR status = 'pending') AND scholar_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $id);
        // $stmt->bindParam(':school_year', $schoolYear);
        $stmt->execute();

        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
}
?>
