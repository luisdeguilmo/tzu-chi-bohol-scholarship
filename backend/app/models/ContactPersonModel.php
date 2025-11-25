<?php

namespace App\Models;

use Config\Database;

class ContactPersonModel
{
    private $table_name = 'contact_person';

    public $id;
    public $application_id;
    public $emergency_contact_name;
    public $emergency_contact_relationship;
    public $emergency_contact_address;
    public $emergency_contact_number;

    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($data, $application_id)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                  SET application_id = :application_id,
                      emergency_contact_name = :emergency_contact_name,
                      emergency_contact_relationship = :emergency_contact_relationship,
                      emergency_contact_address = :emergency_contact_address,
                      emergency_contact_number = :emergency_contact_number";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->emergency_contact_name = strip_tags($data['emergency_contact_name'] ?? '');
        $this->emergency_contact_relationship = strip_tags(
            $data['emergency_contact_relationship'] ?? '',
        );
        $this->emergency_contact_address = strip_tags($data['emergency_contact_address'] ?? '');
        $this->emergency_contact_number = strip_tags($data['emergency_contact_number'] ?? '');

        // Bind values
        $stmt->bindParam(':application_id', $this->application_id);
        $stmt->bindParam(':emergency_contact_name', $this->emergency_contact_name);
        $stmt->bindParam(':emergency_contact_relationship', $this->emergency_contact_relationship);
        $stmt->bindParam(':emergency_contact_address', $this->emergency_contact_address);
        $stmt->bindParam(':emergency_contact_number', $this->emergency_contact_number);

        return $stmt->execute();
    }

    public function renew($data, $application_id, $scholar_id)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                  SET application_id = :application_id,
                        scholar_id = :scholar_id,
                      emergency_contact_name = :emergency_contact_name,
                      emergency_contact_relationship = :emergency_contact_relationship,
                      emergency_contact_address = :emergency_contact_address,
                      emergency_contact_number = :emergency_contact_number";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->application_id = $application_id;
        $this->emergency_contact_name = strip_tags($data['emergency_contact_name'] ?? '');
        $this->emergency_contact_relationship = strip_tags(
            $data['emergency_contact_relationship'] ?? '',
        );
        $this->emergency_contact_address = strip_tags($data['emergency_contact_address'] ?? '');
        $this->emergency_contact_number = strip_tags($data['emergency_contact_number'] ?? '');

        // Bind values
        $stmt->bindParam(':application_id', $this->application_id);
        $stmt->bindParam(':scholar_id', $scholar_id, \PDO::PARAM_INT);
        $stmt->bindParam(':emergency_contact_name', $this->emergency_contact_name);
        $stmt->bindParam(':emergency_contact_relationship', $this->emergency_contact_relationship);
        $stmt->bindParam(':emergency_contact_address', $this->emergency_contact_address);
        $stmt->bindParam(':emergency_contact_number', $this->emergency_contact_number);

        return $stmt->execute();
    }

    public function update($data, $id)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                  SET 
                      emergency_contact_name = :emergency_contact_name,
                      emergency_contact_relationship = :emergency_contact_relationship,
                      emergency_contact_address = :emergency_contact_address,
                      emergency_contact_number = :emergency_contact_number
                      WHERE application_id = :id";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->emergency_contact_name = strip_tags($data['emergency_contact_name'] ?? '');
        $this->emergency_contact_relationship = strip_tags(
            $data['emergency_contact_relationship'] ?? '',
        );
        $this->emergency_contact_address = strip_tags($data['emergency_contact_address'] ?? '');
        $this->emergency_contact_number = strip_tags($data['emergency_contact_number'] ?? '');

        // Bind values
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':emergency_contact_name', $this->emergency_contact_name);
        $stmt->bindParam(':emergency_contact_relationship', $this->emergency_contact_relationship);
        $stmt->bindParam(':emergency_contact_address', $this->emergency_contact_address);
        $stmt->bindParam(':emergency_contact_number', $this->emergency_contact_number);

        return $stmt->execute();
    }

    public function getContactPerson($id)
    {
        $query = 'SELECT * FROM ' . $this->table_name . ' WHERE application_id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
}

?>
