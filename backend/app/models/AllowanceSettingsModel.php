<?php

namespace App\Models;

use Config\Database;

class AllowanceSettingsModel
{
    private $table_name = 'allowance_settings';

    private $pdo;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    public function getMaximumHoursAndAmountPerHour()
    {
        $query = 'SELECT * FROM ' . $this->table_name;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function setMaximumHoursAndAmountPerHour($data)
    {
        try {
            $query =
                'UPDATE ' .
                $this->table_name .
                ' SET maximum_hours = :maximum_hours, amount_per_hour = :amount_per_hour, updated_at = NOW()';
            $stmt = $this->pdo->prepare($query);

            $maximum_hours = htmlspecialchars(strip_tags($data['maximum_hours']));
            $amount_per_hour = htmlspecialchars(strip_tags($data['amount_per_hour']));

            $stmt->bindParam(':maximum_hours', $maximum_hours, \PDO::PARAM_INT);
            $stmt->bindParam(':amount_per_hour', $amount_per_hour, \PDO::PARAM_INT);

            return $stmt->execute();
        } catch (\Exception $e) {
            error_log('createScore error: ' . $e->getMessage());
            throw $e;
        }
    }
}
?>
