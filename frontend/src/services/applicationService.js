import axios from "axios";
import { toast } from "react-toastify";
import {
    sendApplicationApprovalEmail,
    sendApplicationRejectionEmail,
} from "./emailService";
import BASE_URL from "../config";

export const manageApplication = () => {
    const approveApplication = async (applicant) => {
        console.log(applicant);
        try {
            // const applicantToEmail = applicant.find(
            //     (applicant) => applicant.application_id === applicationId
            // );

            // if (!applicant) {
            //     toast.error(
            //         "Cannot approve application: Email information not found."
            //     );
            //     return;
            // }

            // // Send email FIRST, before updating status
            // const emailSent = await sendApplicationApprovalEmail(applicant);

            // if (!emailSent) {
            //     toast.error(
            //         "Cannot approve application: Failed to send notification email."
            //     );
            //     return;
            // }

            // Only update status if email was sent successfully
            const response = await axios.put(
                `${BASE_URL}app/views/application-management.php?action=approve`,
                {
                    application_id: applicant.application_id,
                    first_name: applicant.first_name,
                    last_name: applicant.last_name,
                    email: applicant.email,
                    school_year: applicant.school_year,
                    is_application_approved: 1,
                }
            );

            if (response.data.success) {
                toast.success(
                    "Application approved and notification email sent successfully!"
                );
                return true;
            }

            return false;
        } catch (err) {
            console.error("Error approving application:", err);
            toast.error("Error approving application.");
            return false;
        }
    };

    const rejectApplication = async (
        applicationId,
        applicantData,
        onSuccess
    ) => {
        try {
            const applicantToEmail = applicantData.find(
                (applicant) => applicant.application_id === applicationId
            );

            if (!applicantToEmail) {
                toast.error(
                    "Cannot reject application: Email information not found."
                );
                return;
            }

            // Send email FIRST, before updating status
            const emailSent = await sendApplicationRejectionEmail(
                applicantToEmail
            );

            if (!emailSent) {
                toast.error(
                    "Cannot reject application: Failed to send notification email."
                );
                return;
            }

            // Only update status if email was sent successfully
            await axios.put(
                `${BASE_URL}app/views/application-management.php?action=reject`,
                {
                    application_id: applicationId,
                    is_application_rejected: 1,
                }
            );

            toast.success(
                "Application rejected and notification email sent successfully!"
            );
            await onSuccess();
        } catch (err) {
            console.error("Error rejecting application:", err);
            toast.error("Error rejecting application.");
        }
    };

    return { approveApplication, rejectApplication };
};
