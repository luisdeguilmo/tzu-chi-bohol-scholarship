<?php

namespace App\Models;

use Config\Database;

class CharacterReferenceModel
{
    private $table_name = 'character_reference';

    public $id;
    public $application_id;
    public $name;
    public $address;
    public $company;
    public $position;
    public $contact_number;

    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($scholar, $application_id)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                  SET application_id = :application_id,
                      name = :name,
                      address = :address,
                      company = :company,
                      position = :position,
                      contact_number = :contact_number";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->name = strip_tags($scholar['name']);
        $this->address = strip_tags($scholar['address']);
        $this->company = strip_tags($scholar['company']);
        $this->position = strip_tags($scholar['position']);
        $this->contact_number = strip_tags($scholar['contact_number']);

        // Bind values
        $stmt->bindParam(':application_id', $this->application_id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':company', $this->company);
        $stmt->bindParam(':position', $this->position);
        $stmt->bindParam(':contact_number', $this->contact_number);

        return $stmt->execute();
    }

    public function renew($scholar, $application_id, $scholar_id)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                  SET application_id = :application_id,
                    scholar_id = :scholar_id,
                      name = :name,
                      address = :address,
                      company = :company,
                      position = :position,
                      contact_number = :contact_number";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->name = strip_tags($scholar['name']);
        $this->address = strip_tags($scholar['address']);
        $this->company = strip_tags($scholar['company']);
        $this->position = strip_tags($scholar['position']);
        $this->contact_number = strip_tags($scholar['contact_number']);

        // Bind values
        $stmt->bindParam(':application_id', $this->application_id);
        $stmt->bindParam(':scholar_id', $scholar_id, \PDO::PARAM_INT);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':company', $this->company);
        $stmt->bindParam(':position', $this->position);
        $stmt->bindParam(':contact_number', $this->contact_number);

        return $stmt->execute();
    }

    public function update($scholar, $id)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                  SET 
                      name = :name,
                      address = :address,
                      company = :company,
                      position = :position,
                      contact_number = :contact_number
                      WHERE application_id = :id";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->name = strip_tags($scholar['name']);
        $this->address = strip_tags($scholar['address']);
        $this->company = strip_tags($scholar['company']);
        $this->position = strip_tags($scholar['position']);
        $this->contact_number = strip_tags($scholar['contact_number']);

        // Bind values
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':company', $this->company);
        $stmt->bindParam(':position', $this->position);
        $stmt->bindParam(':contact_number', $this->contact_number);

        return $stmt->execute();
    }

    public function deleteByApplicationId($id)
    {
        $query = 'DELETE FROM ' . $this->table_name . ' WHERE application_id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function getCharacterReference($id)
    {
        $query = 'SELECT id, name, address, company, position, contact_number FROM ' . $this->table_name . ' WHERE application_id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}

?>
