import axios from "axios";
import { toast } from "react-toastify";
import { sendExaminationScheduleEmail } from "./emailService";
import { useEffect } from "react";

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
        toast.warning("Applicant not found.");
    }
};

export const proceedToInterview = async (ids) => {
    // const confirmationId = window.prompt("Enter applicant's application ID:");

    console.log(ids);
    
    try {
        // setLoading(true);
        const response = await axios.post(
            "http://localhost:8000/app/views/initial-interview.php",
            {
                applicantIds: ids,
                application_status: "Initial Interview",
                initial_interview: 1
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.data.success) {
            // Refresh the data after assignment
            // await fetchStudentsData();

            // Clear selections
            // setSelectedApplicants([]);

            // Show success notification
            toast.success(response.data.message + ".");
        } else {
            alert("Error: " + response.data.message);
        }

        // setLoading(false);
    } catch (err) {
        console.error("Error assigning batch:", err);
        // setLoading(false);
    }
};

// export const approveApplicantApplication = async (
//     applicationId,
//     applicantData,
//     setLoading,
//     setError,
//     fetchApplicantsData
// ) => {
//     const confirmationId = window.prompt("Enter applicant's application ID:");
//     console.log(confirmationId, applicationId);
//     if (+confirmationId === +applicationId) {
//         try {
//             setLoading(true);

//             await axios.post(
//                 "http://localhost:8000/app/views/update_application_status.php",
//                 {
//                     studentIds: [applicationId],
//                     status: "Approved",
//                 }
//             );

//             const applicantToEmail = applicantData.find(
//                 (applicant) => applicant.application_id === applicationId
//             );

//             if (applicantToEmail) {
//                 const emailSent = await sendApplicationApprovalEmail(
//                     applicantToEmail
//                 );
//                 toast[emailSent ? "success" : "warning"](
//                     emailSent
//                         ? "Applicant approved and notification email sent successfully!"
//                         : "Applicant approved but failed to send email notification."
//                 );
//             } else {
//                 toast.warning(
//                     "Applicant approved but could not find email information."
//                 );
//             }

//             await fetchApplicantsData();
//         } catch (err) {
//             console.error("Error updating application status:", err);
//             setError("Failed to approve application.");
//             toast.error("Error approving application.");
//         } finally {
//             setLoading(false);
//         }
//     } else {
//         toast.error("Incorrect application ID. Please try again.");
//     }
// };
