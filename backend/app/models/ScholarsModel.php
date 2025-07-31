<?php

namespace App\Models;

use Config\Database;

class ScholarsModel {
    private $table_name = "scholars";
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getAllScholars($status, $school_year, $sort) {
        $query = "SELECT s.*, u.type, u.status, ai.created_at, ai.school_year, pi.email, eb.incoming_grade FROM " . $this->table_name ." s JOIN personal_information pi ON s.account_id = pi.application_id JOIN educational_background eb ON s.account_id = eb.application_id JOIN users u ON s.account_id = u.account_id JOIN application_info ai ON s.account_id = ai.application_id WHERE u.type = 'scholar'";

        if ($status === 'all') {
            $query .= " AND (u.status = 'active' OR u.status = 'deactivated' OR u.status = 'not_renewed')";
        } else if ($status === 'active') {
            $query .= " AND u.status = 'active'";
        } else if ($status === 'deactivated') {
            $query .= " AND u.status = 'deactivated'";
        } else if ($status === 'not_renewed') {
            $query .= " AND u.status = 'not_renewed'";
        }

        if ($school_year === 'all_years') {
            $query .= "";
        } else if ($school_year !== 'all_years') {
            $query .= " AND ai.school_year = '$school_year'";
        }

        if ($sort === 'newest') {
            $query .= " ORDER BY ai.created_at DESC";
        } else if ($sort === 'oldest') {
            $query .= " ORDER BY ai.created_at ASC";
        } else if ($sort === 'name') {
            $query .= " ORDER BY s.first_name ASC";
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getNewScholars($status, $school_year) {
        $query = "SELECT s.*, u.type, u.status, ai.type, ai.school_year, pi.email, eb.incoming_grade FROM " . $this->table_name ." s JOIN personal_information pi ON s.account_id = pi.application_id JOIN educational_background eb ON s.account_id = eb.application_id JOIN users u ON s.account_id = u.account_id JOIN application_info ai ON s.account_id = ai.application_id WHERE u.type = 'scholar' AND ai.type = 'New'";

        if ($status === 'all') {
            $query .= " AND (u.status = 'active' OR u.status = 'deactivated')";
        } else if ($status === 'active') {
            $query .= " AND u.status = 'active'";
        } else if ($status === 'deactivated') {
            $query .= " AND u.status = 'deactivated'";
        } 

        if ($school_year === 'all_years') {
            $query .= "";
        } else if ($school_year !== 'all_years') {
            $query .= " AND ai.school_year = '$school_year'";
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getOldScholars($status, $school_year) {
        $query = "SELECT s.*, u.type, u.status, ai.type, ai.school_year, pi.email, eb.incoming_grade FROM " . $this->table_name ." s JOIN personal_information pi ON s.account_id = pi.application_id JOIN educational_background eb ON s.account_id = eb.application_id JOIN users u ON s.account_id = u.account_id JOIN application_info ai ON s.account_id = ai.application_id WHERE u.type = 'scholar' AND ai.type = 'Old'";

        if ($status === 'all') {
            $query .= " AND (u.status = 'active' OR u.status = 'deactivated' OR u.status = 'not_renewed')";
        } else if ($status === 'active') {
            $query .= " AND u.status = 'active'";
        } else if ($status === 'deactivated') {
            $query .= " AND u.status = 'deactivated'";
        } else if ($status === 'not_renewed') {
            $query .= " AND u.status = 'not_renewed'";
        }

        if ($school_year === 'all_years') {
            $query .= "";
        } else if ($school_year !== 'all_years') {
            $query .= " AND ai.school_year = '$school_year'";
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}

?>