<?php
namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class CoeGradesModel
{
    private $table_name = 'coe_and_grades';

    public $id;
    public $account_id;
    public $activity_id;
    public $activity_name;
    public $year_level;
    public $semester;
    public $activity_location;
    public $activity_date;
    public $start_time;
    public $end_time;
    public $activity_status;
    public $updated_at;
    public $uploaded_at;
    public $startOfMonth;
    public $startOfNextMonth;
    public $currentDateTime;
    public $currentDate;
    public $status;

    private $pdo;

    public function __construct($pdo = null)
    {
        if ($pdo) {
            $this->pdo = $pdo;
        } else {
            $db = new Database();
            $this->pdo = $db->getConnection();
            $this->startOfMonth = date('Y-m-01');
            $this->startOfNextMonth = date('Y-m-01', strtotime('first day of next month'));
            $this->currentDate = date('Y-m-d');
            $this->currentDateTime = date('Y-m-d H:i:s');
        }
    }

    public function createActivity($activity_data, $scholarId)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
            SET scholar_id = :scholar_id, year_level = :year_level,
                semester = :semester,
                created_at = NOW()";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->account_id = htmlspecialchars(strip_tags($scholarId));
        $this->year_level = htmlspecialchars(strip_tags($activity_data['year_level']));
        $this->semester = htmlspecialchars(strip_tags($activity_data['semester']));

        // Bind values
        $stmt->bindParam(':scholar_id', $this->account_id);
        $stmt->bindParam(':year_level', $this->year_level);
        $stmt->bindParam(':semester', $this->semester);

        if ($stmt->execute()) {
            return $this->pdo->lastInsertId();
        }

        return false;
    }

    public function updateSubmission($activity_data, $scholarId)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            ' SET year_level = :year_level, semester = :semester WHERE id = :id';

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->account_id = htmlspecialchars(strip_tags($scholarId));
        $this->year_level = htmlspecialchars(strip_tags($activity_data['year_level']));
        $this->semester = htmlspecialchars(strip_tags($activity_data['semester']));
        $this->id = htmlspecialchars(strip_tags($activity_data['id']));

        // Bind values
        $stmt->bindParam(':year_level', $this->year_level);
        $stmt->bindParam(':semester', $this->semester);
        $stmt->bindParam(':id', $this->id);

        if ($stmt->execute()) {
            return $this->id;
        }

        return false;
    }

    public function checkSubmission($data, $scholarId)
    {
        $query =
            'SELECT id FROM coe_and_grades WHERE scholar_id = :scholar_id AND year_level = :year_level AND semester = :semester';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId);
        $stmt->bindParam(':year_level', $data['year_level']);
        $stmt->bindParam(':semester', $data['semester']);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $row['id'] ?? null;
    }

    public function getAllCoeAndGradesByScholarId($scholarId, $tab, $year_level)
    {
        $data = [];

        if ($tab === 'all') {
            $data = $this->getAllCoeAndGrades($scholarId);
        } elseif ($tab === 'this_school_year') {
            $data = $this->getCoeAndGradesThisSchoolYear($scholarId, $year_level);
        } elseif ($tab === 'past') {
            $data = $this->getPastSubmissions($scholarId);
        }

        return $data;
    }

    public function getPastSubmissions($scholarId)
    {
        $query = "SELECT * FROM coe_and_grades 
                    WHERE DATE(created_at) < :current_datetime AND scholar_id = :scholar_id
                    ORDER BY year_level ASC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId);
        $stmt->bindParam(':current_datetime', $this->currentDate);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllCoeAndGrades($scholarId)
    {
        $query = "SELECT * FROM coe_and_grades 
                    WHERE scholar_id = :scholar_id
                    ORDER BY year_level ASC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getCoeAndGradesThisSchoolYear($scholarId, $yearLevel)
    {
        $query = "SELECT * FROM coe_and_grades 
                    WHERE scholar_id = :scholar_id AND year_level = :year_level
                    ORDER BY year_level ASC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId);
        $stmt->bindParam(':year_level', $yearLevel);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllCoeAndGradesWithFiles($coe_grades, $model)
    {
        $data = [];

        foreach ($coe_grades as $item) {
            $files = $model->getFilesByScholarIdAndYearLevel(
                $item['scholar_id'],
                $item['year_level'],
                $item['semester'],
            );

            $filesList = [];

            foreach ($files as $file) {
                $filesList[] = [
                    'id' => $file['id'],
                    'scholar_id' => $file['scholar_id'],
                    'file_name' => $file['file_name'],
                    'file_path' => $file['file_path'],
                    'file_size' => $file['file_size'],
                    'file_type' => $file['file_type'],
                    'uploaded_at' => $file['uploaded_at'],
                ];
            }

            $data[] = [
                'id' => $item['id'],
                'year_level' => $item['year_level'],
                'semester' => $item['semester'],
                'files' => $filesList,
            ];
        }

        return $data;
    }

    public function getFilesByScholarIdAndYearLevel($scholar_id, $year_level, $semester)
    {
        $query = "SELECT *
                FROM coe_and_grade_files 
                WHERE scholar_id = :scholar_id AND year_level = :year_level AND semester = :semester";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholar_id);
        $stmt->bindParam(':year_level', $year_level);
        $stmt->bindParam(':semester', $semester);

        if ($stmt->execute()) {
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        }

        return null;
    }
}
?>
