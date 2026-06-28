<?php
namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;
use App\Services\SupabaseStorageService;

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
    private $storage;

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

    public function createActivity($activity_data, $scholarId, $academic_year)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
            SET scholar_id = :scholar_id, year_level = :year_level,
                semester = :semester, academic_year = :academic_year,
                created_at = NOW()";

        $stmt = $this->pdo->prepare($query);

        $this->account_id = htmlspecialchars(strip_tags($scholarId));
        $this->year_level = htmlspecialchars(strip_tags($activity_data['year_level']));
        $this->semester = htmlspecialchars(strip_tags($activity_data['semester']));

        $stmt->bindParam(':scholar_id', $this->account_id);
        $stmt->bindParam(':year_level', $this->year_level);
        $stmt->bindParam(':semester', $this->semester);
        $stmt->bindParam(':academic_year', $academic_year);

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

        $this->account_id = htmlspecialchars(strip_tags($scholarId));
        $this->year_level = htmlspecialchars(strip_tags($activity_data['year_level']));
        $this->semester = htmlspecialchars(strip_tags($activity_data['semester']));
        $this->id = htmlspecialchars(strip_tags($activity_data['id']));

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

    public function getAllCoeAndGradesByScholarId($scholarId, $tab, $year_level, $academic_year)
    {
        $data = [];

        if ($tab === 'all') {
            $data = $this->getAllCoeAndGrades($scholarId);
        } elseif ($tab === 'this_school_year') {
            $data = $this->getCoeAndGradesThisSchoolYear($scholarId, $year_level, $academic_year);
        } elseif ($tab === 'past') {
            $data = $this->getPastSubmissions($scholarId, $academic_year);
        }

        return $data;
    }

    public function getPastSubmissions($scholarId, $academic_year)
    {
        $query = "SELECT id, scholar_id, year_level, semester, academic_year FROM coe_and_grades 
                    WHERE academic_year != :academic_year AND scholar_id = :scholar_id
                    ORDER BY year_level ASC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId);
        $stmt->bindParam(':academic_year', $academic_year);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllCoeAndGrades($scholarId)
    {
        $query = "SELECT id, scholar_id, year_level, semester, academic_year 
                    FROM coe_and_grades 
                    WHERE scholar_id = :scholar_id
                    ORDER BY year_level ASC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getCoeAndGradesThisSchoolYear($scholarId, $yearLevel, $academic_year)
    {
        $query = "SELECT id, scholar_id, year_level, semester, academic_year FROM coe_and_grades 
                    WHERE scholar_id = :scholar_id AND academic_year = :academic_year
                    ORDER BY year_level ASC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $scholarId);
        $stmt->bindParam(':academic_year', $academic_year);
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
                    'file_url' => $this->getFileUrl($file['file_path']),
                    // 'file_url' =>
                    //     $_ENV['APP_URL'] .
                    //     '/index.php?type=activities&route=file/view&file=' .
                    //     urlencode($file['file_name']), // you can pass the id here
                    'file_url' =>
                        $_ENV['APP_URL'] .
                        '/index.php?type=coe_grades&route=file/view&file=' .
                        urlencode($file['file_name']) .
                        '&id=' .
                        urlencode($file['id']),
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
                'academic_year' => $item['academic_year'],
                'files' => $filesList,
            ];
        }

        return $data;
    }

    /**
     * Generates a temporary signed URL directly from the stored Supabase path.
     * No scanning/proxy needed since file_path is already known from the DB.
     */
    private function getFileUrl($filePath)
    {
        if (!$filePath) {
            return null;
        }

        try {
            if (!$this->storage) {
                $this->storage = new SupabaseStorageService();
            }

            return $this->storage->getSignedUrl($filePath, 3600); // valid for 1 hour
        } catch (\Exception $e) {
            error_log(
                '[CoeGradesModel::getFileUrl] Failed to sign URL for "' .
                    $filePath .
                    '": ' .
                    $e->getMessage(),
            );
            return null;
        }
    }

    public function getFilesByScholarIdAndYearLevel($scholar_id, $year_level, $semester)
    {
        $query = "SELECT id, scholar_id, file_name, file_path, file_size, file_type, uploaded_at
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

    public function getCoeGradesById($id)
    {
        $query = "SELECT *
                FROM coe_and_grades
                WHERE scholar_id = :scholar_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $id);
        $stmt->execute();
        $row = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        if ($row) {
            return true;
        }

        return false;
    }
}
?>
