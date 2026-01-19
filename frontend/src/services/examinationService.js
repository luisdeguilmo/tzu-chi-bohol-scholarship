import axios from "axios";
import { toast } from "react-toastify";
import { sendExaminationScheduleEmail } from "./emailService";
import BASE_URL from "../config";

export const sendExaminationSchedule = async (
    applicant,
    batches, 
    selectedBatchInBatches,
    setLoading,
    setError
) => {
    if (applicationInfo) {
        const emailSent = await sendExaminationScheduleEmail(
            applicant,
            batches, 
    selectedBatchInBatches,
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

    
    try {
        // setLoading(true);
        const response = await axios.post(
            `${BASE_URL}app/views/initial-interview.php`,
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
