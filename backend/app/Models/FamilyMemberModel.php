<?php

namespace App\Models;

use Config\Database;

class FamilyMemberModel
{
    private $table_name = 'family_members';

    public $id;
    public $application_id;
    public $name;
    public $relationship;
    public $age;
    public $gender;
    public $civil_status;
    public $living_with_family;
    public $education_or_occupation;
    public $monthly_income;

    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($member, $application_id)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                  SET application_id = :application_id,
                      name = :name,
                      relationship = :relationship,
                      age = :age,
                      gender = :gender,
                      civil_status = :civil_status,
                      living_with_family = :living_with_family,
                      education_occupation = :education_occupation,
                      monthly_income = :monthly_income";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->name = strip_tags($member['name']);
        $this->relationship = strip_tags($member['relationship']);
        $this->age = strip_tags($member['age']);
        $this->gender = strip_tags($member['gender']);
        $this->civil_status = strip_tags($member['civil_status']);
        $this->living_with_family = strip_tags($member['living_with_family']);
        $this->education_or_occupation = strip_tags($member['education_occupation']);
        $this->monthly_income = strip_tags($member['monthly_income'] ?? '0');

        // Bind values
        $stmt->bindParam(':application_id', $this->application_id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':relationship', $this->relationship);
        $stmt->bindParam(':age', $this->age);
        $stmt->bindParam(':gender', $this->gender);
        $stmt->bindParam(':civil_status', $this->civil_status);
        $stmt->bindParam(':living_with_family', $this->living_with_family);
        $stmt->bindParam(':education_occupation', $this->education_or_occupation);
        $stmt->bindParam(':monthly_income', $this->monthly_income);

        return $stmt->execute();
    }

    public function renew($member, $application_id, $scholar_id)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                  SET application_id = :application_id,
                    scholar_id = :scholar_id,
                      name = :name,
                      relationship = :relationship,
                      age = :age,
                      gender = :gender,
                      civil_status = :civil_status,
                      living_with_family = :living_with_family,
                      education_occupation = :education_occupation,
                      monthly_income = :monthly_income";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->name = strip_tags($member['name']);
        $this->relationship = strip_tags($member['relationship']);
        $this->age = strip_tags($member['age']);
        $this->gender = strip_tags($member['gender']);
        $this->civil_status = strip_tags($member['civil_status']);
        $this->living_with_family = strip_tags($member['living_with_family']);
        $this->education_or_occupation = strip_tags($member['education_occupation']);
        $this->monthly_income = strip_tags($member['monthly_income'] ?? '0');

        // Bind values
        $stmt->bindParam(':application_id', $this->application_id);
        $stmt->bindParam(':scholar_id', $scholar_id, \PDO::PARAM_INT);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':relationship', $this->relationship);
        $stmt->bindParam(':age', $this->age);
        $stmt->bindParam(':gender', $this->gender);
        $stmt->bindParam(':civil_status', $this->civil_status);
        $stmt->bindParam(':living_with_family', $this->living_with_family);
        $stmt->bindParam(':education_occupation', $this->education_or_occupation);
        $stmt->bindParam(':monthly_income', $this->monthly_income);

        return $stmt->execute();
    }

    public function update($member, $id)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                  SET 
                      name = :name,
                      relationship = :relationship,
                      age = :age,
                      gender = :gender,
                      civil_status = :civil_status,
                      living_with_family = :living_with_family,
                      education_occupation = :education_occupation,
                      monthly_income = :monthly_income
                      WHERE application_id = :id";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->name = strip_tags($member['name']);
        $this->relationship = strip_tags($member['relationship']);
        $this->age = strip_tags($member['age']);
        $this->gender = strip_tags($member['gender']);
        $this->civil_status = strip_tags($member['civil_status']);
        $this->living_with_family = strip_tags($member['living_with_family']);
        $this->education_or_occupation = strip_tags($member['education_occupation']);
        $this->monthly_income = strip_tags($member['monthly_income'] ?? '0');

        // Bind values
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':relationship', $this->relationship);
        $stmt->bindParam(':age', $this->age);
        $stmt->bindParam(':gender', $this->gender);
        $stmt->bindParam(':civil_status', $this->civil_status);
        $stmt->bindParam(':living_with_family', $this->living_with_family);
        $stmt->bindParam(':education_occupation', $this->education_or_occupation);
        $stmt->bindParam(':monthly_income', $this->monthly_income);

        return $stmt->execute();
    }

    public function deleteByApplicationId($application_id)
    {
        $query = 'DELETE FROM ' . $this->table_name . ' WHERE application_id = :application_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':application_id', $application_id, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function getFamilyMembers($id)
    {
        $query = 'SELECT * FROM ' . $this->table_name . ' WHERE application_id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}

?>
