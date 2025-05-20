import axios from "axios";
import { toast } from "react-toastify";
import {
    sendApplicationApprovalEmail,
    sendApplicationRejectionEmail,
} from "./emailService";

export const rejectStudentApplication = async (
    studentId,
    studentData,
    setLoading,
    setError,
    fetchStudentsData
) => {
    const confirmationId = window.prompt("Enter applicant's application ID:");

    if (+confirmationId === +studentId) {
        try {
            setLoading(true);

            await axios.post(
                "http://localhost:8000/app/views/update_application_status.php",
                {
                    studentIds: [studentId],
                    status: "Rejected",
                }
            );

            const studentToEmail = studentData.find(
                (student) => student.application_id === studentId
            );

            if (studentToEmail) {
                const emailSent = await sendApplicationRejectionEmail(
                    studentToEmail
                );
                toast[emailSent ? "success" : "warning"](
                    emailSent
                        ? "Applicant rejected and notification email sent successfully!"
                        : "Applicant rejected but failed to send email notification."
                );
            } else {
                toast.warning(
                    "Applicant rejected but could not find email information."
                );
            }

            await fetchStudentsData();
        } catch (err) {
            console.error("Error updating application status:", err);
            setError("Failed to reject application.");
            toast.error("Error rejecting application.");
        } finally {
            setLoading(false);
        }
    } else {
        toast.error("Incorrect application ID. Please try again.");
    }
};

export const approveStudentApplication = async (
    studentId,
    studentData,
    setLoading,
    setError,
    fetchStudentsData
) => {
    const confirmationId = window.prompt("Enter applicant's application ID:");
    console.log(confirmationId, studentId);
    if (+confirmationId === +studentId) {
        try {
            setLoading(true);

            await axios.post(
                "http://localhost:8000/app/views/update_application_status.php",
                {
                    studentIds: [studentId],
                    status: "Approved",
                }
            );

            const studentToEmail = studentData.find(
                (student) => student.application_id === studentId
            );

            if (studentToEmail) {
                const emailSent = await sendApplicationApprovalEmail(
                    studentToEmail
                );
                toast[emailSent ? "success" : "warning"](
                    emailSent
                        ? "Applicant approved and notification email sent successfully!"
                        : "Applicant approved but failed to send email notification."
                );
            } else {
                toast.warning(
                    "Applicant approved but could not find email information."
                );
            }

            await fetchStudentsData();
        } catch (err) {
            console.error("Error updating application status:", err);
            setError("Failed to approve application.");
            toast.error("Error approving application.");
        } finally {
            setLoading(false);
        }
    } else {
        toast.error("Incorrect application ID. Please try again.");
    }
};
