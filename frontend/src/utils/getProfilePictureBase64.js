import axios from "axios";

export const getProfilePictureBase64 = async (applicationId) => {
    try {
        console.log(
            "Getting profile picture for application ID:",
            applicationId
        );

        // Use your existing profile picture endpoint
        const response = await axios.get(
            `http://localhost:8000/backend/api/applications/${applicationId}/2x2-picture`
        );

        console.log("Profile picture endpoint response:", response.data);

        // Assuming your endpoint returns the base64 data
        // Adjust this based on your actual response structure
        if (response.data && response.data.profile_picture_base64) {
            return response.data.profile_picture_base64;
        } else if (response.data && response.data.base64) {
            return response.data.base64;
        } else {
            console.warn("Unexpected response format:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Error getting profile picture:", error);

        // Log more details for debugging
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }

        return null;
    }
};
