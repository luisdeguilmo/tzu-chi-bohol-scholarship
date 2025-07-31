<?php 
namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class StaffDashboardDataModel {
    private $pdo;
    private $currentYear;
    private $currentDateTime;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->currentDateTime = date('Y-m-d H:i:s');
        $this->currentYear = date('Y');
    }

    public function getUserName($id) {
        $query = "SELECT first_name FROM staff WHERE account_id = :account_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":account_id", $id, \PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
                
        if ($row) {
            return $row['first_name'];
        }

        return null;
    }

    public function getNumberOfAllApplications() {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE (is_application_approved = '0' OR is_application_approved = '1' OR is_application_rejected = '1') AND YEAR(created_at) = $this->currentYear";


        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfNewApplications() {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE is_application_approved = '0' AND is_application_rejected = '0' AND type = 'New' AND YEAR(created_at) = $this->currentYear";


        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfOldApplications() {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE is_application_approved = '0' AND is_application_rejected = '0' AND type = 'Old' AND YEAR(created_at) = $this->currentYear";


        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfApprovedApplications() {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE is_application_approved = '1' AND YEAR(created_at) = $this->currentYear";


        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfRejectedApplications() {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE is_application_rejected = '1'AND YEAR(created_at) = $this->currentYear";


        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfAllScholars() {
        $query = "SELECT COUNT(*) AS scholar_count FROM application_info ai JOIN scholars s 
                  ON ai.application_id = s.account_id";


        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
    }

    public function getNumberOfNewScholars() {
        $query = "SELECT COUNT(*) AS scholar_count, ai.type FROM application_info ai JOIN scholars s 
                  ON ai.application_id = s.account_id WHERE ai.type = 'New'";


        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
    }

    public function getNumberOfOldScholars() {
        $query = "SELECT COUNT(*) AS scholar_count, ai.type FROM application_info ai JOIN scholars s 
                  ON ai.application_id = s.account_id WHERE ai.type = 'Old'";


        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
    }

    public function getNumberOfUpcomingEvents() {
        $query = "SELECT COUNT(*) AS event_count FROM events WHERE CONCAT(date, ' ', start_time) > :current_datetime";


        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":current_datetime", $this->currentDateTime);
        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['event_count'] ?? 0;
    }

    public function getNumberOfNewCommunityServices() {
        $query = "SELECT COUNT(*) AS community_service_count FROM volunteer_activities WHERE activity_status = 'Pending'";

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['community_service_count'] ?? 0;
    }
}
?>