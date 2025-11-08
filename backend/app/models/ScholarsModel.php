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

    public function getNewActiveScholars($status, $school_year)
    {
        $query =
            'SELECT s.*, u.type, u.status, ai.type, ai.school_year, ai.type, pi.email, eb.incoming_grade FROM ' .
            $this->table_name .
            " s JOIN personal_information pi ON s.account_id = pi.application_id JOIN educational_background eb ON s.account_id = eb.application_id JOIN users u ON s.account_id = u.account_id JOIN application_info ai ON s.account_id = ai.application_id WHERE u.type = 'scholar' AND u.status = 'active' AND ai.status = 'scholar'";

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

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getOldActiveScholars($status, $school_year)
    {
        $query =
            'SELECT s.*, u.type, u.status, ai.type, ai.school_year, ai.type, pi.email, eb.incoming_grade FROM ' .
            $this->table_name .
            " s JOIN personal_information pi ON s.account_id = pi.scholar_id JOIN educational_background eb ON s.account_id = eb.scholar_id JOIN users u ON s.account_id = u.account_id JOIN application_info ai ON s.account_id = ai.scholar_id WHERE u.type = 'scholar' AND u.status = 'active' AND ai.status = 'scholar'";

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

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getDeactivatedScholars($status, $school_year)
    {
        $query =
            'SELECT s.*, u.type, u.status, ai.type, ai.school_year, ai.type, pi.email, eb.incoming_grade FROM ' .
            $this->table_name .
            " s JOIN personal_information pi ON s.account_id = pi.application_id JOIN educational_background eb ON s.account_id = eb.application_id JOIN users u ON s.account_id = u.account_id JOIN application_info ai ON s.account_id = ai.application_id WHERE u.type = 'scholar' AND u.status = 'deactivated'";

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

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getNotRenewedScholars($status, $school_year)
    {
        $query =
            'SELECT s.*, u.type, u.status, ai.type, ai.school_year, ai.type, pi.email, eb.incoming_grade FROM ' .
            $this->table_name .
            " s JOIN personal_information pi ON s.account_id = pi.application_id JOIN educational_background eb ON s.account_id = eb.application_id JOIN users u ON s.account_id = u.account_id JOIN application_info ai ON s.account_id = ai.application_id WHERE u.type = 'scholar' AND u.status = 'not_renewed'";

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

    public function getAllScholarAllowances()
    {
        $query =
            'SELECT s.first_name, s.last_name, s.allowance, s.transport_allowance, s.load_allowance FROM ' .
            $this->table_name .
            ' s JOIN users u ON s.account_id = u.account_id WHERE u.status = "active"';
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAccountStatus($id)
    {
        $query =
            'SELECT status FROM users WHERE account_id = :scholar_id';
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
