import { getSchedule } from "../utils/getSchedule";
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const ORGANIZATION_NAME = "Tzu Chi Foundation Philippines - Bohol Office";
const CONTACT_INFO = "tzuchibohol2014@gmail.com | 0998 885 5342";
const ORGANIZATION_ADDRESS =
    "3rd Floor of FCB Building, CPG North Avenue, Cogon District, Tagbilaran City, Philippines";
const EMAIL = "tzuchibohol2014@gmail.com";

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const requestBody = {
            sender: {
                name: ORGANIZATION_NAME,
                email: "de0@gmail.com",
            },
            to: [{ email: to }],
            subject,
            htmlContent,
        };

        const response = await fetch(BREVO_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": BREVO_API_KEY,
            },
            body: JSON.stringify(requestBody),
        });

        const responseText = await response.text();
        console.log("Response body:", responseText);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} - ${responseText}`);
        }

        console.log("Email successfully sent!");
        return true;
    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
};

export const sendApplicationApprovalEmail = async (studentInfo) => {
    const fullName = `${studentInfo.first_name} ${studentInfo.last_name}`;
    const subject = "Scholarship Application Approved";
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <p style="margin-bottom: 16px;">Dear <strong>${fullName}</strong>,</p>
        <p style="margin-bottom: 16px;">
            Congratulations! We are pleased to inform you that your application for the
            <strong>Tzu Chi Scholarship Program</strong> for Academic Year 
            <strong>${studentInfo.school_year}</strong> has been 
            <span style="font-weight: bold;">approved</span>.
        </p>
        <p style="padding-bottom: 32px;">We look forward to supporting your academic journey.</p> 
        <p style="line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;">${ORGANIZATION_NAME}</p>
        <p style="line-height: 1.5; font-size: 12px; margin: 0;">${ORGANIZATION_ADDRESS}</p>
        <p style="line-height: 1.5; font-size: 12px; margin: 0;">Contact: ${CONTACT_INFO}</p>
    </div>
`;

    return sendEmail(studentInfo.email, subject, htmlContent);
};

export const sendApplicationRejectionEmail = async (studentInfo) => {
    const fullName = `${studentInfo.first_name} ${
        studentInfo.middle_name ? studentInfo.middle_name + " " : ""
    }${studentInfo.last_name}`;
    const subject = "Scholarship Application Update";
    const htmlContent = `
        <p>Dear ${fullName},</p>
        <p>We regret to inform you that your scholarship application for SY ${studentInfo.school_year} was not approved.</p>
        <p style="line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;">${ORGANIZATION_NAME}</p>
        <p style="line-height: 1.5; font-size: 12px; margin: 0;">${ORGANIZATION_ADDRESS}</p>
        <p style="line-height: 1.5; font-size: 12px; margin: 0;">Contact: ${CONTACT_INFO}</p>
    `;
    return sendEmail(studentInfo.email, subject, htmlContent);
};

export const sendExaminationPassedEmail = async (studentInfo) => {
    const fullName = `${studentInfo.first_name} ${studentInfo.last_name}`;
    const subject = "Scholarship Application Approved";
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <p style="margin-bottom: 16px;">Dear <strong>${fullName}</strong>,</p>
        <p style="margin-bottom: 16px;">
            Congratulations! We are pleased to inform you that your application for the
            <strong>Tzu Chi Scholarship Program</strong> for Academic Year 
            <strong>${studentInfo.school_year}</strong> has been 
            <span style="font-weight: bold;">approved</span>.
        </p>
        <p style="padding-bottom: 32px;">We look forward to supporting your academic journey.</p> 
        <p style="line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;">${ORGANIZATION_NAME}</p>
        <p style="line-height: 1.5; font-size: 12px; margin: 0;">${ORGANIZATION_ADDRESS}</p>
        <p style="line-height: 1.5; font-size: 12px; margin: 0;">Contact: ${CONTACT_INFO}</p>
    </div>
`;

    return sendEmail(studentInfo.email, subject, htmlContent);
};

export const sendExaminationFailedEmail = async (studentInfo) => {
    const fullName = `${studentInfo.first_name} ${
        studentInfo.middle_name ? studentInfo.middle_name + " " : ""
    }${studentInfo.last_name}`;
    const subject = "Scholarship Application Update";
    const htmlContent = `
        <p>Dear ${fullName},</p>
        <p>We regret to inform you that your scholarship application for SY ${studentInfo.school_year} was not approved.</p>
        <p style="line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;">${ORGANIZATION_NAME}</p>
        <p style="line-height: 1.5; font-size: 12px; margin: 0;">${ORGANIZATION_ADDRESS}</p>
        <p style="line-height: 1.5; font-size: 12px; margin: 0;">Contact: ${CONTACT_INFO}</p>
    `;
    return sendEmail(studentInfo.email, subject, htmlContent);
};

export const sendExaminationScheduleEmail = async (
    applicant,
    batches,
    selectedBatchInBatches
) => {
    try {
        const result = getSchedule(batches, selectedBatchInBatches);

        const { date, time } = result;

        const fullName = `${applicant.first_name} ${applicant.last_name}`;
        const subject = "Scholarship Examination Schedule";
        const htmlContent = `
            <p>Dear ${fullName},</p>
            <p style="margin-bottom: 16px;">
                We are pleased to inform you that you are scheduled to take the entrance examination for the
                <strong>Tzu Chi Scholarship Program</strong> for Academic Year 
                <strong>${applicant.school_year}</strong>.
            </p>
            <p style="margin-bottom: 16px;">
                📅 <strong>Date:</strong> ${date}<br>
                🕒 <strong>Time:</strong> ${time}<br>
                📍 <strong>Venue:</strong> Room 1
            </p>
            <p style="margin-bottom: 16px;">
                Please arrive 15 minutes early and bring your valid ID and necessary documents. If you have any questions, feel free to contact us.
            </p>

            <p style="line-height: 1.5; font-size: 12px; margin: 0; font-weight: bold;">${ORGANIZATION_NAME}</p>
            <p style="line-height: 1.5; font-size: 12px; margin: 0;">${ORGANIZATION_ADDRESS}</p>
            <p style="line-height: 1.5; font-size: 12px; margin: 0;">Contact: ${CONTACT_INFO}</p>
        `;
        return sendEmail(applicant.email, subject, htmlContent);
    } catch (error) {
        console.error("Error in sendExaminationScheduleEmail:", error);
        return false;
    }
};
