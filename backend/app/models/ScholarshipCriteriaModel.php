<?php 
namespace App\Models;

use Config\Database;

class ScholarshipCriteriaModel {
    private $qualification_table = "qualifications";
    private $requirements_table = "requirements";
    private $procedure_table = "procedure";
    private $courses_table = "courses";
    private $strands_table = "strands";
    private $instructions_table = "instructions";

    private $pdo;

    public $id;
    public $qualification;
    public $quantity;
    public $description;
    public $submit;
    public $procedure;
    public $course_name;
    public $strand;
    public $instruction;

    public function __construct() {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    // CREATE operations
    public function createStrand($data) {
    $query = "INSERT INTO " . $this->strands_table . " 
              SET strand = :strand,
              description = :description";
    
    $stmt = $this->pdo->prepare($query);
    
    $strand = strip_tags($data['strand']);
    $description = strip_tags($data['description']);
    
    $stmt->bindParam(":strand", $strand);
    $stmt->bindParam(":description", $description);
    
    return $stmt->execute();
}

    public function createCourse($data) {
        $query = "INSERT INTO " . $this->courses_table . " 
                  SET course = :course_name";
        
        $stmt = $this->pdo->prepare($query);
        
        $course_name = strip_tags($data);
        
        $stmt->bindParam(":course_name", $course_name);
        
        return $stmt->execute();
    }

    public function createQualification($data) {
        $query = "INSERT INTO " . $this->qualification_table . " 
                  SET qualification = :qualification";
        
        $stmt = $this->pdo->prepare($query);
        
        $qualification = strip_tags($data);
        
        $stmt->bindParam(":qualification", $qualification);
        
        return $stmt->execute();
    }

    public function createRequirement($data) {
        $query = "INSERT INTO " . $this->requirements_table . " 
                  SET quantity = :quantity,
                  description = :description,
                  submit = :submit";
        
        $stmt = $this->pdo->prepare($query);
        
        $quantity = strip_tags($data['quantity']);
        $description = strip_tags($data['description']);
        $submit = strip_tags($data['submit']);
        
        $stmt->bindParam(":quantity", $quantity);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":submit", $submit);
        
        return $stmt->execute();
    }

    public function createProcedure($data) {
        $query = "INSERT INTO `" . $this->procedure_table . "` 
          SET `procedure` = :procedure";
        
        $stmt = $this->pdo->prepare($query);
        
        $procedure = strip_tags($data);
        
        $stmt->bindParam(":procedure", $procedure);
        
        return $stmt->execute();
    }

    public function createInstruction($data) {
        $query = "INSERT INTO " . $this->instructions_table . " 
          SET instruction = :instruction";
        
        $stmt = $this->pdo->prepare($query);
        
        $instruction = strip_tags($data);
        
        $stmt->bindParam(":instruction", $instruction);
        
        return $stmt->execute();
    }

    // READ operations
    public function getAllStrands() {
        $query = "SELECT * FROM " . $this->strands_table;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getStrandById($id) {
        $query = "SELECT * FROM " . $this->strands_table . " WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getAllCourses() {
        $query = "SELECT * FROM " . $this->courses_table;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    // public function getAllCourses() {
    //     $query = "SELECT (@row_number:=@row_number+1) AS row_number, c.* 
    //               FROM " . $this->courses_table . " c, 
    //               (SELECT @row_number:=0) r 
    //               ORDER BY c.course_name";
    //     $stmt = $this->pdo->prepare($query);
    //     $stmt->execute();
        
    //     return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    // }

    public function getCourseById($id) {
        $query = "SELECT * FROM " . $this->courses_table . " WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getAllQualifications() {
        $query = "SELECT * FROM " . $this->qualification_table;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
    
    public function getQualificationById($id) {
        $query = "SELECT * FROM " . $this->qualification_table . " WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
    
    public function getAllRequirements() {
        $query = "SELECT * FROM " . $this->requirements_table;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
    
    public function getRequirementById($id) {
        $query = "SELECT * FROM " . $this->requirements_table . " WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
    
    public function getAllProcedures() {
        $query = "SELECT * FROM `" . $this->procedure_table . "`";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
    
    public function getProcedureById($id) {
        $query = "SELECT * FROM `" . $this->procedure_table . "` WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getAllInstructions() {
        $query = "SELECT * FROM " . $this->instructions_table;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getInstructionById($id) {
        $query = "SELECT * FROM " . $this->instructions_table . " WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    // UPDATE operations
    public function updateStrand($id, $data) {
        $query = "UPDATE " . $this->strands_table . " 
                  SET strand = :strand,
                  description = :description
                  WHERE id = :id";
        
        $stmt = $this->pdo->prepare($query);
        
        $strand = strip_tags($data['strand']);
        $description = strip_tags($data['description']);
        
        $stmt->bindParam(":strand", $strand);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }

    public function updateCourse($id, $data) {
        $query = "UPDATE " . $this->courses_table . " 
                  SET course = :course_name 
                  WHERE id = :id";
        
        $stmt = $this->pdo->prepare($query);
        
        $course_name = strip_tags($data['course']);
        
        $stmt->bindParam(":course_name", $course_name);
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }

    public function updateQualification($id, $data) {
        $query = "UPDATE " . $this->qualification_table . " 
                  SET qualification = :qualification 
                  WHERE id = :id";
        
        $stmt = $this->pdo->prepare($query);
        
        $qualification = strip_tags($data['qualification']);
        
        $stmt->bindParam(":qualification", $qualification);
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }
    
    public function updateRequirement($id, $data) {
        $query = "UPDATE " . $this->requirements_table . " 
                  SET quantity = :quantity,
                  description = :description,
                  submit = :submit 
                  WHERE id = :id";
        
        $stmt = $this->pdo->prepare($query);
        
        $quantity = strip_tags($data['quantity']);
        $description = strip_tags($data['description']);
        $submit = strip_tags($data['submit']);
        
        $stmt->bindParam(":quantity", $quantity);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":submit", $submit);
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }
    
    public function updateProcedure($id, $data) {
        $query = "UPDATE `" . $this->procedure_table . "` 
          SET `procedure` = :procedure 
          WHERE id = :id";
        
        $stmt = $this->pdo->prepare($query);
        
        $procedure = strip_tags($data['procedure']);
        
        $stmt->bindParam(":procedure", $procedure);
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }

    public function updateInstruction($id, $data) {
        $query = "UPDATE " . $this->instructions_table . " 
                  SET instruction = :instruction 
                  WHERE id = :id";
        
        $stmt = $this->pdo->prepare($query);
        
        $instruction = strip_tags($data['instruction']);
        
        $stmt->bindParam(":instruction", $instruction);
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }

    // DELETE operations
    public function deleteStrand($id) {
        $query = "DELETE FROM " . $this->strands_table . " WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }

    public function deleteCourse($id) {
        $query = "DELETE FROM " . $this->courses_table . " WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }

    public function deleteQualification($id) {
        $query = "DELETE FROM " . $this->qualification_table . " WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }
    
    public function deleteRequirement($id) {
        $query = "DELETE FROM " . $this->requirements_table . " WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }
    
    public function deleteProcedure($id) {
        $query = "DELETE FROM `" . $this->procedure_table . "` WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }

    public function deleteInstruction($id) {
        $query = "DELETE FROM " . $this->instructions_table . " WHERE id = :id";
        $stmt = $this->pdo->prepare($query);
        
        $stmt->bindParam(":id", $id);
        
        return $stmt->execute();
    }
}
?>