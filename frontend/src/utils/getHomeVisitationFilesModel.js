import axios from "axios";
import BASE_URL from "../config";

export const getHomeVisitationFiles = async (applicationId) => {
    try {
        console.log("Getting home visitation files for application ID:", applicationId);

        const response = await axios.get(
            `${BASE_URL}backend/api/applications/${applicationId}/home_visitation_files`
        );

        console.log("Home visitation files endpoint response:", response.data);

        if (response.data && response.data.home_visitation_files) {
            return response.data.home_visitation_files;
        } else if (response.data && response.data.home_visitation_files_base64) {
            return response.data.home_visitation_files_base64;
        } else if (response.data && response.data.base64) {
            return response.data.base64;
        } else {
            console.warn(
                "Unexpected response format:",
                response.data
            );
            return null;
        }
    } catch (error) {
        console.error("Error getting home visitation files:", error);

        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }

        return null;
    }
};
