<?php

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class ApplicationRecordsModel
{
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getAllNewApplicants($status, $school_year, $sort)
    {
        $query =
            "SELECT 
                pi.last_name, pi.first_name, pi.middle_name, pi.email, 
                ai.application_id, 
                ai.school_year, 
                ai.created_at,
                ai.is_attended_awarding, 
                ai.is_not_attended_awarding,
                ai.is_attended_orientation,
                ai.is_not_attended_orientation,
                ai.is_final_interview_passed,
                ai.is_final_interview_failed,
                ai.is_home_visitation_qualified,
                ai.is_home_visitation_not_qualified,
                ai.is_initial_interview_passed,
                ai.is_initial_interview_failed,
                ai.is_examination_passed,
                ai.is_examination_failed,
                ai.is_application_approved,
                ai.is_application_rejected,
                ai.is_added_from_admin
            FROM personal_information pi JOIN application_info ai ON pi.application_id = ai.application_id WHERE ai.type= 'New'";

        if ($status === 'fully_qualified') {
            $query .=
                " AND ai.is_application_approved = '1' AND ai.is_examination_passed = '1' AND ai.is_initial_interview_passed = '1' AND ai.is_home_visitation_qualified = '1' AND ai.is_final_interview_passed = '1' AND ai.is_attended_orientation = '1' AND ai.is_attended_awarding = '1'";
        } else {
            if ($status === 'application_approved') {
                $query .=
                    " AND ai.is_application_approved = '1' AND ai.is_examination_passed = '0' AND ai.is_examination_failed = '0'";
            } elseif ($status === 'application_rejected') {
                $query .= " AND ai.is_application_rejected = '1'";
            } elseif ($status === 'entrance_examination_passed') {
                $query .=
                    " AND ai.is_examination_passed = '1' AND ai.is_initial_interview_passed = '0' AND ai.is_initial_interview_failed = '0'";
            } elseif ($status === 'entrance_examination_failed') {
                $query .= " AND ai.is_examination_failed = '1'";
            } elseif ($status === 'initial_interview_passed') {
                $query .=
                    " AND ai.is_initial_interview_passed = '1' AND ai.is_home_visitation_qualified = '0' AND ai.is_home_visitation_not_qualified = '0'";
            } elseif ($status === 'initial_interview_failed') {
                $query .= " AND ai.is_initial_interview_failed = '1'";
            } elseif ($status === 'home_visitation_qualified') {
                $query .=
                    " AND ai.is_home_visitation_qualified = '1' AND ai.is_final_interview_passed = '0' AND ai.is_final_interview_failed = '0'";
            } elseif ($status === 'home_visitation_not_qualified') {
                $query .= " AND ai.is_home_visitation_not_qualified = '1'";
            } elseif ($status === 'final_interview_passed') {
                $query .=
                    " AND ai.is_final_interview_passed = '1' AND ai.is_attended_orientation = '0' AND ai.is_not_attended_orientation = '0'";
            } elseif ($status === 'final_interview_failed') {
                $query .= " AND ai.is_final_interview_failed = '1'";
            } elseif ($status === 'attended_orientation') {
                $query .=
                    " AND ai.is_attended_orientation = '1' AND ai.is_attended_awarding = '0' AND ai.is_not_attended_awarding = '0'";
            } elseif ($status === 'not_attended_orientation') {
                $query .= " AND ai.is_not_attended_orientation = '1'";
            } elseif ($status === 'attended_awarding') {
                $query .= " AND ai.is_attended_awarding = '1'";
            } elseif ($status === 'not_attended_awarding') {
                $query .= " AND ai.is_not_attended_awarding = '1'";
            } elseif ($status === 'pending') {
                // $query .=
                //     " AND (ai.is_application_rejected = '0' AND ai.is_examination_failed = '0' AND ai.is_initial_interview_failed = '0' AND ai.is_home_visitation_not_qualified = '0' AND ai.is_final_interview_failed = '0' AND ai.is_not_attended_orientation = '0' AND ai.is_not_attended_awarding = '0') AND (ai.is_application_approved = '1' OR ai.is_application_approved = '0' OR ai.is_examination_passed = '1' OR ai.is_examination_passed = '0' OR ai.is_initial_interview_passed = '1' OR ai.is_initial_interview_passed = '0' OR ai.is_home_visitation_qualified = '1' OR ai.is_home_visitation_qualified = '0' OR ai.is_final_interview_passed = '1' OR ai.is_final_interview_passed = '0' OR ai.is_attended_orientation = '1' OR ai.is_attended_orientation = '0') AND ai.is_attended_awarding = '0'";

                $query .=
                    " AND (ai.is_application_rejected = '0' AND ai.is_application_approved = '0')";
            }
        }

        if ($school_year !== 'all_years') {
            $query .= " AND ai.school_year = '$school_year'";
        }

        if ($sort === 'newest') {
            $query .= ' ORDER BY ai.school_year DESC, ai.created_at DESC';
        } elseif ($sort === 'oldest') {
            $query .= ' ORDER BY ai.school_year ASC, ai.created_at ASC';
        } elseif ($sort === 'name') {
            $query .= ' ORDER BY pi.last_name ASC';
        }

        $stmt = $this->pdo->query($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllOldApplicants($status, $school_year, $sort)
    {
        $query =
            "SELECT 
                pi.last_name, pi.middle_name, pi.first_name, pi.email, 
                ai.application_id, ai.scholar_id, ai.created_at, ai.school_year, ai.is_application_approved, ai.is_application_rejected
            FROM personal_information pi JOIN application_info ai ON pi.application_id = ai.application_id WHERE ai.type= 'Old' AND ai.scholar_id IS NOT NULL";

        if ($status === 'all') {
            $query .=
                " AND (ai.is_application_approved = '0' OR ai.is_application_approved = '1' OR ai.is_application_rejected = '1')";
        } elseif ($status === 'application_approved') {
            $query .= " AND ai.is_application_approved = '1'";
        } elseif ($status === 'application_rejected') {
            $query .= " AND ai.is_application_rejected = '1'";
        } elseif ($status === 'pending') {
            $query .= " AND ai.is_application_approved = '0' AND ai.is_application_rejected = '0'";
        }

        if ($school_year !== 'all_years') {
            $query .= " AND ai.school_year ='$school_year'";
        }

        if ($sort === 'newest') {
            $query .= ' ORDER BY ai.created_at DESC';
        } elseif ($sort === 'oldest') {
            $query .= ' ORDER BY ai.created_at ASC';
        } elseif ($sort === 'name') {
            $query .= ' ORDER BY pi.first_name ASC';
        }

        $stmt = $this->pdo->query($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getProfileById($id)
    {
        $query = "SELECT application_id, file_name
                FROM profile_pictures 
                WHERE application_id = :application_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $id);

        if ($stmt->execute()) {
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        }

        return null;
    }

    public function getApplicantsWithProfile($tab, $applicants, $applicationModel)
    {
        $data = [];

        foreach ($applicants as $applicant) {
            $files = $applicationModel->getProfileById(
                $tab === 'new' ? $applicant['application_id'] : $applicant['scholar_id'],
            );

            $filesList = [];

            foreach ($files as $file) {
                $applicant[] = [
                    // 'profile' =>
                    //     $_ENV['APP_URL'] .
                    //     '/index.php?type=applications&route=profile&file=' .
                    //     urlencode(basename($file['file_path'])),
                    'profile' =>
                        $_ENV['APP_URL'] .
                        '/index.php?type=applications&route=profile&file=' .
                        urlencode($file['file_name']) .
                        '&id=' .
                        urlencode($file['application_id']),
                ];
            }

            $data[] = $applicant;
        }

        return $data;
    }
}

?>
