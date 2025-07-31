<?php

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class ApplicationRecordsModel {
    private $pdo;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getAllNewApplicants($status, $school_year, $sort) {
        $query = "SELECT pi.*, ai.* FROM personal_information pi JOIN application_info ai ON pi.application_id = ai.application_id WHERE ai.type= 'New'";

        if ($status === 'all') {
            $query .= " AND (ai.is_application_approved = '0' OR ai.is_application_approved = '1' OR ai.is_application_rejected = '1')";
        } else if ($status === 'approved') {
            $query .= " AND ai.is_application_approved = '1'";
        } else if ($status === 'rejected') {
            $query .= " AND ai.is_application_rejected = '1'";
        } else if ($status === 'pending') {
            $query .= " AND ai.is_application_approved = '0' AND ai.is_application_rejected = '0'";
        }

        if ($school_year !== 'all_years') {
            $query .= " AND ai.school_year = '$school_year'";
        }

        if ($sort === 'newest') {
            $query .= " ORDER BY ai.created_at DESC";
        } else if ($sort === 'oldest') {
            $query .= " ORDER BY ai.created_at ASC";
        } else if ($sort === 'name') {
            $query .= " ORDER BY pi.first_name ASC";
        }
        
        $stmt = $this->pdo->query($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllOldApplicants($status, $school_year, $sort) {
        $query = "SELECT pi.*, ai.* FROM personal_information pi JOIN application_info ai ON pi.application_id = ai.application_id WHERE ai.type= 'Old' AND scholar_id IS NOT NULL";

        if ($status === 'all') {
            $query .= " AND (ai.is_application_approved = '0' OR ai.is_application_approved = '1' OR ai.is_application_rejected = '1')";
        } else if ($status === 'approved') {
            $query .= " AND ai.is_application_approved = '1'";
        } else if ($status === 'rejected') {
            $query .= " AND ai.is_application_rejected = '1'";
        } else if ($status === 'pending') {
            $query .= " AND ai.is_application_approved = '0' AND ai.is_application_rejected = '0'";
        }

        if ($school_year !== 'all_years') {
            $query .= " AND ai.school_year = '$school_year'";
        }

        if ($sort === 'newest') {
            $query .= " ORDER BY ai.created_at DESC";
        } else if ($sort === 'oldest') {
            $query .= " ORDER BY ai.created_at ASC";
        } else if ($sort === 'name') {
            $query .= " ORDER BY pi.first_name ASC";
        }
        
        $stmt = $this->pdo->query($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}

?>