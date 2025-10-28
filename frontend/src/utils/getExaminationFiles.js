// import axios from "axios";
// import BASE_URL from "../config";

import axios from "axios";
import BASE_URL from "../config";

export const getExaminationFiles = async (applicationId) => {
    try {
        console.log("Getting requirements for application ID:", applicationId);

        // Use your requirements endpoint
        const response = await axios.get(
            `http://localhost:8000/backend/api/applications/${applicationId}/examination_files`
        );

        console.log("Requirements endpoint response:", response.data[0]);

        // return response.data;

        // Check if the response has requirements array
        if (response.data && response.data.requirements) {
            console.log(response.data.requirements);
            return response.data.requirements;
        } else if (response.data && response.data.requirement_base64) {
            return response.data.requirement_base64;
        } else if (response.data && response.data.base64) {
            return response.data.base64;
        } else {
            console.warn(
                "Unexpected response format:",
                response.data.requirements
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
