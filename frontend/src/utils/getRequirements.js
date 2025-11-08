// import axios from "axios";
// import BASE_URL from "../config";

import axios from "axios";
import BASE_URL from "../config";

// export const getRequirements = async (applicationId) => {
//     try {
//         console.log(
//             "Getting requirements files for application ID:",
//             applicationId
//         );

//         // Use the requirements endpoint
//         const response = await axios.get(
//             `${BASE_URL}backend/api/applications/${applicationId}/requirements`
//         );

//         console.log("Requirements endpoint response:", response.data);

//         // Check if the response is successful and contains requirements files
//         if (
//             response.data &&
//             response.data.success &&
//             response.data.requirements_files
//         ) {
//             const requirementsFiles = response.data.requirements_files;

//             console.log(`Found ${requirementsFiles.length} requirements files`);

//             // Return the full requirements data with additional metadata
//             return {
//                 success: true,
//                 files: requirementsFiles,
//                 totalFiles:
//                     response.data.total_files || requirementsFiles.length,
//                 message:
//                     response.data.message ||
//                     "Requirements files retrieved successfully",
//             };
//         } else if (response.data && !response.data.success) {
//             // Handle API error responses
//             console.warn("API returned error:", response.data.message);
//             return {
//                 success: false,
//                 files: [],
//                 totalFiles: 0,
//                 message:
//                     response.data.message ||
//                     "Failed to retrieve requirements files",
//             };
//         } else {
//             console.warn("Unexpected response format:", response.data);
//             return {
//                 success: false,
//                 files: [],
//                 totalFiles: 0,
//                 message: "Unexpected response format from server",
//             };
//         }
//     } catch (error) {
//         console.error("Error getting requirements files:", error);

//         // Log more details for debugging
//         if (error.response) {
//             console.error("Response data:", error.response.data);
//             console.error("Response status:", error.response.status);
//             console.error("Response headers:", error.response.headers);

//             // Handle specific HTTP error codes
//             let errorMessage = "Failed to retrieve requirements files";
//             if (error.response.status === 404) {
//                 errorMessage = "Requirements files not found";
//             } else if (error.response.status === 500) {
//                 errorMessage = "Server error occurred while retrieving files";
//             } else if (error.response.data && error.response.data.message) {
//                 errorMessage = error.response.data.message;
//             }

//             return {
//                 success: false,
//                 files: [],
//                 totalFiles: 0,
//                 message: errorMessage,
//                 error: {
//                     status: error.response.status,
//                     data: error.response.data,
//                 },
//             };
//         } else if (error.request) {
//             console.error("No response received:", error.request);
//             return {
//                 success: false,
//                 files: [],
//                 totalFiles: 0,
//                 message: "Network error: No response from server",
//             };
//         } else {
//             console.error("Request setup error:", error.message);
//             return {
//                 success: false,
//                 files: [],
//                 totalFiles: 0,
//                 message: "Request configuration error",
//             };
//         }
//     }
// };

export const getRequirements = async (applicationId) => {
    try {
        console.log("Getting requirements for application ID:", applicationId);

        // Use your requirements endpoint
        const response = await axios.get(
            `${BASE_URL}backend/api/applications/${applicationId}/requirements`
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
