<?php

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class ScholarsModel
{
    private $table_name = 'scholars';
    private $pdo;
    private $currentYearAndMonth;
    private $currentDate;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->currentYearAndMonth = date('Y-m');
        $this->currentDate = date('Y-m-s');
    }

    public function getAllScholars($status, $school_year, $sort)
    {
        $query =
            'SELECT s.*, u.type, u.status, ai.created_at, ai.school_year, ai.type, pi.email, eb.incoming_grade FROM ' .
            $this->table_name .
            " s JOIN personal_information pi ON s.account_id = pi.application_id JOIN educational_background eb ON s.account_id = eb.application_id JOIN users u ON s.account_id = u.account_id JOIN application_info ai ON s.account_id = ai.application_id WHERE u.type = 'scholar' AND (u.status = 'active' OR u.status = 'deactivated' OR u.status = 'not_renewed')";

        if ($status === 'all') {
            $query .= " AND (ai.type = 'New' OR ai.type = 'Old')";
        } elseif ($status === 'new') {
            $query .= " AND ai.type = 'New'";
        } elseif ($status === 'old') {
            $query .= " AND ai.type = 'Old'";
        }

        if ($school_year === 'all_years') {
            $query .= '';
        } elseif ($school_year !== 'all_years') {
            $query .= " AND ai.school_year = '$school_year'";
        }

        if ($sort === 'newest') {
            $query .= ' ORDER BY ai.created_at DESC';
        } elseif ($sort === 'oldest') {
            $query .= ' ORDER BY ai.created_at ASC';
        } elseif ($sort === 'name') {
            $query .= ' ORDER BY s.first_name ASC';
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getNewActiveScholars($status, $school_year, $school, $year_level, $course)
    {
        $query =
            'SELECT s.*, u.type, u.status, ai.type, ai.school_year, ai.type, pi.email, eb.incoming_grade, eb.present_school, eb.present_course1, eb.year_level FROM ' .
            $this->table_name .
            " s JOIN personal_information pi ON s.account_id = pi.application_id JOIN educational_background eb ON s.account_id = eb.application_id JOIN users u ON s.account_id = u.account_id JOIN application_info ai ON s.account_id = ai.application_id WHERE u.type = 'scholar' AND u.status = 'active' AND ai.status = 'scholar'";

        if ($status === 'all') {
            $query .= " AND (ai.type = 'New' OR ai.type = 'Old')";
        } elseif ($status === 'new') {
            $query .= " AND ai.type = 'New'";
        } elseif ($status === 'old') {
            $query .= " AND ai.type = 'Old'";
        }

        if ($school !== 'all') {
            $query .= " AND eb.present_school = '$school'";
        }

        if ($course !== 'all') {
            $query .= " AND eb.present_course1 = '$course'";
        }

        if ($year_level !== 'all') {
            $query .= " AND eb.year_level = '$year_level'";
        }

        // if ($school_year === 'all_years') {
        //     $query .= '';
        // } elseif ($school_year !== 'all_years') {
        //     $query .= " AND ai.school_year = '$school_year'";
        // }

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // public function getOldActiveScholars(
    //     $status,
    //     $school_year,
    //     $school,
    //     $year_level,
    //     $course,
    //     $current_school_year,
    // ) {
    //     $query =
    //         'SELECT s.*, u.type, u.status, ai.type, ai.school_year, ai.type, pi.email, eb.incoming_grade, eb.present_school, eb.present_course1, eb.year_level FROM ' .
    //         $this->table_name .
    //         " s JOIN personal_information pi ON s.account_id = pi.scholar_id JOIN educational_background eb ON s.account_id = eb.scholar_id JOIN users u ON s.account_id = u.account_id JOIN application_info ai ON s.account_id = ai.scholar_id WHERE u.type = 'scholar' AND u.status = 'active' AND ai.status = 'scholar' AND ai.school_year = :school_year";

    //     if ($status === 'all') {
    //         $query .= " AND ai.type = 'Old'";
    //     } elseif ($status === 'new') {
    //         $query .= " AND ai.type = 'New'";
    //     } elseif ($status === 'old') {
    //         $query .= " AND ai.type = 'Old'";
    //     }

    //     if ($school !== 'all') {
    //         $query .= " AND eb.present_school = '$school'";
    //     }

    //     if ($course !== 'all') {
    //         $query .= " AND eb.present_course1 = '$course'";
    //     }

    //     if ($year_level !== 'all') {
    //         $query .= " AND eb.year_level = '$year_level'";
    //     }

    //     // if ($school_year === 'all_years') {
    //     //     $query .= '';
    //     // } elseif ($school_year !== 'all_years') {
    //     //     $query .= " AND ai.school_year = '$school_year'";
    //     // }

    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->bindParam(':school_year', $current_school_year);
    //     $stmt->execute();
    //     return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    // }

    public function getOldActiveScholars($status, $school_year, $school, $year_level, $course)
    {
        $query =
            'SELECT s.*, u.type, u.status, ai.type, ai.school_year, pi.email, eb.incoming_grade, eb.present_school, eb.present_course1, eb.year_level FROM ' .
            $this->table_name .
            " s JOIN personal_information pi ON s.account_id = pi.scholar_id 
            JOIN educational_background eb ON s.account_id = eb.scholar_id 
            JOIN users u ON s.account_id = u.account_id 
            JOIN (
                SELECT ai_inner.*
                FROM application_info ai_inner
                JOIN (
                    SELECT COALESCE(scholar_id, application_id) as scholar_account_id, MAX(school_year) as max_year
                    FROM application_info
                    GROUP BY COALESCE(scholar_id, application_id)
                ) latest_inner ON COALESCE(ai_inner.scholar_id, ai_inner.application_id) = latest_inner.scholar_account_id 
                            AND ai_inner.school_year = latest_inner.max_year
            ) ai ON s.account_id = ai.scholar_id
            WHERE u.type = 'scholar' AND u.status = 'active' AND ai.status = 'scholar'";

        if ($status === 'all') {
            $query .= " AND ai.type = 'Old'";
        } elseif ($status === 'new') {
            $query .= " AND ai.type = 'New'";
        } elseif ($status === 'old') {
            $query .= " AND ai.type = 'Old'";
        }

        if ($school !== 'all') {
            $query .= " AND eb.present_school = '$school'";
        }

        if ($course !== 'all') {
            $query .= " AND eb.present_course1 = '$course'";
        }

        if ($year_level !== 'all') {
            $query .= " AND eb.year_level = '$year_level'";
        }

        if ($school_year !== 'all_years') {
            $query .= " AND ai.school_year = '$school_year'";
        }

        $query .= ' GROUP BY s.account_id ORDER BY ai.school_year DESC';

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // public function getGraduatedScholars($status, $school_year, $school, $course)
    // {
    //     $query =
    //         'SELECT s.*, u.type, u.status, ai.type, ai.school_year, ai.type, pi.email, eb.incoming_grade, eb.present_school, eb.present_course1 FROM ' .
    //         $this->table_name .
    //         " s JOIN personal_information pi ON s.account_id = pi.application_id JOIN educational_background eb ON s.account_id = eb.application_id JOIN users u ON s.account_id = u.account_id JOIN application_info ai ON s.account_id = ai.application_id WHERE u.type = 'scholar' AND u.status = 'graduated'";

    //     if ($status === 'all') {
    //         $query .= " AND (ai.type = 'New' OR ai.type = 'Old')";
    //     } elseif ($status === 'new') {
    //         $query .= " AND ai.type = 'New'";
    //     } elseif ($status === 'old') {
    //         $query .= " AND ai.type = 'Old'";
    //     }

    //     if ($school !== 'all') {
    //         $query .= " AND eb.present_school = '$school'";
    //     }

    //     if ($course !== 'all') {
    //         $query .= " AND eb.present_course1 = '$course'";
    //     }

    //     if ($school_year === 'all_years') {
    //         $query .= '';
    //     } elseif ($school_year !== 'all_years') {
    //         $query .= " AND ai.school_year = '$school_year'";
    //     }

    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->execute();
    //     return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    // }

    public function getGraduatedScholars(
        $status,
        $school_year,
        $school,
        $course,
    ) {
        $query =
            'SELECT 
            s.*, 
            u.type, 
            u.status, 
            ai.type as application_type, 
            ai.school_year, 
            pi.email, 
            eb.incoming_grade, 
            eb.present_school, 
            eb.present_course1,
            eb.year_level
        FROM ' .
            $this->table_name .
            ' s
        JOIN users u 
            ON s.account_id = u.account_id
        JOIN personal_information pi 
            ON s.account_id = pi.application_id
        JOIN (
            SELECT eb_inner.*
            FROM educational_background eb_inner
            JOIN (
                SELECT COALESCE(scholar_id, application_id) as account_id, MAX(created_at) as max_created
                FROM educational_background
                GROUP BY COALESCE(scholar_id, application_id)
            ) latest_eb ON COALESCE(eb_inner.scholar_id, eb_inner.application_id) = latest_eb.account_id 
                        AND eb_inner.created_at = latest_eb.max_created
        ) eb ON (eb.application_id = s.account_id OR eb.scholar_id = s.account_id)
        JOIN (
            SELECT ai_inner.*
            FROM application_info ai_inner
            JOIN (
                SELECT COALESCE(scholar_id, application_id) as scholar_account_id, MAX(created_at) as max_created
                FROM application_info
                GROUP BY COALESCE(scholar_id, application_id)
            ) latest_inner ON COALESCE(ai_inner.scholar_id, ai_inner.application_id) = latest_inner.scholar_account_id 
                        AND ai_inner.created_at = latest_inner.max_created
        ) ai ON (s.account_id = ai.application_id OR s.account_id = ai.scholar_id)
        WHERE u.type = :user_type 
          AND u.status = :user_status';

        $params = [
            ':user_type' => 'scholar',
            ':user_status' => 'graduated',
        ];

        if ($status === 'all') {
            $query .= " AND ai.type IN ('New', 'Old')";
        } elseif ($status === 'new') {
            $query .= ' AND ai.type = :app_type';
            $params[':app_type'] = 'New';
        } elseif ($status === 'old') {
            $query .= ' AND ai.type = :app_type';
            $params[':app_type'] = 'Old';
        }

        if ($school !== 'all') {
            $query .= ' AND eb.present_school = :school';
            $params[':school'] = $school;
        }

        if ($course !== 'all') {
            $query .= ' AND eb.present_course1 = :course';
            $params[':course'] = $course;
        }

        if ($school_year !== 'all_years') {
            $query .= ' AND ai.school_year = :school_year';
            $params[':school_year'] = $school_year;
        }

        $query .= ' GROUP BY s.account_id ORDER BY s.last_name ASC, s.first_name ASC';

        $stmt = $this->pdo->prepare($query);

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // public function getTerminatedScholars($status, $school_year, $school, $course)
    // {
    //     $query =
    //         'SELECT s.*, u.type, u.status, ai.type, ai.school_year, ai.type, pi.email, eb.incoming_grade, eb.present_school, eb.present_course1 FROM ' .
    //         $this->table_name .
    //         " s JOIN personal_information pi ON s.account_id = pi.application_id JOIN educational_background eb ON s.account_id = eb.application_id JOIN users u ON s.account_id = u.account_id JOIN application_info ai ON s.account_id = ai.application_id WHERE u.type = 'scholar' AND u.status = 'terminated'";

    //     if ($status === 'all') {
    //         $query .= " AND (ai.type = 'New' OR ai.type = 'Old')";
    //     } elseif ($status === 'new') {
    //         $query .= " AND ai.type = 'New'";
    //     } elseif ($status === 'old') {
    //         $query .= " AND ai.type = 'Old'";
    //     }

    //     if ($school !== 'all') {
    //         $query .= " AND eb.present_school = '$school'";
    //     }

    //     if ($course !== 'all') {
    //         $query .= " AND eb.present_course1 = '$course'";
    //     }

    //     if ($school_year === 'all_years') {
    //         $query .= '';
    //     } elseif ($school_year !== 'all_years') {
    //         $query .= " AND ai.school_year = '$school_year'";
    //     }

    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->execute();
    //     return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    // }

    public function getTerminatedScholars($status, $school_year, $school, $course)
    {
        $query =
            'SELECT 
            s.*, 
            u.type, 
            u.status, 
            ai.type as application_type, 
            ai.school_year, 
            pi.email, 
            eb.incoming_grade, 
            eb.present_school, 
            eb.present_course1,
            eb.year_level
        FROM ' .
            $this->table_name .
            ' s
        JOIN users u 
            ON s.account_id = u.account_id
        JOIN personal_information pi 
            ON s.account_id = pi.application_id
        JOIN (
            SELECT eb_inner.*
            FROM educational_background eb_inner
            JOIN (
                SELECT COALESCE(scholar_id, application_id) as account_id, MAX(created_at) as max_created
                FROM educational_background
                GROUP BY COALESCE(scholar_id, application_id)
            ) latest_eb ON COALESCE(eb_inner.scholar_id, eb_inner.application_id) = latest_eb.account_id 
                        AND eb_inner.created_at = latest_eb.max_created
        ) eb ON (eb.application_id = s.account_id OR eb.scholar_id = s.account_id)
        JOIN (
            SELECT ai_inner.*
            FROM application_info ai_inner
            JOIN (
                SELECT COALESCE(scholar_id, application_id) as scholar_account_id, MAX(created_at) as max_created
                FROM application_info
                GROUP BY COALESCE(scholar_id, application_id)
            ) latest_inner ON COALESCE(ai_inner.scholar_id, ai_inner.application_id) = latest_inner.scholar_account_id 
                        AND ai_inner.created_at = latest_inner.max_created
        ) ai ON (s.account_id = ai.application_id OR s.account_id = ai.scholar_id)
        WHERE u.type = :user_type 
          AND u.status = :user_status';

        $params = [
            ':user_type' => 'scholar',
            ':user_status' => 'terminated',
        ];

        if ($status === 'all') {
            $query .= " AND ai.type IN ('New', 'Old')";
        } elseif ($status === 'new') {
            $query .= ' AND ai.type = :app_type';
            $params[':app_type'] = 'New';
        } elseif ($status === 'old') {
            $query .= ' AND ai.type = :app_type';
            $params[':app_type'] = 'Old';
        }

        if ($school !== 'all') {
            $query .= ' AND eb.present_school = :school';
            $params[':school'] = $school;
        }

        if ($course !== 'all') {
            $query .= ' AND eb.present_course1 = :course';
            $params[':course'] = $course;
        }

        if ($school_year !== 'all_years') {
            $query .= ' AND ai.school_year = :school_year';
            $params[':school_year'] = $school_year;
        }

        $query .= ' GROUP BY s.account_id ORDER BY s.last_name ASC, s.first_name ASC';

        $stmt = $this->pdo->prepare($query);

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // public function getNotRenewedScholars($status, $school_year, $school, $course)
    // {
    //     $query =
    //         'SELECT s.*, u.type, u.status, ai.type, ai.school_year, ai.type, pi.email, eb.incoming_grade, eb.present_school, eb.present_course1 FROM ' .
    //         $this->table_name .
    //         " s JOIN personal_information pi ON s.account_id = pi.application_id JOIN educational_background eb ON s.account_id = eb.application_id JOIN users u ON s.account_id = u.account_id JOIN application_info ai ON s.account_id = ai.application_id WHERE u.type = 'scholar' AND u.status = 'not_renewed'";

    //     if ($status === 'all') {
    //         $query .= " AND (ai.type = 'New' OR ai.type = 'Old')";
    //     } elseif ($status === 'new') {
    //         $query .= " AND ai.type = 'New'";
    //     } elseif ($status === 'old') {
    //         $query .= " AND ai.type = 'Old'";
    //     }

    //     if ($school !== 'all') {
    //         $query .= " AND eb.present_school = '$school'";
    //     }

    //     if ($course !== 'all') {
    //         $query .= " AND eb.present_course1 = '$course'";
    //     }

    //     if ($school_year !== 'all_years') {
    //         $query .= " AND ai.school_year = '$school_year'";
    //     }

    //     $query .= ' ORDER BY ai.school_year DESC';

    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->execute();
    //     return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    // }

    public function getNotRenewedScholars($status, $school_year, $school, $course)
    {
        $query =
            'SELECT s.*, u.type, u.status, ai.type, ai.school_year, pi.email, eb.incoming_grade, eb.present_school, eb.present_course1 FROM ' .
            $this->table_name .
            " s JOIN personal_information pi ON s.account_id = pi.application_id 
                JOIN educational_background eb ON s.account_id = eb.application_id 
                JOIN users u ON s.account_id = u.account_id 
                JOIN (
                    SELECT ai_inner.*
                    FROM application_info ai_inner
                    JOIN (
                        SELECT COALESCE(scholar_id, application_id) as scholar_account_id, MAX(school_year) as max_year
                        FROM application_info
                        GROUP BY COALESCE(scholar_id, application_id)
                    ) latest_inner ON COALESCE(ai_inner.scholar_id, ai_inner.application_id) = latest_inner.scholar_account_id 
                                AND ai_inner.school_year = latest_inner.max_year
                ) ai ON (s.account_id = ai.application_id OR s.account_id = ai.scholar_id)
                WHERE u.type = 'scholar' AND u.status = 'not_renewed'";

        if ($status === 'all') {
            $query .= " AND (ai.type = 'New' OR ai.type = 'Old')";
        } elseif ($status === 'new') {
            $query .= " AND ai.type = 'New'";
        } elseif ($status === 'old') {
            $query .= " AND ai.type = 'Old'";
        }

        if ($school !== 'all') {
            $query .= " AND eb.present_school = '$school'";
        }

        if ($course !== 'all') {
            $query .= " AND eb.present_course1 = '$course'";
        }

        if ($school_year !== 'all_years') {
            $query .= " AND ai.school_year = '$school_year'";
        }

        $query .= ' GROUP BY s.account_id ORDER BY ai.school_year DESC';

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllScholarsId()
    {
        $query =
            'SELECT s.account_id, u.status FROM ' .
            $this->table_name .
            " s JOIN users u ON s.account_id = u.account_id WHERE u.status = 'active'";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getScholarRenderedHours($scholarId)
    {
        $query =
            'SELECT rendered_hours FROM ' . $this->table_name . ' WHERE account_id = :scholar_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId, \PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            return $row['rendered_hours'];
        }

        return null;
    }

    // public function getAllScholarAllowances($school_year, $school)
    // {
    //     $query =
    //         '
    //     SELECT
    //         s.first_name,
    //         s.last_name,
    //         eb.year_level,
    //         s.allowance,
    //         s.transport_allowance,
    //         s.load_allowance
    //     FROM ' .
    //         $this->table_name .
    //         ' s
    //     JOIN users u
    //         ON s.account_id = u.account_id
    //     JOIN educational_background eb
    //         ON (eb.application_id = s.account_id OR eb.scholar_id = s.account_id)
    //     JOIN application_info ai
    //         ON (ai.application_id = s.account_id OR ai.scholar_id = s.account_id)
    //     WHERE u.status = "active"
    //       AND ai.school_year = :school_year AND eb.present_school = :school
    // ';

    //     // ORDER BY s.last_name ASC, ORDER BY s.first_name ASC

    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->bindParam(':school_year', $school_year);
    //     $stmt->bindParam(':school', $school);
    //     $stmt->execute();

    //     return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    // }

    public function getAllScholarAllowances($school_year, $school)
    {
        $query =
            '
        SELECT 
            s.first_name, 
            s.last_name, 
            eb.year_level, 
            s.allowance, 
            s.transport_allowance, 
            s.load_allowance
        FROM ' .
            $this->table_name .
            ' s
        JOIN users u 
            ON s.account_id = u.account_id
        JOIN (
            SELECT eb_inner.*
            FROM educational_background eb_inner
            JOIN (
                SELECT COALESCE(scholar_id, application_id) as account_id, MAX(created_at) as max_created
                FROM educational_background
                GROUP BY COALESCE(scholar_id, application_id)
            ) latest_eb ON COALESCE(eb_inner.scholar_id, eb_inner.application_id) = latest_eb.account_id 
                        AND eb_inner.created_at = latest_eb.max_created
        ) eb ON (eb.application_id = s.account_id OR eb.scholar_id = s.account_id)
        JOIN (
            SELECT ai_inner.*
            FROM application_info ai_inner
            JOIN (
                SELECT COALESCE(scholar_id, application_id) as scholar_account_id, MAX(created_at) as max_created
                FROM application_info
                GROUP BY COALESCE(scholar_id, application_id)
            ) latest_inner ON COALESCE(ai_inner.scholar_id, ai_inner.application_id) = latest_inner.scholar_account_id 
                        AND ai_inner.created_at = latest_inner.max_created
        ) ai ON (s.account_id = ai.application_id OR s.account_id = ai.scholar_id)
        WHERE u.status = "active"
          AND ai.school_year = :school_year 
          AND eb.present_school = :school
        GROUP BY s.account_id
        ORDER BY s.last_name ASC, s.first_name ASC
    ';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $school_year);
        $stmt->bindParam(':school', $school);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAccountStatus($id)
    {
        $query = 'SELECT status FROM users WHERE account_id = :scholar_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            return $row['status'];
        }

        return null;
    }

    public function unProcessScholarsAllowance($scholarId, $allowance)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            ' SET allowance = :allowance WHERE account_id = :scholar_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId, \PDO::PARAM_INT);
        $stmt->bindParam(':allowance', $allowance);
        return $stmt->execute();
    }

    public function processScholarsAllowance($scholarId, $allowance, $renderedHours)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            ' SET rendered_hours = :rendered_hours, allowance = :allowance WHERE account_id = :scholar_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId, \PDO::PARAM_INT);
        $stmt->bindParam(':rendered_hours', $renderedHours);
        $stmt->bindParam(':allowance', $allowance);
        return $stmt->execute();
    }

    public function resetCommunityServiceAndEventRenderedHours()
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " SET community_service_rendered_hours = 0, event_rendered_hours = 0, community_event_rendered_hours_reset_at = NOW() WHERE DATE_FORMAT(community_event_rendered_hours_reset_at, '%Y-%m') != '$this->currentYearAndMonth'";
        $stmt = $this->pdo->prepare($query);
        return $stmt->execute();
    }

    public function resetLivingInfoAndTransportInfoSubmission()
    {
        $query =
            "
        UPDATE " .
            $this->table_name .
            " s
        JOIN users u ON s.account_id = u.account_id
        SET s.	has_submitted_living_info = '0' WHERE u.status = 'active'";

        $stmt = $this->pdo->prepare($query);
        return $stmt->execute();
    }

    public function resetAllScholarsAllowanceStatusToPending()
    {
        $query =
            '
        UPDATE ' .
            $this->table_name .
            ' s
        JOIN users u ON s.account_id = u.account_id
        SET s.allowance_status = "pending", allowance = 0
        WHERE u.status = "active"
    ';

        $stmt = $this->pdo->prepare($query);
        return $stmt->execute();
    }

    public function setIsSubmittedTransportInfo($scholarId)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            ' SET has_submitted_living_info = 1 WHERE account_id = :scholar_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId);
        return $stmt->execute();
    }

    public function setScholarsAsNotRenewed($id)
    {
        $query =
            "UPDATE users SET status = 'not_renewed' WHERE type = 'scholar' AND status = 'active' AND account_id = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function setScholarsAsActive($id)
    {
        $query = "UPDATE users SET status = 'active' WHERE type = 'scholar' AND account_id = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        return $stmt->execute();
    }
}

?>
