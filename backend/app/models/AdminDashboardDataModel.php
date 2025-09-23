<?php 
namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class AdminDashboardDataModel {
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

    public function getNumberOfAllScholars() {
        $query = "SELECT COUNT(*) AS scholar_count FROM application_info ai JOIN scholars s 
                  ON ai.application_id = s.account_id";


        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
    }

    public function getNumberOfPendingScholars() {
        $query = "SELECT COUNT(*) AS scholar_count FROM application_info
                  WHERE is_application_approved = '1' AND is_examination_passed = '1'";


        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
    }

    public function getNumberOfActiveScholars() {
        $query = "SELECT u.status, u.type, COUNT(*) AS scholar_count FROM users u JOIN scholars s 
                  ON u.account_id = s.account_id
                  WHERE u.status = 'active' AND u.type = 'scholar'";


        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
    }

    public function getNumberOfDeactivatedScholars() {
        $query = "SELECT u.status, u.type, COUNT(*) AS scholar_count FROM users u JOIN scholars s 
                  ON u.account_id = s.account_id
                  WHERE u.status = 'deactivated' AND u.type = 'scholar'";


        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
    }


    public function getNumberOfAllStaffs() {
        $query = "SELECT u.status, u.type, COUNT(*) AS staff_count FROM users u JOIN staff s 
                  ON u.account_id = s.account_id
                  WHERE u.status = 'active' AND u.type = 'staff'";


        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['staff_count'] ?? 0;
    }
}
?>