<?php

// require_once __DIR__ . "/../../config/Database.php"

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class ApplicantModel
{
    private $pdo;
    private $currentYear;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->currentYear = date('Y');
    }

    public function approveApplication($data)
    {
        $query =
            "UPDATE application_info SET is_application_approved = 1, is_eligible_for_exam = 1, status = 'Approved', approved_at = NOW() WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $data['application_id']);
        return $stmt->execute();
    }

    public function approveRenewApplication($data)
    {
        $query =
            "UPDATE application_info SET is_application_approved = 1, status = 'scholar', approved_at = NOW() WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $data['application_id']);
        if ($stmt->execute()) {
            $query_2 = "SELECT scholar_id FROM application_info WHERE application_id = :application_id";
            $stmt_2 = $this->pdo->prepare($query_2);
            $stmt_2->bindParam(":application_id", $data['application_id']);
            $stmt_2->execute();
            $row = $stmt_2->fetch(\PDO::PARAM_INT);
            if ($row) {
                return $row['scholar_id'];
            }

            return null;
        }

        return false;
    }

    public function rejectApplication($data)
    {
        $query =
            "UPDATE application_info SET is_application_rejected = 1, status = 'Rejected', rejected_at = NOW() WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $data['application_id']);
        return $stmt->execute();
    }

    public function rejectRenewApplication($data)
    {
        $query =
            "UPDATE application_info SET is_application_rejected = 1, status = 'renewal_application_rejected', rejected_at = NOW() WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $data['application_id']);
        return $stmt->execute();
    }

    public function updateStatusToExamPassed($id)
    {
        $query =
            'UPDATE application_info SET is_examination_passed = 1, is_examination_failed = 0, is_for_initial_interview = 1 WHERE application_id = :application_id';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $id, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function updateStatusToExamFailed($id)
    {
        $query =
            'UPDATE application_info SET is_examination_failed = 1, is_examination_passed = 0, is_for_initial_interview = 0 WHERE application_id = :application_id';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $id, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function updateStatusToInitialInterviewPassed($id)
    {
        $query =
            "UPDATE application_info SET is_initial_interview_passed = '1', is_for_home_visitation = 1 WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $id, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function updateStatusToInitialInterviewFailed($id)
    {
        $query =
            "UPDATE application_info SET is_initial_interview_failed = '1' WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $id, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function updateStatusToHomeVisitationPassed($id)
    {
        $query =
            "UPDATE application_info SET is_home_visitation_qualified = '1', is_for_final_interview = 1 WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $id, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function updateStatusToHomeVisitationFailed($id)
    {
        $query =
            "UPDATE application_info SET is_home_visitation_not_qualified = '1' WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $id, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function updateStatusToFinalInterviewPassed($id)
    {
        $query =
            "UPDATE application_info SET is_final_interview_passed = 1, status = 'final_interview_passed', is_for_orientation = '1' WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $id, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function updateStatusToFinalInterviewFailed($id)
    {
        $query =
            "UPDATE application_info SET is_final_interview_failed = '1' WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $id, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function getApplicantInfo($id, $schoolYear)
    {
        $query =
            'SELECT * FROM application_info WHERE scholar_id = :id AND school_year = :school_year';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->bindParam(':school_year', $schoolYear);
        $stmt->execute();

        return $stmt->fetch(\PDO::FETCH_ASSOC) ?: null;
    }

    public function getApplicantInformation($id, $schoolYear)
    {
        $query = '
        SELECT 
            pi.*, 
            eb.*, 
            pg.*, 
            cp.*, 
            fm.*, 
            ts.*, 
            oa.*, 
            cr.*  
        FROM application_info ai
            LEFT JOIN personal_information pi ON pi.scholar_id = ai.scholar_id
            LEFT JOIN educational_background eb ON eb.scholar_id = ai.scholar_id
            LEFT JOIN parents_guardian pg ON pg.scholar_id = ai.scholar_id
            LEFT JOIN contact_person cp ON cp.scholar_id = ai.scholar_id
            LEFT JOIN family_members fm ON fm.scholar_id = ai.scholar_id
            LEFT JOIN tzu_chi_siblings ts ON ts.scholar_id = ai.scholar_id
            LEFT JOIN other_assistance oa ON oa.scholar_id = ai.scholar_id
            LEFT JOIN character_reference cr ON cr.scholar_id = ai.scholar_id
        WHERE ai.scholar_id = :id 
          AND ai.school_year = :school_year
    ';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->bindParam(':school_year', $schoolYear);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getApplicantsWhoTookExam()
    {
        $query = "SELECT * FROM application_info WHERE is_application_approved = '1' AND is_eligible_for_exam = '1' AND YEAR(created_at) = '$this->currentYear'";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllApplicants()
    {
        $query = "SELECT pi.* 
                  FROM personal_information pi
                  JOIN application_info ai ON pi.application_id = ai.application_id
                  WHERE ai.is_application_approved = '0'";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll();
    }

    public function getAllNewApplicants()
    {
        $query = "SELECT 
                    ai.*,
                    pi.*, 
                    pp.*
                FROM personal_information pi
                    JOIN profile_pictures pp ON pi.application_id = pp.application_id
                JOIN application_info ai ON pi.application_id = ai.application_id
                
                WHERE ai.is_application_approved = '0' 
                    AND ai.is_application_rejected = '0'
                    AND ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllRenewalApplicants()
    {
        $query = "SELECT 
                ai.*,
                pi.*
              FROM personal_information pi
              JOIN application_info ai ON pi.application_id = ai.application_id          
              WHERE ai.is_application_approved = '0' AND ai.is_application_rejected = '0' AND ai.type = 'Old' AND ai.scholar_id IS NOT NULL AND YEAR(pi.created_at) = $this->currentYear";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getUnassignedApplicants()
    {
        $query = "SELECT 
                pi.*, 
                ai.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id
            WHERE (
                ai.is_eligible_for_exam = '1' AND ai.batch IS NULL AND ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear
            ) OR (
                ai.is_eligible_for_exam = '1' AND ai.batch = 'Unassigned' AND ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear
            )
        ";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getUnassignedApplicantsForOrientation()
    {
        $query = "SELECT 
                pi.*, 
                ai.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id
            WHERE (
                ai.is_for_orientation = '1' AND ai.batch_for_orientation IS NULL AND ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear
            ) OR (
                ai.is_for_orientation = '1' AND ai.batch_for_orientation = 'Unassigned' AND ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear
            )
        ";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getApplications() {}

    public function getApplicantsForInitialInterview()
    {
        $query = "SELECT 
                pi.*, 
                ai.*,
                eb.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id 
            JOIN educational_background eb ON pi.application_id = eb.application_id
            WHERE
                ai.is_for_initial_interview = '1' AND ai.is_initial_interview_passed = '0' AND ai.is_initial_interview_failed = '0' AND ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear
        ";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getResultForInitialInterview()
    {
        $query = "SELECT 
                pi.*, 
                ai.*,
                eb.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id 
            JOIN educational_background eb ON pi.application_id = eb.application_id
            WHERE
                ai.is_for_initial_interview = '1' AND (ai.is_initial_interview_passed = '1' OR ai.is_initial_interview_failed = '1') AND ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear
        ";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getApplicantsForHomeVisitation()
    {
        $query = "SELECT 
                pi.*, 
                ai.*,
                eb.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id 
            JOIN educational_background eb ON pi.application_id = eb.application_id
            WHERE
                ai.is_for_home_visitation = '1' AND ai.is_home_visitation_qualified = '0' AND ai.is_home_visitation_not_qualified = '0' AND ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear
        ";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getResultForHomeVisitation()
    {
        $query = "SELECT 
                pi.*, 
                ai.*,
                eb.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id 
            JOIN educational_background eb ON pi.application_id = eb.application_id
            WHERE
                ai.is_for_home_visitation = '1' AND (ai.is_home_visitation_qualified = '1' OR ai.is_home_visitation_not_qualified = '1') AND ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear
        ";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getApplicantsForFinalInterview()
    {
        $query = "SELECT 
                pi.*, 
                ai.*,
                eb.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id 
            JOIN educational_background eb ON pi.application_id = eb.application_id
            WHERE
                ai.is_for_final_interview = '1' AND ai.is_final_interview_passed = '0' AND ai.is_final_interview_failed = '0' AND ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear
        ";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getResultForFinalInterview()
    {
        $query = "SELECT 
                pi.*, 
                ai.*,
                eb.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id 
            JOIN educational_background eb ON pi.application_id = eb.application_id
            WHERE
                ai.is_for_final_interview = '1' AND (ai.is_final_interview_passed = '1' OR ai.is_final_interview_failed = '1') AND ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear
        ";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllReviewedApplicants($status)
    {
        $query = '';

        if ($status === 'new') {
            $query = "SELECT 
                    pi.*, 
                    ai.*
                FROM personal_information pi
                JOIN application_info ai ON pi.application_id = ai.application_id
                WHERE 
                    (ai.is_application_approved = '1' OR ai.is_application_rejected = '1') AND 
                    ai.type = 'New' AND YEAR(ai.created_at) = $this->currentYear
                
                ";
        } elseif ($status === 'old') {
            $query = "SELECT 
                ai.*,
                pi.*, 
                pp.*
              FROM application_info ai
                JOIN profile_pictures pp ON pp.application_id = ai.scholar_id
              JOIN personal_information pi ON pi.application_id = ai.application_id
              
              WHERE (ai.is_application_approved = '1' OR ai.is_application_rejected = '1')
                AND ai.type = 'Old' AND YEAR(ai.created_at) = $this->currentYear";
        }

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // public function getApplicantsByBatch($batchValue) {
    //     $query = "SELECT pi.*, ai.*, b.schedule FROM personal_information pi
    //         JOIN application_info ai ON ai.application_id = pi.application_id
    //         JOIN batches b ON ai.batch = b.batch_name
    //         WHERE ai.batch = :batch AND YEAR(ai.created_at) = $this->currentYear";
    //     // $query = "SELECT application_id FROM application_info WHERE batch = :batch";
    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->bindParam(':batch', $batchValue);

    //     if (!$stmt->execute()) {
    //         return false;
    //     }

    //     // Return all matching student records
    //     return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    // }

    public function getApplicantsByBatch($status, $sort, $batchValue)
    {
        $query = "SELECT pi.*, ai.*, b.purpose, b.schedule FROM personal_information pi 
            JOIN application_info ai ON ai.application_id = pi.application_id
            JOIN batches b ON ai.batch = b.batch_name 
            WHERE ai.batch = :batch AND b.purpose = 'entrance_examination' AND YEAR(ai.created_at) = $this->currentYear";

        if ($status === 'all') {
            $query .=
                " AND (ai.is_examination_passed = '0' OR ai.is_examination_passed = '1' OR ai.is_examination_failed = '1' OR ai.is_examination_failed = '0')";
        } elseif ($status === 'passed') {
            $query .= " AND ai.is_examination_passed = '1'";
        } elseif ($status === 'failed') {
            $query .= " AND ai.is_examination_failed = '1'";
        } elseif ($status === 'pending') {
            $query .= " AND ai.is_examination_passed = '0' OR ai.is_examination_failed = '0'";
        }

        if ($sort === 'newest') {
            $query .= ' ORDER BY ai.created_at DESC';
        } elseif ($sort === 'oldest') {
            $query .= ' ORDER BY ai.created_at ASC';
        } elseif ($sort === 'name') {
            $query .= ' ORDER BY pi.first_name ASC';
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':batch', $batchValue);
        // $stmt->execute();
        // return $stmt->fetchAll(\PDO::FETCH_ASSOC);

        if (!$stmt->execute()) {
            return false;
        }

        // Return all matching student records
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getBatches($status, $sort)
    {
        // Get all students with the specified batch value
        $query = "SELECT pi.*, ai.*, b.purpose, b.schedule FROM personal_information pi 
            JOIN application_info ai ON ai.application_id = pi.application_id
            JOIN batches b ON ai.batch = b.batch_name 
            WHERE ai.is_eligible_for_exam = '1' AND b.purpose = 'entrance_examination' AND (ai.batch IS NOT NULL AND ai.batch != 'Unassigned') AND YEAR(ai.created_at) = $this->currentYear";

        if ($status === 'all') {
            $query .=
                " AND (ai.is_examination_passed = '0' OR ai.is_examination_passed = '1' OR ai.is_examination_failed = '1' OR ai.is_examination_failed = '0')";
        } elseif ($status === 'passed') {
            $query .= " AND ai.is_examination_passed = '1'";
        } elseif ($status === 'failed') {
            $query .= " AND ai.is_examination_failed = '1'";
        } elseif ($status === 'pending') {
            $query .= " AND ai.is_examination_passed = '0' AND ai.is_examination_failed = '0'";
        }

        if ($sort === 'newest') {
            $query .= ' ORDER BY ai.created_at DESC';
        } elseif ($sort === 'oldest') {
            $query .= ' ORDER BY ai.created_at ASC';
        } elseif ($sort === 'name') {
            $query .= ' ORDER BY pi.first_name ASC';
        }

        $stmt = $this->pdo->prepare($query);

        if (!$stmt->execute()) {
            return false;
        }

        // Return all matching student records
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function markAsUnassigned($studentId)
    {
        // Now update the specific student record
        $updateQuery =
            "UPDATE application_info SET batch = 'Unassigned' WHERE application_id = :application_id";
        $updateStmt = $this->pdo->prepare($updateQuery);
        $updateStmt->bindParam(':application_id', $studentId);

        if (!$updateStmt->execute()) {
            return false;
        }

        return true;
    }

    public function assignApplicants($studentId, $batchValue)
    {
        // Update the specific student record
        $updateQuery =
            'UPDATE application_info SET batch = :batch WHERE application_id = :application_id';
        $updateStmt = $this->pdo->prepare($updateQuery);
        $updateStmt->bindParam(':application_id', $studentId);
        $updateStmt->bindParam(':batch', $batchValue); // Fixed typo: was :bact

        if (!$updateStmt->execute()) {
            return false;
        }

        return true;
    }
}
?>
