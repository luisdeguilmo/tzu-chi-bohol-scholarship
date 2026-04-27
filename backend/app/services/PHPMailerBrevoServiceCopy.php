<?php
namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
try {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
    $dotenv->safeLoad();
} catch (\Exception $e) {
    error_log('Could not load .env file: ' . $e->getMessage());
}

class PHPMailerBrevoService
{
    private $mail;
    private $organizationName;
    private $organizationAddress;
    private $contactInfo;

    public function __construct($brevoEmail, $brevoSmtpKey, $orgName, $orgAddress, $contactInfo)
    {
        $this->organizationName = $orgName;
        $this->organizationAddress = $orgAddress;
        $this->contactInfo = $contactInfo;

        $this->mail = new PHPMailer(true);

        // Configure Brevo SMTP settings
        $this->mail->isSMTP();
        $this->mail->Host = 'smtp-relay.brevo.com';
        $this->mail->SMTPAuth = true;
        $this->mail->Username = $brevoEmail;
        $this->mail->Password = $brevoSmtpKey;
        $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mail->Port = 587;

        // Set default sender
        $this->mail->setFrom('tzuchiboholoffice@gmail.com', $this->organizationName);
    }

    private function sendEmail($to, $subject, $htmlContent)
    {
        try {
            // Clear previous recipients
            $this->mail->clearAddresses();

            // Set recipient
            $this->mail->addAddress($to);

            // Content
            $this->mail->isHTML(true);
            $this->mail->Subject = $subject;
            $this->mail->Body = $htmlContent;
            $this->mail->AltBody = strip_tags($htmlContent);

            $this->mail->send();
            error_log('Email successfully sent to: ' . $to);
            return true;
        } catch (Exception $e) {
            error_log('Failed to send email: ' . $this->mail->ErrorInfo);
            return false;
        }
    }

    public function sendAccountCredentialsEmail($studentInfo)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'Tzu Chi Scholarship Account Credentials';
        $htmlContent = "
    <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
        <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
        <p style=\"margin-bottom: 16px;\">
            Congratulations once again on becoming part of the Tzu Chi Scholarship Program!
        </p>
        <p style=\"margin-bottom: 16px;\">
            We have created your account to help you access scholar-related updates and requirements. Please find your login credentials below:
        </p>
        <div style=\"background-color: #f9f9f9; border: 1px solid #ddd; padding: 12px; margin-bottom: 16px;\">
            <p style=\"margin: 0;\"><strong>Email:</strong> {$studentInfo['email']}</p>
            <p style=\"margin: 0;\"><strong>Password:</strong> {$studentInfo['application_id']}</p>
        </div>
        <p style=\"margin-bottom: 16px;\">
            For security, please log in and change your password immediately after your first login.
        </p>
        <p style=\"padding-bottom: 32px;\">We look forward to supporting your academic journey.</p>
        <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
        <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
        <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
    </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendResetLinkEmail($email, $token)
    {
        // $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $allowedOrigin = $_ENV['ALLOWED_ORIGIN'] ?? '*';
        $resetLink = 'http://' . $allowedOrigin . '/reset-password?token=' . $token;

        $subject = 'Password Reset Request';
        $htmlContent =
            "
    <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
        <p style=\"margin-bottom: 16px;\">
            We recently received a request to reset the password to your account " .
            $email .
            ".
        </p>
        <p style=\"margin-bottom: 8px;\">
            Click the button to reset your password:
        </p>
        <div style=\"background-color: #f9f9f9; border: 1px solid #ddd; padding: 12px; margin-bottom: 16px;\">
            <a href=\"$resetLink\" style=\"color: #1a73e8; text-decoration: none; font-weight: bold;\">
                Reset Your Password
            </a>
        </div>
        <p style=\"margin-bottom: 8px;\">
            Please note that this reset link expires in 24 hours.
        </p>
        <p style=\"margin-bottom: 32px;\">
            If you did not request to reset your password, simply disregard this email. No changes will be made to your account.
        </p>
        <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
        <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
        <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
    </div>";

        return $this->sendEmail($email, $subject, $htmlContent);
    }

