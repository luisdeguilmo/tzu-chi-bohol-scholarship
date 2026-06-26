<?php
namespace App\Models;

use Config\Database;

class StaffAccountModel
{
    private $table_name = 'staff';

    private $pdo;

    public $id;
    public $name;
    public $email;
    public $password;
    public $submit;
    public $procedure;
    public $course_name;
    public $strand;
    public $instruction;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
    }

    private function generateUniqueAccountId($length = 7)
    {
        do {
            // Generate a random number (7-digit)
            $randomId = mt_rand(pow(10, $length - 1), pow(10, $length) - 1);

            // Check if it already exists in this table
            $stmt = $this->pdo->prepare(
                'SELECT COUNT(*) FROM application_info WHERE application_id = :id',
            );
            $stmt->bindParam(':id', $randomId);
            $stmt->execute();
            $count = $stmt->fetchColumn();

            // Check if it exists in staff table
            $stmtStaff = $this->pdo->prepare('SELECT COUNT(*) FROM staff WHERE account_id = :id');
            $stmtStaff->bindParam(':id', $randomId);
            $stmtStaff->execute();
            $countStaff = $stmtStaff->fetchColumn();
        } while ($count > 0 || $countStaff > 0); // Retry if duplicate found in either table

        return $randomId;
    }

    public function createStaff($data, $account_id, $today)
    {
        $query =
            'INSERT INTO staff (account_id, first_name, middle_name, last_name, suffix, contact_number, email_address, age, gender, address, facebook, created_at) VALUES (:account_id, :first_name, :middle_name, :last_name, :suffix, :contact_number, :email_address, :age, :gender, :address, :facebook, :created_at)';

        $stmt = $this->pdo->prepare($query);

        $account_id = htmlspecialchars(strip_tags($account_id));
        $first_name = htmlspecialchars(strip_tags($data['first_name']));
        $middle_name = htmlspecialchars(strip_tags($data['middle_name']));
        $last_name = htmlspecialchars(strip_tags($data['last_name']));
        $suffix = htmlspecialchars(strip_tags($data['suffix']));
        $contact_number = htmlspecialchars(strip_tags($data['contact_number']));
        $email_address = htmlspecialchars(strip_tags($data['email']));
        $age = htmlspecialchars(strip_tags($data['age']));
        $gender = htmlspecialchars(strip_tags($data['gender']));
        $address = htmlspecialchars(strip_tags($data['address']));
        $facebook = htmlspecialchars(strip_tags($data['facebook']));
        $created_at = htmlspecialchars(strip_tags($today));

        $stmt->bindParam(':account_id', $account_id);
        $stmt->bindParam(':first_name', $first_name);
        $stmt->bindParam(':middle_name', $middle_name);
        $stmt->bindParam(':last_name', $last_name);
        $stmt->bindParam(':suffix', $suffix);
        $stmt->bindParam(':contact_number', $contact_number);
        $stmt->bindParam(':email_address', $email_address);
        $stmt->bindParam(':age', $age);
        $stmt->bindParam(':gender', $gender);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':facebook', $facebook);
        $stmt->bindParam(':created_at', $created_at);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function createAccount($data, $today)
    {
        $account_id = $this->generateUniqueAccountId();

        $isSuccess = $this->createStaff($data, $account_id, $today);
        if (!$isSuccess) {
            throw new \Exception('Failed to create scholar');
        }

        $query = "INSERT INTO users (email, password, created_at, account_id) 
                 VALUES (:email, :password, :created_at, :account_id)";
        $stmt = $this->pdo->prepare($query);

        // Create a secure password hash - using application_id as initial password
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

        // Sanitize application_id
        $sanitized_email = htmlspecialchars(strip_tags($data['email']));
        $sanitized_account_id = htmlspecialchars(strip_tags($account_id));
        $sanitized_created_at = htmlspecialchars(strip_tags($today));

        // Bind values
        $stmt->bindParam(':email', $sanitized_email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':created_at', $sanitized_created_at);
        $stmt->bindParam(':account_id', $sanitized_account_id);
        // $stmt->bindParam(":type", 'Scholar');

        return $stmt->execute();
    }

    public function getAllStaffs($status)
    {
        $query =
            'SELECT s.*, u.email, u.status FROM ' .
            $this->table_name .
            ' s JOIN users u ON s.account_id = u.account_id';

        if ($status === 'active') {
            $query .= " WHERE u.status = 'active'";
        } elseif ($status === 'deactivated') {
            $query .= " WHERE u.status = 'deactivated'";
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getStaffInfoById($account_id)
    {
        $query =
            'SELECT s.*, u.email, u.status FROM ' .
            $this->table_name .
            ' s JOIN users u ON s.account_id = u.account_id WHERE s.account_id = :account_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $account_id);
        $stmt->execute();

        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getStaffById($id)
    {
        $query = 'SELECT * FROM ' . $this->table_name . ' WHERE account_id = :id';
        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function updateAccountStatus($staff_id, $status)
    {
        $query = 'UPDATE users SET status = :status WHERE account_id = :staff_id';
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':staff_id', $staff_id);
        return $stmt->execute();
    }

    public function updateStaff($id, $data)
    {
        $query =
            'UPDATE ' .
            $this->table_name .
            " 
                  SET first_name = :first_name,
                  last_name = :last_name,
                  middle_name = :middle_name,
                  suffix = :suffix,
                  contact_number = :contact_number,
                  email_address = :email_address,
                  age = :age,
                  gender = :gender,
                  address = :address,
                  facebook = :facebook
                  WHERE account_id = :id";

        $stmt = $this->pdo->prepare($query);

        $first_name = htmlspecialchars(strip_tags($data['first_name']));
        $middle_name = htmlspecialchars(strip_tags($data['middle_name']));
        $last_name = htmlspecialchars(strip_tags($data['last_name']));
        $suffix = htmlspecialchars(strip_tags($data['suffix']));
        $contact_number = htmlspecialchars(strip_tags($data['contact_number']));
        $email_address = htmlspecialchars(strip_tags($data['email']));
        $age = htmlspecialchars(strip_tags($data['age']));
        $gender = htmlspecialchars(strip_tags($data['gender']));
        $address = htmlspecialchars(strip_tags($data['address']));
        $facebook = htmlspecialchars(strip_tags($data['facebook']));

        $stmt->bindParam(':first_name', $first_name);
        $stmt->bindParam(':middle_name', $middle_name);
        $stmt->bindParam(':last_name', $last_name);
        $stmt->bindParam(':suffix', $suffix);
        $stmt->bindParam(':contact_number', $contact_number);
        $stmt->bindParam(':email_address', $email_address);
        $stmt->bindParam(':age', $age);
        $stmt->bindParam(':gender', $gender);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':facebook', $facebook);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    public function deleteStaff($id)
    {
        $query = 'DELETE FROM ' . $this->table_name . ' WHERE id = :id';
        $stmt = $this->pdo->prepare($query);

        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    public function getProfileById($id)
    {
        $query = "SELECT *
                FROM profile_pictures 
                WHERE application_id = :account_id";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':account_id', $id);

        if ($stmt->execute()) {
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        }

        return null;
    }

    public function getAllStaffWithProfile($staffs, $staffModel)
    {
        $data = [];

        foreach ($staffs as $staff) {
            $files = $staffModel->getProfileById($staff['account_id']);

            foreach ($files as $file) {
                $staff[] = [
                    'profile' =>
                        $_ENV['APP_URL'] .
                        '/index.php?type=users&route=profile&file=' .
                        urlencode(basename($file['file_path'])),
                ];
            }

            $data[] = $staff;
        }

        return $data;
    }
}
?>
