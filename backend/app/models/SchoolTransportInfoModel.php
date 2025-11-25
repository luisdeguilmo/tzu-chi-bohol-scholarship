<?php

namespace App\Models;

use Config\Database;

class SchoolTransportInfoModel
{
    private $table_name = 'scholar_transport_info';

    public $id;
    public $scholarId;
    public $stayType;
    public $address;
    public $dailyTransportCost;
    public $routeExplanation;

    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($data)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                  SET scholar_id = :scholar_id,
                      stay_type = :stay_type,
                      address = :address,
                      daily_transport_cost = :daily_transport_cost,
                      route_explanation = :route_explanation,
                      created_at = NOW()";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->scholarId = strip_tags($data['scholar_id']);
        $this->stayType = strip_tags($data['stay_type']);
        $this->address = strip_tags($data['address']);
        $this->dailyTransportCost = strip_tags($data['daily_transport_cost']);
        $this->routeExplanation = strip_tags($data['route_explanation']);

        // Bind values
        $stmt->bindParam(':scholar_id', $this->scholarId);
        $stmt->bindParam(':stay_type', $this->stayType);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':daily_transport_cost', $this->dailyTransportCost);
        $stmt->bindParam(':route_explanation', $this->routeExplanation);

        return $stmt->execute();
    }

    public function update($data)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                  SET
                      stay_type = :stay_type,
                      address = :address,
                      daily_transport_cost = :daily_transport_cost,
                      route_explanation = :route_explanation,
                      created_at = NOW() WHERE scholar_id = :scholar_id";

        $stmt = $this->pdo->prepare($query);

        // Sanitize inputs
        $this->scholarId = strip_tags($data['scholar_id']);
        $this->stayType = strip_tags($data['stay_type']);
        $this->address = strip_tags($data['address']);
        $this->dailyTransportCost = strip_tags($data['daily_transport_cost']);
        $this->routeExplanation = strip_tags($data['route_explanation']);

        // Bind values
        $stmt->bindParam(':scholar_id', $this->scholarId);
        $stmt->bindParam(':stay_type', $this->stayType);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':daily_transport_cost', $this->dailyTransportCost);
        $stmt->bindParam(':route_explanation', $this->routeExplanation);

        return $stmt->execute();
    }

    public function checkTransportInfoRecord($id)
    {
        $query = 'SELECT scholar_id FROM ' . $this->table_name . ' WHERE scholar_id = :scholar_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $id);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        if ($row) {
            return $row['scholar_id'];
        }
        return null;
    }

    public function getTransportInfoById($id)
    {
        $query = 'SELECT * FROM ' . $this->table_name . ' WHERE scholar_id = :scholar_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':scholar_id', $id);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
}

?>
