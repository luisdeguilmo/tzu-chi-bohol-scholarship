<?php
namespace App\Models;
use Config\Database;

date_default_timezone_set('Asia/Manila');

class EmailMessageModel
{
    private $pdo;
    public $table_name = 'email_messages';

    public function __construct()
    {
        // Set timezone and initialize date/time properties in constructor
        date_default_timezone_set('Asia/Manila');

        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function create($data)
    {
        $query =
            'INSERT INTO ' .
            $this->table_name .
            " 
                  SET name = :name";

        $stmt = $this->pdo->prepare($query);
        $name = strip_tags($data);
        $stmt->bindParam(':name', $name);
        return $stmt->execute();
    }

    public function getPassedMessage($stage)
    {
        $query =
            'SELECT message FROM ' .
            $this->table_name .
            " WHERE stage = :stage AND (status = 'approved' OR status = 'passed')";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':stage', $stage);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            return $row['message'];
        }

        return null;
    }

    public function getFailedMessage($stage)
    {
        $query =
            'SELECT message FROM ' .
            $this->table_name .
            " WHERE stage = :stage AND (status = 'rejected' OR status = 'failed')";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':stage', $stage);
        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            return $row['message'];
        }

        return null;
    }

    public function updatePassedMessage($data)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                  SET message = :message 
                  WHERE stage = :stage AND (status = 'approved' OR status = 'passed')";

        $stmt = $this->pdo->prepare($query);

        $passedMessage = strip_tags($data['passedMessage']);
        $stage = strip_tags($data['stage']);

        $stmt->bindParam(':stage', $stage);
        $stmt->bindParam(':message', $passedMessage);

        return $stmt->execute();
    }

    public function updateFailedMessage($data)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                  SET message = :message 
                  WHERE stage = :stage AND (status = 'rejected' OR status = 'failed')";

        $stmt = $this->pdo->prepare($query);

        $failedMessage = strip_tags($data['failedMessage']);
        $stage = strip_tags($data['stage']);

        $stmt->bindParam(':stage', $stage);
        $stmt->bindParam(':message', $failedMessage);

        return $stmt->execute();
    }

    public function delete($id)
    {
        $query = 'DELETE FROM ' . $this->table_name . ' WHERE id = :id';
        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }
}
?>
