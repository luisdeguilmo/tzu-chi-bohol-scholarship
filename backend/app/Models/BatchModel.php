<?php

namespace App\Models;

date_default_timezone_set('Asia/Manila');

use Config\Database;

class BatchModel
{
    private $table_name = 'batches';

    public $id;
    public $batch_name;
    public $schedule;
    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getBatches($purpose)
    {
        $query =
            'SELECT id, batch_name, schedule, venue, message, is_schedule_sent FROM ' .
            $this->table_name .
            ' WHERE purpose = :purpose';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':purpose', $purpose);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getBatchById($id, $purpose)
    {
        $query =
            'SELECT id, batch_name, schedule, venue, message, is_schedule_sent FROM ' .
            $this->table_name .
            ' WHERE purpose = :purpose AND batch_name = :id';
        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':purpose', $purpose);
        $stmt->execute();

        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function deleteBatch($id)
    {
        $query = 'DELETE FROM ' . $this->table_name . ' WHERE batch_name = :id';
        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    public function createBatch($data)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            ' SET batch_name = :batch_name, purpose = :purpose';

        $stmt = $this->pdo->prepare($query);

        // Extract batch_name from the data array
        $batch_name = htmlspecialchars(strip_tags($data['batch_name']));
        $purpose = htmlspecialchars(strip_tags($data['purpose']));

        $stmt->bindParam(':batch_name', $batch_name);
        $stmt->bindParam(':purpose', $purpose);

        return $stmt->execute();
    }

    public function createSchedule($data, $id)
    {
        try {
            $query =
                'UPDATE ' .
                $this->table_name .
                " SET schedule = :schedule, venue = :venue, message = :message, is_schedule_sent = 1 WHERE purpose = :purpose AND batch_name = :batch_name";
            $stmt = $this->pdo->prepare($query);

            if (!isset($data['schedule'])) {
                throw new \Exception('Schedule data is required');
            }

            $schedule = htmlspecialchars(strip_tags($data['schedule']));
            $venue = htmlspecialchars(strip_tags($data['venue']));
            $purpose = htmlspecialchars(strip_tags($data['purpose']));
            $message = strip_tags($data['message']);

            $stmt->bindParam(':schedule', $schedule);
            $stmt->bindParam(':venue', $venue);
            $stmt->bindParam(':message', $message);
            $stmt->bindParam(':batch_name', $id);
            $stmt->bindParam(':purpose', $purpose);

            return $stmt->execute();
        } catch (\Exception $e) {
            error_log('createSchedule error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateBatch($id)
    {
        $query = 'UPDATE ' . $this->table_name . " SET is_schedule_sent = '1' WHERE id = :id";

        $stmt = $this->pdo->prepare($query);

        // Extract batch_name from the data array

        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    public function deleteAllBatch()
    {
        $query = 'DELETE FROM ' . $this->table_name;

        $stmt = $this->pdo->prepare($query);

        return $stmt->execute();
    }
}
?>
