import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_97rzw6o";
const EMAILJS_TEMPLATE_ID = "template_zgcb5c1";
const EMAILJS_REJECT_TEMPLATE_ID = "template_5f51nna";
const EMAILJS_PUBLIC_KEY = "jes1Va_kLko0tAZh5";

export const sendApplicationApprovalEmail = async (studentInfo) => {
    try {
        const templateParams = {
            to_name: `${studentInfo.first_name} ${studentInfo.last_name}`,
            to_email: studentInfo.email,
            school_year: studentInfo.school_year,
            applicant_name: `${studentInfo.first_name} ${
                studentInfo.middle_name ? studentInfo.middle_name + " " : ""
            }${studentInfo.last_name}`,
            organization: "Tzu Chi Foundation Philippines - Bohol Office",
            contact_info: "tzuchibohol2014@gmail.com | 0998 885 5342",
        };

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        console.log("Email successfully sent!", response);
        return true;
    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
};

export const sendApplicationRejectionEmail = async (studentInfo) => {
    try {
        const templateParams = {
            to_name: `${studentInfo.first_name} ${studentInfo.last_name}`,
            to_email: studentInfo.email,
            school_year: studentInfo.school_year,
            applicant_name: `${studentInfo.first_name} ${
                studentInfo.middle_name ? studentInfo.middle_name + " " : ""
            }${studentInfo.last_name}`,
            organization: "Tzu Chi Foundation Philippines - Bohol Office",
            contact_info: "tzuchibohol2014@gmail.com | 0998 885 5342",
        };

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_REJECT_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        console.log("Email successfully sent!", response);
        return true;
    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
};