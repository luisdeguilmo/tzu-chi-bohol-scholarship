// import axios from "axios";
// import BASE_URL from "../config";

import axios from "axios";
import BASE_URL from "../config";

export const getExaminationFiles = async (applicationId) => {
    try {
        // Use your requirements endpoint
        const response = await axios.get(
            `${BASE_URL}backend/api/applications/${applicationId}/examination_files`
        );

        // return response.data;

        // Check if the response has requirements array
        if (response.data && response.data.examination_files) {
            return response.data.examination_files;
        } else if (response.data && response.data.examination_files_base64) {
            return response.data.examination_files_base64;
        } else if (response.data && response.data.base64) {
            return response.data.base64;
        } else {
            console.warn(
                "Unexpected response format:",
                response.data.examination_files
            );
            return null;
        }
    } catch (error) {
        console.error("Error getting requirements:", error);

        // Log more details for debugging
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }

        return null;
    }
};
