<?php
namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class StaffDashboardDataModel
{
    private $pdo;
    private $currentYear;
    private $currentDateTime;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->currentDateTime = date('Y-m-d H:i:s');
        $this->currentYear = date('Y');
    }

    public function getUserName($id)
    {
        $query = 'SELECT first_name FROM staff WHERE account_id = :account_id';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            return $row['first_name'];
        }

        return null;
    }

    public function getNumberOfActiveScholars()
    {
        $query = "SELECT COUNT(*) AS scholar_count FROM scholars s JOIN users u
                  ON u.account_id = s.account_id WHERE u.status = 'active' AND u.type = 'scholar'";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
    }

    public function getNumberOfAllApplications()
    {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE (is_application_approved = '0' OR is_application_approved = '1' OR is_application_rejected = '1') AND YEAR(created_at) = $this->currentYear";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfNewApplications($school_year)
    {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE is_application_approved = '0' AND is_application_rejected = '0' AND type = 'New' AND school_year = :school_year";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":school_year", $school_year);
        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfOldApplications($school_year)
    {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE is_application_approved = '0' AND is_application_rejected = '0' AND type = 'Old' AND school_year = :school_year";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":school_year", $school_year);
        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfApprovedApplications($school_year)
    {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE is_application_approved = '1' AND school_year = :school_year";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $school_year);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfRejectedApplications($school_year)
    {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE is_application_rejected = '1'AND school_year = :school_year";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $school_year);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfApplicantsEligibleForExam()
    {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE is_application_approved = '1' AND is_eligible_for_exam = '1' AND type = 'New' AND YEAR(created_at) = $this->currentYear";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfApplicantsForInitialInterview()
    {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE is_application_approved = '1' AND is_eligible_for_exam = '1' AND is_examination_passed = '1' AND is_for_initial_interview = '1' AND type = 'New' AND YEAR(created_at) = $this->currentYear";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfApplicantsForHomeVisitation()
    {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE is_application_approved = '1' AND is_eligible_for_exam = '1' AND is_examination_passed = '1' AND is_for_initial_interview = '1' AND is_initial_interview_passed = '1' and is_for_home_visitation = '1' AND type = 'New' AND YEAR(created_at) = $this->currentYear";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfApplicantsForFinalInterview()
    {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE is_application_approved = '1' AND is_eligible_for_exam = '1' AND is_examination_passed = '1' AND is_for_initial_interview = '1' AND is_initial_interview_passed = '1' and is_for_home_visitation = '1' AND is_home_visitation_qualified = '1' AND is_for_final_interview = '1' AND type = 'New' AND YEAR(created_at) = $this->currentYear";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfApplicantsForOrientation()
    {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE is_application_approved = '1' AND is_eligible_for_exam = '1' AND is_examination_passed = '1' AND is_for_initial_interview = '1' AND is_initial_interview_passed = '1' and is_for_home_visitation = '1' AND is_home_visitation_qualified = '1' AND is_for_final_interview = '1' AND is_final_interview_passed = '1' AND is_for_orientation = '1' AND type = 'New' AND YEAR(created_at) = $this->currentYear";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfApplicantsForAwarding()
    {
        $query = "SELECT COUNT(*) AS application_count FROM application_info
                  WHERE is_application_approved = '1' AND is_eligible_for_exam = '1' AND is_examination_passed = '1' AND is_for_initial_interview = '1' AND is_initial_interview_passed = '1' and is_for_home_visitation = '1' AND is_home_visitation_qualified = '1' AND is_for_final_interview = '1' AND is_final_interview_passed = '1' AND is_for_orientation = '1' AND is_attended_orientation = '1' AND is_for_awarding = '1' AND type = 'New' AND YEAR(created_at) = $this->currentYear";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['application_count'] ?? 0;
    }

    public function getNumberOfAllScholars()
    {
        $query = "SELECT COUNT(*) AS scholar_count FROM application_info ai JOIN scholars s 
                  ON ai.application_id = s.account_id";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
    }

    public function getNumberOfNewScholars()
    {
        $query = "SELECT COUNT(*) AS scholar_count, ai.type FROM application_info ai JOIN scholars s 
                  ON ai.application_id = s.account_id WHERE ai.type = 'New'";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
    }

    public function getNumberOfOldScholars()
    {
        $query = "SELECT COUNT(*) AS scholar_count, ai.type FROM application_info ai JOIN scholars s 
                  ON ai.application_id = s.account_id WHERE ai.type = 'Old'";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
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

    public function getNumberOfNewCommunityServices()
    {
        $query =
            "SELECT COUNT(*) AS community_service_count FROM volunteer_activities WHERE activity_status = 'Pending'";

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['community_service_count'] ?? 0;
    }

    public function getApplicationData($school_year)
    {
        $query = "SELECT 
            (SELECT COUNT(*) FROM application_info WHERE school_year = :school_year) AS application,
            (SELECT COUNT(*) FROM application_info WHERE is_eligible_for_exam = 1 AND school_year = :school_year) AS exam,
            (SELECT COUNT(*) FROM application_info WHERE is_for_initial_interview = 1 AND school_year = :school_year) AS interview,
            (SELECT COUNT(*) FROM application_info WHERE is_for_home_visitation = 1 AND school_year = :school_year) AS home_visit,
            (SELECT COUNT(*) FROM application_info WHERE is_for_final_interview = 1 AND school_year = :school_year) AS final_interview,
            (SELECT COUNT(*) FROM application_info WHERE is_for_orientation = 1 AND school_year = :school_year) AS orientation,
            (SELECT COUNT(*) FROM application_info WHERE is_for_awarding = 1 AND school_year = :school_year) AS awarding
        ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $school_year);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result;
    }

    // public function getOrientationAndAwardingData()
    // {
    //     $query = "SELECT
    //         (SELECT COUNT(*) FROM application_info WHERE is_for_orientation = 1) AS orientation,
    //         (SELECT COUNT(*) FROM application_info WHERE is_for_awarding = 1) AS awarding
    //     ";

    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->execute();
    //     $result = $stmt->fetch(\PDO::FETCH_ASSOC);
    //     return $result;
    // }

    public function getMonthlyAllowanceDistributionData()
    {
        $query = "SELECT allowance_month,
            amount
          FROM allowance_cycles
          WHERE YEAR(allowance_month) = :current_year
          ORDER BY cutoff_date";

        $stmt = $this->pdo->prepare($query);

        $currentYear = 2025;

        $stmt->bindParam(':current_year', $currentYear, \PDO::PARAM_INT);

        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getTenScholarsByHighestDutyHours()
    {
        $query = "SELECT s.first_name, s.last_name, s.rendered_hours
                  FROM scholars s
                  JOIN users u ON s.account_id = u.account_id
                  WHERE u.status = 'active'
                  ORDER BY s.rendered_hours DESC LIMIT 10";

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getEventAttendanceData()
    {
        $query = "SELECT 
                m.month_name,
                COALESCE(attendance.attended, 0) AS scholars_attended,
                COALESCE(attendance.percent, 0) AS attendance_percent
            FROM 
            (
                SELECT 1 AS month_num, 'January' AS month_name UNION
                SELECT 2, 'February' UNION
                SELECT 3, 'March' UNION
                SELECT 4, 'April' UNION
                SELECT 5, 'May' UNION
                SELECT 6, 'June' UNION
                SELECT 7, 'July' UNION
                SELECT 8, 'August' UNION
                SELECT 9, 'September' UNION
                SELECT 10, 'October' UNION
                SELECT 11, 'November' UNION
                SELECT 12, 'December'
            ) AS m
            LEFT JOIN 
            (
                SELECT 
                    MONTH(e.date) AS month_num,
                    COUNT(DISTINCT ep.account_id) AS attended,
                    (COUNT(DISTINCT ep.account_id) / 
                        (SELECT COUNT(*) FROM users WHERE type='scholar' AND status='active')
                    ) * 100 AS percent
                FROM events e
                JOIN event_participants ep 
                    ON ep.event_id = e.id
                WHERE ep.is_attended = 1 AND YEAR(ep.created_at) = :current_year
                GROUP BY MONTH(e.date)
            ) AS attendance
            ON m.month_num = attendance.month_num
            ORDER BY m.month_num";

        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':current_year', $this->currentYear, \PDO::PARAM_INT);

        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getCommunityServiceHoursCompletion()
    {
        $query = "SELECT 
                        m.month_name,
                        COALESCE(SUM(cs.hours_earned), 0) AS hours_earned,
                        (COALESCE(SUM(cs.hours_earned), 0) / 
                            ((SELECT COUNT(*) FROM users WHERE type='scholar' AND status='active') * 20)
                        ) * 100 AS completion_percent
                    FROM (
                        SELECT 1 AS month_num, 'January' AS month_name UNION
                        SELECT 2, 'February' UNION
                        SELECT 3, 'March' UNION
                        SELECT 4, 'April' UNION
                        SELECT 5, 'May' UNION
                        SELECT 6, 'June' UNION
                        SELECT 7, 'July' UNION
                        SELECT 8, 'August' UNION
                        SELECT 9, 'September' UNION
                        SELECT 10, 'October' UNION
                        SELECT 11, 'November' UNION
                        SELECT 12, 'December'
                    ) m
                    LEFT JOIN community_service_entries cs
                        ON MONTH(cs.date_served) = m.month_num AND YEAR(cs.created_at) = :current_year
                    GROUP BY m.month_num;
                    ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':current_year', $this->currentYear, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}
?>
