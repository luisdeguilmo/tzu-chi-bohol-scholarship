<?php
namespace App\Models;

use Config\Database;

class CoeAndGradeFilesModel
{
    private $table_name = 'coe_and_grade_files';

    public $id;
    public $submission_id;
    public $file_name;
    public $file_path;
    public $file_type;
    public $file_size;
    public $year_level;
    public $semester;
    public $uploaded_at;

    private $pdo;

    public function __construct($pdo = null)
    {
        if ($pdo) {
            $this->pdo = $pdo;
        } else {
            $db = new Database();
            $this->pdo = $db->getConnection();
        }
    }

    public function createCoeGradeFile($file_data, $submissionData, $submission_id)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                   SET scholar_id = :submission_id,
                       file_name = :file_name,
                       file_path = :file_path, 
                       file_type = :file_type,
                       file_size = :file_size,
                       year_level = :year_level,
                       semester = :semester,
                      uploaded_at = :uploaded_at";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->submission_id = $submission_id;
        $this->file_name = htmlspecialchars(strip_tags($file_data['file_name']));
        $this->file_path = htmlspecialchars(strip_tags($file_data['file_path']));
        $this->file_type = htmlspecialchars(strip_tags($file_data['file_type']));
        $this->file_size = htmlspecialchars(strip_tags($file_data['file_size']));
        $this->year_level = htmlspecialchars(strip_tags($submissionData['year_level']));
        $this->semester = htmlspecialchars(strip_tags($submissionData['semester']));
        $this->uploaded_at = date('Y-m-d H:i:s');

        // Bind values
        $stmt->bindParam(':submission_id', $this->submission_id);
        $stmt->bindParam(':file_name', $this->file_name);
        $stmt->bindParam(':file_path', $this->file_path);
        $stmt->bindParam(':file_type', $this->file_type);
        $stmt->bindParam(':file_size', $this->file_size);
        $stmt->bindParam(':year_level', $this->year_level);
        $stmt->bindParam(':semester', $this->semester);
        $stmt->bindParam(':uploaded_at', $this->uploaded_at);

        return $stmt->execute();
    }

    public function updateCoeGradeFileBatchId($id, $batch_id)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                   SET batch_id = :batch_id 
                   WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':batch_id', $batch_id);
        return $stmt->execute();
    }

    public function deleteCoeGradeFile($id)
    {
        $query = 'DELETE FROM ' . $this->table_name . ' WHERE id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function getFileUrl($id)
    {
        $query = 'SELECT file_path FROM ' . $this->table_name . ' WHERE id = ?';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            // Return the complete URL to access the file
            return $row['file_path'];
        }

        return null;
    }

    public function delete($id)
    {
        // First, get the file path to delete the actual file
        $query = 'SELECT file_path FROM ' . $this->table_name . ' WHERE id = ?';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            // Get absolute path by appending document root
            $file_path = $_SERVER['DOCUMENT_ROOT'] . $row['file_path'];

            // Delete the physical file if it exists
            if (file_exists($file_path)) {
                unlink($file_path);
            }

            // Now delete the database record
            $query = 'DELETE FROM ' . $this->table_name . ' WHERE id = ?';
            $stmt = $this->pdo->prepare($query);
            $stmt->bindParam(1, $id);

            if ($stmt->execute()) {
                return true;
            }
        }

        return false;
    }
}
?>
