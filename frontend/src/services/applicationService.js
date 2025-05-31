import axios from "axios";
import { toast } from "react-toastify";
import {
    sendApplicationApprovalEmail,
    sendApplicationRejectionEmail,
} from "./emailService";

export const rejectApplicantApplication = async (
    applicationId,
    applicantData,
    setLoading,
    setError,
    fetchApplicantsData
) => {
    const confirmationId = window.prompt("Enter applicant's application ID:");

    if (+confirmationId === +applicationId) {
        try {
            setLoading(true);

            await axios.post(
                "http://localhost:8000/app/views/update_application_status.php",
                {
                    studentIds: [applicationId],
                    status: "Rejected",
                }
            );

            const applicantToEmail = applicantData.find(
                (applicant) => applicant.application_id === applicationId
            );

            if (applicantToEmail) {
                const emailSent = await sendApplicationRejectionEmail(
                    applicantToEmail
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

            await fetchApplicantsData();
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

export const approveApplicantApplication = async (
    applicationId,
    applicantData,
    setLoading,
    setError,
    fetchApplicantsData
) => {
    const confirmationId = window.prompt("Enter applicant's application ID:");
    console.log(confirmationId, applicationId);
    if (+confirmationId === +applicationId) {
        try {
            setLoading(true);

            await axios.post(
                "http://localhost:8000/app/views/update_application_status.php",
                {
                    studentIds: [applicationId],
                    status: "Approved",
                }
            );

            const applicantToEmail = applicantData.find(
                (applicant) => applicant.application_id === applicationId
            );

            if (applicantToEmail) {
                const emailSent = await sendApplicationApprovalEmail(
                    applicantToEmail
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

            await fetchApplicantsData();
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