    public function sendExaminationScheduleEmail($applicant, $batch, $date, $time, $venue)
    {
        $fullName = $applicant['first_name'] . ' ' . $applicant['last_name'];
        $subject = 'Scholarship Examination Schedule';
        $htmlContent = "
            <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
                <p>Dear {$fullName},</p>
                <p style=\"margin-bottom: 16px;\">
                    We are pleased to inform you that you are scheduled to take the entrance examination for the
                    <strong>Tzu Chi Scholarship Program</strong> for Academic Year 
                    <strong>{$applicant['school_year']}</strong>.
                </p>
                <p style=\"margin-bottom: 16px;\">
                        <strong>Batch:</strong> {$batch}<br>
                        <strong>Date :</strong> {$date}<br>
                        <strong>Time :</strong> {$time}<br>
                        <strong>Venue:</strong> {$venue}
                </p>
                <p style=\"margin-bottom: 16px;\">
                    Please arrive 15 minutes early and bring your valid ID and necessary documents. If you have any questions, feel free to contact us.
                </p>
                <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
                <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
                <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
            </div>
        ";

        return $this->sendEmail($applicant['email'], $subject, $htmlContent);
    }

    public function sendOrientationScheduleEmail($applicant, $batch, $date, $time, $venue)
    {
        $fullName = $applicant['first_name'] . ' ' . $applicant['last_name'];
        $subject = 'Orientation Schedule';
        $htmlContent = "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p>Dear {$fullName},</p>
            <p style=\"margin-bottom: 16px;\">
                We are pleased to inform you that you are scheduled to attend the 
                <strong>Orientation Program</strong> for the 
                <strong>Tzu Chi Scholarship Program</strong> for Academic Year 
                <strong>{$applicant['school_year']}</strong>.
            </p>
            <p style=\"margin-bottom: 16px;\">
                    <strong>Batch:</strong> {$batch}<br>
                    <strong>Date :</strong> {$date}<br>
                    <strong>Time :</strong> {$time}<br>
                    <strong>Venue:</strong> {$venue}
            </p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>
    ";

        return $this->sendEmail($applicant['email'], $subject, $htmlContent);
    }

    public function sendNewEventEmail($studentInfo, $data)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'New Event';
        $htmlContent =
            "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
            <p style=\"margin-bottom: 16px;\">
                A new event " .
            $data['event_name'] .
            " has been created and you are invited to join!. Check it out and don't miss the chance to be part of this event!
            </p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendRenewalApplicationEmail($studentInfo, $data)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'New ';
        $htmlContent = "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
            <p style=\"margin-bottom: 16px;\">{$data['announcementMessage']}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendActivityRecordedEmail($studentInfo, $data)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'Activity Recorded';
        $htmlContent =
            "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
            <p style=\"margin-bottom: 16px;\">
                Your community service " .
            $data['activity_name'] .
            " has been successfully recorded.
            </p>
            <p style=\"padding-bottom: 32px;\">We look forward to supporting your academic journey.</p> 
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendActivityNotRecordedEmail($studentInfo, $data)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'Activity Not Recorded';
        $htmlContent =
            "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
            <p style=\"margin-bottom: 16px;\">
                Your community service " .
            $data['activity_name'] .
            " was not recorded. Please check the feedback for details.
            </p>
            <p style=\"padding-bottom: 32px;\">We look forward to supporting your academic journey.</p> 
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendDailyDigest($studentInfo, $total, $currentDate, $previousDate)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = "Daily Scholarship Application Update - September 24, 2025
";
        $htmlContent =
            "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
            <p style=\"margin-bottom: 16px;\">
                A total of " .
            $currentDate .
            ' new scholarship applications were submitted on ' .
            $previousDate .
            ".
            </p>
            <p style=\"padding-bottom: 32px;\">We look forward to supporting your academic journey.</p> 
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendCommunityServiceSubmitted($studentInfo)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'New Community Service Submitted';
        $htmlContent =
            "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
            <p style=\"margin-bottom: 16px;\">
                " .
            $studentInfo['first_name'] .
            $studentInfo['last_name'] .
            " has submitted a new Community Service Report.
            </p>
            <p style=\"padding-bottom: 32px;\">We look forward to supporting your academic journey.</p> 
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendEmailWithAttachment(
        $to,
        $subject,
        $htmlContent,
        $attachmentPath,
        $attachmentName,
    ) {
        try {
            $this->mail->clearAddresses();
            $this->mail->clearAttachments();

            $this->mail->addAddress($to);
            $this->mail->addAttachment($attachmentPath, $attachmentName);

            $this->mail->isHTML(true);
            $this->mail->Subject = $subject;
            $this->mail->Body = $htmlContent;
            $this->mail->AltBody = strip_tags($htmlContent);

            $this->mail->send();
            return true;
        } catch (Exception $e) {
            error_log('Failed to send email with attachment: ' . $this->mail->ErrorInfo);
            return false;
        }
    }
}
?>
