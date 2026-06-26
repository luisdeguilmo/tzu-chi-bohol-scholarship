<?php
namespace App\Models;
use Config\Database;

class ApplicationPeriodModel
{
    private $pdo;
    public $table_name = 'application_period';
    public $start_date;
    public $end_date;
    public $type;
    public $status;
    public $announcement_message;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function createApplicationPeriod($data)
    {
        // Validate dates
        if (strtotime($data['startDate']) > strtotime($data['endDate'])) {
            throw new \Exception('End date must be after start date.');
        }

        // Calculate status based on dates
        // $status = $data['status'];

        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                  SET start_date = :start_date,
                  end_date = :end_date,
                  school_year = :school_year,
                  type = :type,
                  status = :status,
                  announcement_message = :announcement_message,
                  created_at = NOW()";

        $stmt = $this->pdo->prepare($query);

        $start_date = htmlspecialchars(strip_tags($data['startDate']));
        $end_date = htmlspecialchars(strip_tags($data['endDate']));
        $school_year = htmlspecialchars(strip_tags($data['schoolYear']));
        $type = htmlspecialchars(strip_tags($data['type']));
        $status = htmlspecialchars(strip_tags($data['status']));
        $announcement_message = htmlspecialchars(strip_tags($data['announcementMessage']));

        $stmt->bindParam(':start_date', $start_date);
        $stmt->bindParam(':end_date', $end_date);
        $stmt->bindParam(':school_year', $school_year);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':announcement_message', $announcement_message);

        return $stmt->execute();
    }

    public function updateApplicationPeriod($id, $data)
    {
        // Validate dates
        if (strtotime($data['startDate']) > strtotime($data['endDate'])) {
            throw new \Exception('End date must be after start date.');
        }

        // If status is provided, use it; otherwise calculate based on dates
        $status = isset($data['status']);
        // ? $data['status'] : $this->calculateStatus($data['startDate'], $data['endDate'])

        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                  SET start_date = :start_date,
                  end_date = :end_date,
                  school_year = :school_year,
                  status = :status,
                  announcement_message = :announcement_message,
                  updated_at = NOW()
                  WHERE id = :id";

        $stmt = $this->pdo->prepare($query);

        $start_date = htmlspecialchars(strip_tags($data['startDate']));
        $end_date = htmlspecialchars(strip_tags($data['endDate']));
        $school_year = htmlspecialchars(strip_tags($data['schoolYear']));
        $status = htmlspecialchars(strip_tags($data['status']));
        $announcement_message = htmlspecialchars(strip_tags($data['announcementMessage']));

        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':start_date', $start_date);
        $stmt->bindParam(':end_date', $end_date);
        $stmt->bindParam(':school_year', $school_year);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':announcement_message', $announcement_message);

        return $stmt->execute();
    }

    public function getLatestNewApplicationPeriod()
    {
        $query =
            'SELECT status, announcement_message, school_year, start_date, end_date FROM ' .
            $this->table_name .
            " WHERE type = 'new' ORDER BY created_at DESC LIMIT 1";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getLatestRenewalApplicationPeriod()
    {
        $query =
            'SELECT status, start_date, end_date, school_year FROM ' .
            $this->table_name .
            " WHERE type = 'renewal' ORDER BY created_at DESC LIMIT 1";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getAllApplicationPeriods()
    {
        // Update all application period statuses first
        // $this->updateAllApplicationPeriodStatuses();

        $query = 'SELECT * FROM ' . $this->table_name . ' ORDER BY created_at DESC';
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getApplicationPeriodById($id)
    {
        $query = 'SELECT * FROM ' . $this->table_name . ' WHERE id = :id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getLatestApplicationPeriod()
    {
        $query = 'SELECT * FROM ' . $this->table_name . ' ORDER BY created_at DESC LIMIT 1';
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function hasActiveNewApplicationPeriod()
    {
        // Update all application period statuses first
        // $this->updateAllApplicationPeriodStatuses();

        $query =
            'SELECT COUNT(*) FROM ' .
            $this->table_name .
            " WHERE type = 'new' AND status = 'Active'";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    public function hasActiveRenewalApplicationPeriod()
    {
        // Update all application period statuses first
        // $this->updateAllApplicationPeriodStatuses();

        $query =
            'SELECT COUNT(*) FROM ' .
            $this->table_name .
            " WHERE type = 'renewal' AND status = 'Active'";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    public function deleteApplicationPeriod($id)
    {
        $query = 'DELETE FROM ' . $this->table_name . ' WHERE id = :id';

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>




