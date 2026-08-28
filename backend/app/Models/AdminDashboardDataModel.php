<?php
namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class AdminDashboardDataModel
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

    public function getNumberOfAllScholars()
    {
        $query = "SELECT COUNT(*) AS scholar_count FROM application_info ai JOIN scholars s 
                  ON ai.application_id = s.account_id";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
    }

    public function getNumberOfPendingScholars()
    {
        $query = "SELECT COUNT(*) AS scholar_count FROM application_info
                  WHERE is_application_approved = '1' AND is_examination_passed = '1' AND is_initial_interview_passed = '1'
                     AND is_home_visitation_qualified = '1' AND is_final_interview_passed = '1' AND is_attended_orientation = '1' AND is_attended_awarding = '1' AND status = 'is_attended_awarding'";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
    }

    public function getNumberOfActiveScholars()
    {
        $query = "SELECT u.status, u.type, COUNT(*) AS scholar_count FROM users u JOIN scholars s 
                  ON u.account_id = s.account_id
                  WHERE u.status = 'active' AND u.type = 'scholar'";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
    }

    public function getNumberOfDeactivatedScholars()
    {
        $query = "SELECT u.status, u.type, COUNT(*) AS scholar_count FROM users u JOIN scholars s 
                  ON u.account_id = s.account_id
                  WHERE u.status = 'deactivated' AND u.type = 'scholar'";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
    }

    public function getNumberOfNotRenewedScholars()
    {
        $query = "SELECT u.status, u.type, COUNT(*) AS scholar_count FROM users u JOIN scholars s 
                  ON u.account_id = s.account_id
                  WHERE u.status = 'not_renewed' AND u.type = 'scholar'";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['scholar_count'] ?? 0;
    }

    public function getNumberOfAllStaffs()
    {
        $query = "SELECT u.status, u.type, COUNT(*) AS staff_count FROM users u JOIN staff s 
                  ON u.account_id = s.account_id
                  WHERE u.status = 'active' AND u.type = 'staff'";

        $stmt = $this->pdo->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result['staff_count'] ?? 0;
    }

    public function getScholarsByProgram($school_year)
    {
        $query = "SELECT 
                    CASE
                        WHEN present_course1 LIKE '%Technology%' THEN 'Technology'
                        WHEN present_course1 LIKE '%Computer Science%' THEN 'Technology'
                        WHEN present_course1 LIKE '%Information Technology%' THEN 'Technology'
                        WHEN present_course1 LIKE '%Engineering%' THEN 'Engineering'
                        WHEN present_course1 LIKE '%Architecture%' THEN 'Architecture'
                        WHEN present_course1 LIKE '%Business%' THEN 'Business And Management'
                        WHEN present_course1 LIKE '%Management%' THEN 'Business And Management'
                        WHEN present_course1 LIKE '%Accounting%' THEN 'Business And Management'
                        WHEN present_course1 LIKE '%Finance%' THEN 'Business And Management'
                        WHEN present_course1 LIKE '%Marketing%' THEN 'Business And Management'
                        WHEN present_course1 LIKE '%Education%' THEN 'Education'
                        WHEN present_course1 LIKE '%Teaching%' THEN 'Education'
                        WHEN present_course1 LIKE '%Nursing%' THEN 'Nursing'
                        WHEN present_course1 LIKE '%Medicine%' THEN 'Health Sciences'
                        WHEN present_course1 LIKE '%Medical%' THEN 'Health Sciences'
                        WHEN present_course1 LIKE '%Pharmacy%' THEN 'Health Sciences'
                        WHEN present_course1 LIKE '%Psychology%' THEN 'Social Sciences'
                        WHEN present_course1 LIKE '%Sociology%' THEN 'Social Sciences'
                        WHEN present_course1 LIKE '%Political%' THEN 'Social Sciences'
                        WHEN present_course1 LIKE '%Communication%' THEN 'Arts And Humanities'
                        WHEN present_course1 LIKE '%English%' THEN 'Arts And Humanities'
                        WHEN present_course1 LIKE '%Arts%' THEN 'Arts And Humanities'
                        WHEN present_course1 LIKE '%Biology%' THEN 'Science'
                        WHEN present_course1 LIKE '%Chemistry%' THEN 'Science'
                        WHEN present_course1 LIKE '%Mathematics%' THEN 'Science'
                        WHEN present_course1 LIKE '%Law%' THEN 'Law'
                        WHEN present_course1 LIKE '%Agriculture%' THEN 'Agriculture'
                        WHEN present_course1 LIKE '%Hospitality%' THEN 'Hospitality And Tourism'
                        WHEN present_course1 LIKE '%Tourism%' THEN 'Hospitality And Tourism'
                        ELSE 'Others'
                    END AS category,
                    COUNT(*) AS total_scholars
                FROM educational_background eb
                JOIN application_info ai ON ai.application_id = eb.application_id
                WHERE ai.school_year = :school_year AND status = 'scholar'
                GROUP BY category
                ORDER BY total_scholars DESC;
                ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $school_year);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getApplicationsSubmittedAndApplicationsApproved($school_year)
    {
        $query = "WITH months AS (
                        SELECT 1 AS month_num, 'Jan' AS month_name UNION ALL
                        SELECT 2, 'Feb' UNION ALL
                        SELECT 3, 'Mar' UNION ALL
                        SELECT 4, 'Apr' UNION ALL
                        SELECT 5, 'May' UNION ALL
                        SELECT 6, 'Jun' UNION ALL
                        SELECT 7, 'Jul' UNION ALL
                        SELECT 8, 'Aug' UNION ALL
                        SELECT 9, 'Sep' UNION ALL
                        SELECT 10, 'Oct' UNION ALL
                        SELECT 11, 'Nov' UNION ALL
                        SELECT 12, 'Dec'
                    )

                    SELECT 
                        m.month_name,
                        COALESCE(sub.total_submitted, 0) AS applications_submitted,
                        COALESCE(app.total_approved, 0) AS applications_approved
                    FROM months m
                    LEFT JOIN (
                        SELECT 
                            MONTH(created_at) AS month_num,
                            COUNT(*) AS total_submitted
                        FROM application_info
                        WHERE school_year = :school_year
                        GROUP BY MONTH(created_at)
                    ) sub ON m.month_num = sub.month_num
                    LEFT JOIN (
                        SELECT 
                            MONTH(approved_at) AS month_num,
                            COUNT(*) AS total_approved
                        FROM application_info
                        WHERE is_application_approved = '1' AND is_added_from_admin = '0' AND school_year = :school_year
                        GROUP BY MONTH(approved_at)
                    ) app ON m.month_num = app.month_num
                    ORDER BY m.month_num;
                    ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $school_year);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getApprovedAndRejectedByStage($school_year)
    {
        $query = "WITH stages AS (
                        SELECT 1 AS stage_order, 'Application' AS stage_name UNION ALL
                        SELECT 2, 'Exam' UNION ALL
                        SELECT 3, 'Interview' UNION ALL
                        SELECT 4, 'Home Visit' UNION ALL
                        SELECT 5, 'Final Interview'
                    )

                    SELECT
                        s.stage_name,
                        
                        -- APPROVED COUNTS
                        CASE s.stage_name
                            WHEN 'Application' THEN (SELECT COUNT(*) FROM application_info WHERE is_application_approved = '1' AND is_added_from_admin = '0' AND school_year = :school_year)
                            WHEN 'Exam' THEN (SELECT COUNT(*) FROM application_info WHERE is_examination_passed = '1' AND is_added_from_admin = '0' AND school_year = :school_year)
                            WHEN 'Interview' THEN (SELECT COUNT(*) FROM application_info WHERE is_initial_interview_passed = '1' AND is_added_from_admin = '0' AND school_year = :school_year)
                            WHEN 'Home Visit' THEN (SELECT COUNT(*) FROM application_info WHERE is_home_visitation_qualified = '1' AND is_added_from_admin = '0' AND school_year = :school_year)
                            WHEN 'Final Interview' THEN (SELECT COUNT(*) FROM application_info WHERE is_final_interview_passed = '1' AND is_added_from_admin = '0' AND school_year = :school_year)
                        END AS approved,

                        -- REJECTED COUNTS
                        CASE s.stage_name
                            WHEN 'Application' THEN (SELECT COUNT(*) FROM application_info WHERE is_application_rejected = '1' AND school_year = :school_year)
                            WHEN 'Exam' THEN (SELECT COUNT(*) FROM application_info WHERE is_examination_failed = '1' AND school_year = :school_year)
                            WHEN 'Interview' THEN (SELECT COUNT(*) FROM application_info WHERE is_initial_interview_failed = '1' AND school_year = :school_year)
                            WHEN 'Home Visit' THEN (SELECT COUNT(*) FROM application_info WHERE is_home_visitation_not_qualified = '1' AND school_year = :school_year)
                            WHEN 'Final Interview' THEN (SELECT COUNT(*) FROM application_info WHERE is_final_interview_failed = '1' AND school_year = :school_year)
                        END AS rejected

                    FROM stages s
                    ORDER BY s.stage_order;
                    ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $school_year);
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
