<?php

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
            "UPDATE application_info SET is_application_approved = 1, is_eligible_for_exam = 1, status = 'scholar', approved_at = NOW() WHERE application_id = :application_id";

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
            $query_2 =
                'SELECT scholar_id FROM application_info WHERE application_id = :application_id';
            $stmt_2 = $this->pdo->prepare($query_2);
            $stmt_2->bindParam(':application_id', $data['application_id']);
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
            "UPDATE application_info SET is_application_rejected = 1, status = 'rejected', rejected_at = NOW() WHERE application_id = :application_id";

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
            'SELECT application_id FROM application_info WHERE (scholar_id = :id OR application_id = :id) AND school_year = :school_year';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->bindParam(':school_year', $schoolYear);
        $stmt->execute();

        return $stmt->fetch(\PDO::FETCH_ASSOC) ?: null;
    }

    public function getExpectation($id)
    {
        $query =
            'SELECT expectation FROM application_info WHERE application_id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    // public function getApplicantInformation($id, $schoolYear)
    // {
    //     $query = '
    //     SELECT 
    //         pi.*, 
    //         eb.*, 
    //         pg.*, 
    //         cp.*, 
    //         fm.*, 
    //         ts.*, 
    //         oa.*, 
    //         cr.*  
    //     FROM application_info ai
    //         LEFT JOIN personal_information pi ON pi.scholar_id = ai.scholar_id
    //         LEFT JOIN educational_background eb ON eb.scholar_id = ai.scholar_id
    //         LEFT JOIN parents_guardian pg ON pg.scholar_id = ai.scholar_id
    //         LEFT JOIN contact_person cp ON cp.scholar_id = ai.scholar_id
    //         LEFT JOIN family_members fm ON fm.scholar_id = ai.scholar_id
    //         LEFT JOIN tzu_chi_siblings ts ON ts.scholar_id = ai.scholar_id
    //         LEFT JOIN other_assistance oa ON oa.scholar_id = ai.scholar_id
    //         LEFT JOIN character_reference cr ON cr.scholar_id = ai.scholar_id
    //     WHERE ai.scholar_id = :id 
    //       AND ai.school_year = :school_year
    // ';

    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
    //     $stmt->bindParam(':school_year', $schoolYear);
    //     $stmt->execute();

    //     return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    // }

    public function getApplicantsWhoTookExam()
    {
        $query = "SELECT application_id, score FROM application_info WHERE is_application_approved = '1' AND is_eligible_for_exam = '1' AND YEAR(created_at) = '$this->currentYear'";

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

    public function getProfileById($id)
    {
        $query = "SELECT application_id, file_path
                FROM profile_pictures 
                WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $id);

        if ($stmt->execute()) {
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        }

        return null;
    }

    public function getApplicantsWithProfile($status, $applicants, $applicationModel)
    {
        $data = [];

        foreach ($applicants as $applicant) {
            $files = $applicationModel->getProfileById(
                $status === 'old' ? $applicant['scholar_id'] : $applicant['application_id'],
            );

            foreach ($files as $file) {
                $applicant[] = [
                    'profile' =>
                        $_ENV['APP_URL'] .
                        '/index.php?type=applications&route=profile&file=' .
                        urlencode(basename($file['file_path'])) .
                        '&id=' .
                        urlencode($file['application_id']),
                ];
            }

            $data[] = $applicant;
        }

        return $data;
    }

    // type, expectation, school_year
    public function getAllNewApplicants($schoolYear)
    {
        $query = "SELECT 
                    ai.application_id, ai.created_at,
                    pi.last_name, pi.middle_name, pi.first_name
                FROM personal_information pi
                    JOIN profile_pictures pp ON pi.application_id = pp.application_id
                JOIN application_info ai ON pi.application_id = ai.application_id
                
                WHERE ai.is_application_approved = '0' 
                    AND ai.is_application_rejected = '0'
                    AND ai.type = 'New' AND ai.school_year = :school_year";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $schoolYear, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllRenewalApplicants()
    {
        $query = "SELECT      
              ai.application_id, ai.scholar_id, ai.created_at,
              pi.last_name, pi.middle_name, pi.first_name
              FROM personal_information pi
              JOIN application_info ai ON pi.application_id = ai.application_id          
              WHERE ai.is_application_approved = '0' AND ai.is_application_rejected = '0' AND ai.type = 'Old' AND ai.scholar_id IS NOT NULL AND YEAR(ai.created_at) = $this->currentYear";

        $stmt = $this->pdo->query($query);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getUnassignedApplicants($schoolYear, $sort)
    {
        $query = "SELECT 
                pi.*, 
                ai.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id
            WHERE (
                ai.is_eligible_for_exam = '1' AND ai.batch IS NULL AND ai.type = 'New' AND ai.school_year = :school_year
            ) OR (
                ai.is_eligible_for_exam = '1' AND ai.batch = 'Unassigned' AND ai.type = 'New' AND ai.school_year = :school_year
            )
        ";

        if ($sort === 'newest') {
            $query .= ' ORDER BY ai.created_at DESC';
        } elseif ($sort === 'oldest') {
            $query .= ' ORDER BY ai.created_at ASC';
        } elseif ($sort === 'name') {
            $query .= ' ORDER BY pi.last_name ASC';
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $schoolYear, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getUnassignedApplicantsForOrientation($schoolYear)
    {
        $query = "SELECT 
                pi.*, 
                ai.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id
            WHERE (
                ai.is_for_orientation = '1' AND ai.batch_for_orientation IS NULL AND ai.type = 'New' AND ai.school_year = :school_year
            ) OR (
                ai.is_for_orientation = '1' AND ai.batch_for_orientation = 'Unassigned' AND ai.type = 'New' AND ai.school_year = :school_year
            )
        ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $schoolYear, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getApplications() {}

    public function getApplicantsForInitialInterview($schoolYear)
    {
        $query = "SELECT 
                pi.*, 
                ai.*,
                eb.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id 
            JOIN educational_background eb ON pi.application_id = eb.application_id
            WHERE
                ai.is_for_initial_interview = '1' AND ai.is_initial_interview_passed = '0' AND ai.is_initial_interview_failed = '0' AND ai.type = 'New' AND ai.school_year = :school_year
        ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $schoolYear, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getResultForInitialInterview($schoolYear)
    {
        $query = "SELECT 
                pi.*, 
                ai.*,
                eb.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id 
            JOIN educational_background eb ON pi.application_id = eb.application_id
            WHERE
                ai.is_for_initial_interview = '1' AND (ai.is_initial_interview_passed = '1' OR ai.is_initial_interview_failed = '1') AND ai.type = 'New' AND ai.school_year = :school_year
        ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $schoolYear, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getApplicantsForHomeVisitation($schoolYear)
    {
        $query = "SELECT 
                pi.*, 
                ai.*,
                eb.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id 
            JOIN educational_background eb ON pi.application_id = eb.application_id
            WHERE
                ai.is_for_home_visitation = '1' AND ai.is_home_visitation_qualified = '0' AND ai.is_home_visitation_not_qualified = '0' AND ai.type = 'New' AND ai.school_year = :school_year
        ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $schoolYear, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getResultForHomeVisitation($schoolYear)
    {
        $query = "SELECT 
                pi.*, 
                ai.*,
                eb.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id 
            JOIN educational_background eb ON pi.application_id = eb.application_id
            WHERE
                ai.is_for_home_visitation = '1' AND (ai.is_home_visitation_qualified = '1' OR ai.is_home_visitation_not_qualified = '1') AND ai.type = 'New' AND ai.school_year = :school_year
        ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $schoolYear, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getApplicantsForFinalInterview($schoolYear)
    {
        $query = "SELECT 
                pi.*, 
                ai.*,
                eb.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id 
            JOIN educational_background eb ON pi.application_id = eb.application_id
            WHERE
                ai.is_for_final_interview = '1' AND ai.is_final_interview_passed = '0' AND ai.is_final_interview_failed = '0' AND ai.type = 'New' AND ai.school_year = :school_year
        ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $schoolYear, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getResultForFinalInterview($schoolYear)
    {
        $query = "SELECT 
                pi.*, 
                ai.*,
                eb.*
            FROM personal_information pi
            JOIN application_info ai ON pi.application_id = ai.application_id 
            JOIN educational_background eb ON pi.application_id = eb.application_id
            WHERE
                ai.is_for_final_interview = '1' AND (ai.is_final_interview_passed = '1' OR ai.is_final_interview_failed = '1') AND ai.type = 'New' AND ai.school_year = :school_year
        ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $schoolYear, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllReviewedApplicants($status, $schoolYear)
    {
        $query = '';

        if ($status === 'new') {
            $query = "SELECT 
                    pi.*, 
                    ai.*
                FROM personal_information pi
                JOIN application_info ai ON pi.application_id = ai.application_id
                WHERE 
                    ai.is_added_from_admin = '0' AND (ai.is_application_approved = '1' OR ai.is_application_rejected = '1') AND 
                    ai.type = 'New' AND ai.school_year = :school_year
                
                ";
        } elseif ($status === 'old') {
            $query = "SELECT 
                pi.first_name,
                pi.last_name,
                pi.email, 
                ai.is_application_approved,
                ai.is_application_rejected,
                ai.application_id,
                ai.scholar_id,
                ai.type,
                ai.created_at,
                ai.approved_at,
                pp.file_name,
                pp.file_path,
                pp.file_type,
                pp.file_size
              FROM application_info ai
              JOIN personal_information pi ON pi.application_id = ai.application_id
                JOIN profile_pictures pp ON pp.application_id = ai.scholar_id
              WHERE (ai.is_application_approved = '1' OR ai.is_application_rejected = '1')
                AND ai.type = 'Old' AND ai.school_year = :school_year";
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $schoolYear, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getApplicantsByBatch($status, $sort, $batchValue, $schoolYear)
    {
        $query = "SELECT pi.*, ai.*, b.purpose, b.schedule FROM personal_information pi 
            JOIN application_info ai ON ai.application_id = pi.application_id
            JOIN batches b ON ai.batch = b.batch_name 
            WHERE ai.batch = :batch AND b.purpose = 'entrance_examination' AND ai.school_year = :school_year";

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
            $query .= ' ORDER BY pi.last_name ASC';
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':batch', $batchValue);
        $stmt->bindParam(':school_year', $schoolYear, \PDO::PARAM_INT);
        // $stmt->execute();
        // return $stmt->fetchAll(\PDO::FETCH_ASSOC);

        if (!$stmt->execute()) {
            return false;
        }

        // Return all matching student records
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getBatches($status, $sort, $schoolYear)
    {
        // Get all students with the specified batch value
        $query = "SELECT pi.*, ai.*, b.purpose, b.schedule FROM personal_information pi 
            JOIN application_info ai ON ai.application_id = pi.application_id
            JOIN batches b ON ai.batch = b.batch_name 
            WHERE ai.is_eligible_for_exam = '1' AND b.purpose = 'entrance_examination' AND (ai.batch IS NOT NULL AND ai.batch != 'Unassigned') AND ai.school_year = :school_year";

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
            $query .= ' ORDER BY pi.last_name ASC';
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':school_year', $schoolYear, \PDO::PARAM_INT);

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
