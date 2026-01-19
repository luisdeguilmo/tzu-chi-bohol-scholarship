import axios from "axios";
import BASE_URL from "../config";

export const getInitialInterviewFiles = async (applicationId) => {
    try {
        // Use your requirements endpoint
        const response = await axios.get(
            `${BASE_URL}backend/api/applications/${applicationId}/initial_interview_files`
        );

        // Check if the response has requirements array
        if (response.data && response.data.initial_interview_files) {
            return response.data.initial_interview_files;
        } else if (
            response.data &&
            response.data.initial_interview_files_base64
        ) {
            return response.data.initial_interview_files_base64;
        } else if (response.data && response.data.base64) {
            return response.data.base64;
        } else {
            console.warn(
                "Unexpected response format:",
                response.data.initial_interview_files
            );
            return null;
        }
    } catch (error) {
        console.error("Error getting files:", error);

        // Log more details for debugging
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }

        return null;
    }
};
