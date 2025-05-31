import axios from "axios";
import { toast } from "react-toastify";
import { sendExaminationScheduleEmail } from "./emailService";

export const sendExaminationSchedule = async (
    applicationId,
    applicationInfo,
    personalInfo,
    dateAndTime,
    setLoading,
    setError
) => {
    if (applicationInfo) {
        const emailSent = await sendExaminationScheduleEmail(
            applicationInfo,
            personalInfo,
            dateAndTime
        );
        toast[emailSent ? "success" : "warning"](
            emailSent
                ? "Email sent successfully!"
                : "Failed to send email notification."
        );
    } else {
        toast.warning(
            "Applicant not found."
        );
    }
};
