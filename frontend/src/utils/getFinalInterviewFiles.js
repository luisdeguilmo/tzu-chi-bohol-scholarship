import axios from "axios";
import BASE_URL from "../config";

export const getFinalInterviewFiles = async (applicationId) => {
    try {
        console.log("Getting final interview files for application ID:", applicationId);

        const response = await axios.get(
            `${BASE_URL}backend/api/applications/${applicationId}/final_interview_files`
        );

        console.log("Final interview files endpoint response:", response.data);

        if (response.data && response.data.final_interview_files) {
            return response.data.final_interview_files;
        } else if (response.data && response.data.final_interview_files_base64) {
            return response.data.final_interview_files_base64;
        } else if (response.data && response.data.base64) {
            return response.data.base64;
        } else {
            console.warn("Unexpected response format:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Error getting final interview files:", error);

        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }

        return null;
    }
};
