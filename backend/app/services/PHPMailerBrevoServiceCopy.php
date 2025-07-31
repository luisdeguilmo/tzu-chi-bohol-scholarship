<?php
namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class PHPMailerBrevoService {
    private $mail;
    private $organizationName;
    private $organizationAddress;
    private $contactInfo;
    
    public function __construct($brevoEmail, $brevoSmtpKey, $orgName, $orgAddress, $contactInfo) {
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
        $this->mail->setFrom("tzuchiboholoffice@gmail.com", $this->organizationName);
        
        $this->logToConsole("PHPMailerBrevoService initialized successfully");
    }
    
    private function logToConsole($message, $type = 'log') {
        // Escape the message for JavaScript output
        $escapedMessage = json_encode($message);
        $timestamp = date('Y-m-d H:i:s');
        
        // Output JavaScript that will log to browser console
        echo "<script>console.{$type}('[PHP - {$timestamp}] ' + {$escapedMessage});</script>";
        
        // Also log to PHP error log for server-side debugging
        error_log("[PHPMailerBrevoService] " . $message);
    }
    
    private function sendEmail($to, $subject, $htmlContent) {
        $this->logToConsole("Attempting to send email to: " . $to);
        $this->logToConsole("Email subject: " . $subject);
        
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
            
            $this->logToConsole("Email configuration set, attempting to send...");
            
            $this->mail->send();
            
            $this->logToConsole("Email successfully sent to: " . $to, 'info');
            error_log("Email successfully sent to: " . $to);
            return true;
            
        } catch (Exception $e) {
            $errorMessage = "Failed to send email to {$to}: " . $this->mail->ErrorInfo;
            $this->logToConsole($errorMessage, 'error');
            error_log($errorMessage);
            return false;
        }
    }
    
    public function sendApplicationApprovalEmail($studentInfo) {
        $this->logToConsole("Preparing approval email for student: " . $studentInfo['first_name'] . ' ' . $studentInfo['last_name']);
        
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = "Scholarship Application Approved";
        $htmlContent = "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
            <p style=\"margin-bottom: 16px;\">
                Congratulations! We are pleased to inform you that your application for the
                <strong>Tzu Chi Scholarship Program</strong> for Academic Year 
                <strong>{$studentInfo['school_year']}</strong> has been 
                <span style=\"font-weight: bold;\">approved</span>.
            </p>
            <p style=\"padding-bottom: 32px;\">We look forward to supporting your academic journey.</p> 
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";
        
        $result = $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
        
        if ($result) {
            $this->logToConsole("Approval email sent successfully", 'info');
        } else {
            $this->logToConsole("Failed to send approval email", 'error');
        }
        
        return $result;
    }
    
    public function sendApplicationRejectionEmail($studentInfo) {
        $middleName = !empty($studentInfo['middle_name']) ? $studentInfo['middle_name'] . ' ' : '';
        $fullName = $studentInfo['first_name'] . ' ' . $middleName . $studentInfo['last_name'];
        
        $this->logToConsole("Preparing rejection email for student: " . $fullName);
        
        $subject = "Scholarship Application Update";
        $htmlContent = "
            <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
                <p>Dear {$fullName},</p>
                <p>We regret to inform you that your scholarship application for SY {$studentInfo['school_year']} was not approved.</p>
                <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
                <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
                <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
            </div>
        ";
        
        $result = $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
        
        if ($result) {
            $this->logToConsole("Rejection email sent successfully", 'info');
        } else {
            $this->logToConsole("Failed to send rejection email", 'error');
        }
        
        return $result;
    }
    
    public function sendExaminationScheduleEmail($applicant, $date, $time) {
        $fullName = $applicant['first_name'] . ' ' . $applicant['last_name'];
        
        $this->logToConsole("Preparing examination schedule email for: " . $fullName);
        $this->logToConsole("Exam date: " . $date . ", time: " . $time);
        
        $subject = "Scholarship Examination Schedule";
        $htmlContent = "
            <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
                <p>Dear {$fullName},</p>
                <p style=\"margin-bottom: 16px;\">
                    We are pleased to inform you that you are scheduled to take the entrance examination for the
                    <strong>Tzu Chi Scholarship Program</strong> for Academic Year 
                    <strong>{$applicant['school_year']}</strong>.
                </p>
                <p style=\"margin-bottom: 16px;\">
                    📅 <strong>Date:</strong> {$date}<br>
                    🕒 <strong>Time:</strong> {$time}<br>
                    📍 <strong>Venue:</strong> Room 1
                </p>
                <p style=\"margin-bottom: 16px;\">
                    Please arrive 15 minutes early and bring your valid ID and necessary documents. If you have any questions, feel free to contact us.
                </p>
                <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
                <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
                <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
            </div>
        ";
        
        $result = $this->sendEmail($applicant['email'], $subject, $htmlContent);
        
        if ($result) {
            $this->logToConsole("Examination schedule email sent successfully", 'info');
        } else {
            $this->logToConsole("Failed to send examination schedule email", 'error');
        }
        
        return $result;
    }
    
    public function sendEmailWithAttachment($to, $subject, $htmlContent, $attachmentPath, $attachmentName) {
        $this->logToConsole("Preparing email with attachment to: " . $to);
        $this->logToConsole("Attachment: " . $attachmentName . " (Path: " . $attachmentPath . ")");
        
        try {
            $this->mail->clearAddresses();
            $this->mail->clearAttachments();
            
            $this->mail->addAddress($to);
            $this->mail->addAttachment($attachmentPath, $attachmentName);
            
            $this->mail->isHTML(true);
            $this->mail->Subject = $subject;
            $this->mail->Body = $htmlContent;
            $this->mail->AltBody = strip_tags($htmlContent);
            
            $this->logToConsole("Sending email with attachment...");
            
            $this->mail->send();
            
            $this->logToConsole("Email with attachment sent successfully to: " . $to, 'info');
            return true;
            
        } catch (Exception $e) {
            $errorMessage = "Failed to send email with attachment to {$to}: " . $this->mail->ErrorInfo;
            $this->logToConsole($errorMessage, 'error');
            error_log($errorMessage);
            return false;
        }
    }
}
?>