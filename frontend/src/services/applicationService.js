import axios from "axios";
import { toast } from "react-toastify";
import {
    sendApplicationApprovalEmail,
    sendApplicationRejectionEmail,
} from "./emailService";
import { useState } from "react";

// export const rejectApplicantApplication = () => {
//     const [rejectLoading, setRejectLoading] = useState(false);
//     const [rejectError, setRejectError] = useState(null);

//     const rejectApplication = async (
//         applicationId,
//         applicantData,
//         onSuccess
//     ) => {
//         const confirmationId = window.prompt(
//             "Enter applicant's application ID:"
//         );

//         if (+confirmationId === +applicationId) {
//             try {
//                 setRejectLoading(true);

//                 await axios.post(
//                     "http://localhost:8000/app/views/update_application_status.php",
//                     {
//                         studentIds: [applicationId],
//                         status: "Rejected",
//                     }
//                 );

//                 const applicantToEmail = applicantData.find(
//                     (applicant) => applicant.application_id === applicationId
//                 );

//                 if (applicantToEmail) {
//                     const emailSent = await sendApplicationRejectionEmail(
//                         applicantToEmail
//                     );
//                     toast[emailSent ? "success" : "warning"](
//                         emailSent
//                             ? "Applicant rejected and notification email sent successfully!"
//                             : "Applicant rejected but failed to send email notification."
//                     );
//                 } else {
//                     toast.warning(
//                         "Applicant rejected but could not find email information."
//                     );
//                 }

//                 await onSuccess();
//             } catch (err) {
//                 console.error("Error updating application status:", err);
//                 setRejectError("Failed to reject application.");
//                 toast.error("Error rejecting application.");
//             } finally {
//                 setRejectLoading(false);
//             }
//         } else {
//             toast.error("Incorrect application ID. Please try again.");
//         }
//     };

//     return { rejectLoading, rejectError, rejectApplication };
// };

// export const approveApplicantApplication = () => {
//     const [approveLoading, setApproveLoading] = useState(false);
//     const [approveError, setApproveError] = useState(null);

//     const approveApplication = async (
//         applicationId,
//         applicantData,
//         onSuccess
//     ) => {
//         const confirmationId = window.prompt(
//             "Enter applicant's application ID:"
//         );

//         if (+confirmationId === +applicationId) {
//             try {
//                 setApproveLoading(true);

//                 await axios.post(
//                     "http://localhost:8000/app/views/update_application_status.php",
//                     {
//                         studentIds: [applicationId],
//                         status: "Approved",
//                         application_approved: 1,
//                     }
//                 );

//                 const applicantToEmail = applicantData.find(
//                     (applicant) => applicant.application_id === applicationId
//                 );

//                 if (applicantToEmail) {
//                     const emailSent = await sendApplicationApprovalEmail(
//                         applicantToEmail
//                     );
//                     toast[emailSent ? "success" : "warning"](
//                         emailSent
//                             ? "Applicant approved and notification email sent successfully!"
//                             : "Applicant approved but failed to send email notification."
//                     );
//                 } else {
//                     toast.warning(
//                         "Applicant approved but could not find email information."
//                     );
//                 }

//                 await onSuccess();
//             } catch (err) {
//                 console.error("Error updating application status:", err);
//                 setApproveError("Failed to approve application.");
//                 toast.error("Error approving application.");
//             } finally {
//                 setApproveLoading(false);
//             }
//         } else {
//             toast.error("Incorrect application ID. Please try again.");
//         }
//     };

//     return { approveLoading, approveError, approveApplication };
// };

export const manageApplication = () => {

    const approveApplication = async (
        applicationId,
        applicantData,
        onSuccess
    ) => {
        const confirmationId = window.prompt(
            "Enter applicant's application ID:"
        );

        if (+confirmationId === +applicationId) {
            try {
                await axios.post(
                    "http://localhost:8000/app/views/update_application_status.php",
                    {
                        studentIds: [applicationId],
                        status: "Approved",
                        application_approved: 1,
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

                await onSuccess();
            } catch (err) {
                console.error("Error updating application status:", err);
                toast.error("Error approving application.");
            } 
        } else {
            toast.error("Incorrect application ID. Please try again.");
        }
    };

    const rejectApplication = async (
        applicationId,
        applicantData,
        onSuccess
    ) => {
        const confirmationId = window.prompt(
            "Enter applicant's application ID:"
        );

        if (+confirmationId === +applicationId) {
            try {
                await axios.post(
                    "http://localhost:8000/app/views/update_application_status.php",
                    {
                        studentIds: [applicationId],
                        status: "Rejected",
                        application_approved: 0
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

                await onSuccess();
            } catch (err) {
                console.error("Error updating application status:", err);
                toast.error("Error rejecting application.");
            } 
        } else {
            toast.error("Incorrect application ID. Please try again.");
        }
    };

    return { approveApplication, rejectApplication };
};
