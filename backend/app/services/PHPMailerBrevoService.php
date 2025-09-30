<?php
namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

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

    public function sendApplicationApprovalEmail($studentInfo)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'Scholarship Application Approved';
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

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendApplicationRejectionEmail($studentInfo)
    {
        $middleName = !empty($studentInfo['middle_name']) ? $studentInfo['middle_name'] . ' ' : '';
        $fullName = $studentInfo['first_name'] . ' ' . $middleName . $studentInfo['last_name'];
        $subject = 'Scholarship Application Update';
        $htmlContent = "
            <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
                <p>Dear {$fullName},</p>
                <p>We regret to inform you that your scholarship application for SY {$studentInfo['school_year']} was not approved.</p>
                <p>{$studentInfo['feedback']}</p>
                <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
                <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
                <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
            </div>
        ";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendExaminationPassedEmail($studentInfo)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'Tzu Chi Scholarship Exam Result';
        $htmlContent = "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
            <p style=\"margin-bottom: 16px;\">
                Congratulations! We are pleased to inform you that you have successfully passed the written examination for the Tzu Chi Foundation Scholarship Program. Your efforts are truly commendable. Please stay tuned for further announcements regarding the next steps in the screening process. We appreciate your continued interest and patience. Thank you!
            </p>
            <p style=\"padding-bottom: 32px;\">We look forward to supporting your academic journey.</p> 
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendExaminationFailedEmail($studentInfo)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'Tzu Chi Scholarship Exam Result';
        $htmlContent = "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
            <p style=\"margin-bottom: 16px;\">
                Good day. Thank you for taking the time to participate in the written examination for the Tzu Chi Foundation Scholarship Program. After careful evaluation, we regret to inform you that you did not pass this stage of the screening process. We appreciate your effort and encourage you to continue striving for your goals. We wish you all the best in your future endeavors.
            </p>
            <p style=\"padding-bottom: 32px;\">We look forward to supporting your academic journey.</p> 
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendInitialInterviewPassedEmail($studentInfo)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'Tzu Chi Scholarship Initial Interview Result';
        $htmlContent = "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
            <p style=\"margin-bottom: 16px;\">
                Good day! We’re happy to inform you that you have passed the initial interview for the Tzu Chi Foundation Scholarship Program. Your story and determination truly inspired us. Please wait for further updates as you move forward to the next stage of the selection process. Thank you for your continued participation!
            </p>
            <p style=\"padding-bottom: 32px;\">We look forward to supporting your academic journey.</p> 
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendInitialInterviewFailedEmail($studentInfo)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'Tzu Chi Scholarship Initial Interview Result';
        $htmlContent = "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
            <p style=\"margin-bottom: 16px;\">
                Thank you for joining the initial interview for the Tzu Chi Foundation Scholarship Program. We truly value the opportunity to hear your story. However, after thorough consideration, we regret to inform you that you did not advance to the next stage. We appreciate your effort and encourage you to continue pursuing your dreams. Wishing you all the best ahead.
            </p>
            <p style=\"padding-bottom: 32px;\">We look forward to supporting your academic journey.</p> 
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendHomeVisitationPassedEmail($studentInfo)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'Tzu Chi Scholarship Application Update';
        $htmlContent = "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
            <p style=\"margin-bottom: 16px;\">
                Warm greetings! We’re pleased to let you know that you have successfully passed another stage in the Tzu Chi Foundation Scholarship screening process. We appreciate your sincerity and the glimpse into your life that helped us understand your situation better. Kindly wait for further instructions regarding the final interview. Keep up the good spirit and thank you!
            </p>
            <p style=\"padding-bottom: 32px;\">We look forward to supporting your academic journey.</p> 
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendHomeVisitationFailedEmail($studentInfo)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'Tzu Chi Scholarship Application Update';
        $htmlContent = "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
            <p style=\"margin-bottom: 16px;\">
                Thank you for your participation in the Tzu Chi Foundation Scholarship screening process. After a complete review, we regret to inform you that you were not selected to move forward. We truly admire your courage and openness in sharing your life with us. Please continue to aim high and believe in your potential. Wishing you success in all that you do.
            </p>
            <p style=\"padding-bottom: 32px;\">We look forward to supporting your academic journey.</p> 
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendFinalInterviewPassedEmail($studentInfo)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'Tzu Chi Scholarship Final Interview Result';
        $htmlContent = "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
            <p style=\"margin-bottom: 16px;\">
                Congratulations! We are delighted to inform you that you have passed the final interview for the Tzu Chi Foundation Scholarship Program. Your perseverance and values truly reflect what it means to be part of the Tzu Chi family. We look forward to officially welcoming you as one of our new scholars. Further details about the orientation and your responsibilities as a scholar will be shared soon. Once again, congratulations and welcome!
            </p>
            <p style=\"padding-bottom: 32px;\">We look forward to supporting your academic journey.</p> 
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendFinalInterviewFailedEmail($studentInfo)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'Tzu Chi Scholarship Final Interview Result';
        $htmlContent = "
        <div style=\"font-family: Arial, sans-serif; font-size: 16px; color: #333;\">
            <p style=\"margin-bottom: 16px;\">Dear <strong>{$fullName}</strong>,</p>
            <p style=\"margin-bottom: 16px;\">
                Thank you for reaching the final interview stage of the Tzu Chi Foundation Scholarship Program. We recognize the time and effort you’ve dedicated throughout this process. After careful deliberation, we regret to inform you that you were not selected as a scholar. This decision does not define your worth, and we hope you continue to pursue your education and goals with determination. We sincerely wish you a bright and successful future.
            </p>
            <p style=\"padding-bottom: 32px;\">We look forward to supporting your academic journey.</p> 
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
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
        $resetLink = 'http://localhost:5173/reset-password?token=' . $token;

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
            " has been created and you are invited to join!. Check it out and don’t miss the chance to be part of this event!
            </p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;\">{$this->organizationName}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">{$this->organizationAddress}</p>
            <p style=\"line-height: 1.5; font-size: 12px; margin: 0;\">Contact: {$this->contactInfo}</p>
        </div>";

        return $this->sendEmail($studentInfo['email'], $subject, $htmlContent);
    }

    public function sendActivityRecordedEmail($studentInfo, $data)
    {
        $fullName = $studentInfo['first_name'] . ' ' . $studentInfo['last_name'];
        $subject = 'Tzu Chi Scholarship Final Interview Result';
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
        $subject = 'Tzu Chi Scholarship Final Interview Result';
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
