import { useState } from "react";
import { generatePDF } from "../utils/generatePdf";

export const usePdfActions = (type, fetchApplicantData) => {
    const [applicationId, setApplicationId] = useState(null);

    const viewPdf = async ({ applicationId, scholarId }) => {
        try {
            // Set the application ID first

            // Fetch applicant data and wait for it to complete
            const data = await fetchApplicantData(applicationId);

            // Use the returned data directly instead of relying on state
            if (data) {
                await generatePDF(type, "view", applicationId, scholarId, data);
            } else {
                console.error("No applicant data received");
                alert("Unable to generate PDF: No applicant data found");
            }
        } catch (error) {
            console.error("Error in handleViewPdf:", error);
            alert("Error generating PDF. Please try again.");
        }
    };

    const downloadPdf = async ({ applicationId, scholarId }) => {
        try {
            // Set the application ID first

            // Fetch applicant data and wait for it to complete
            const data = await fetchApplicantData(applicationId);

            // Use the returned data directly instead of relying on state
            if (data) {
                await generatePDF(
                    type,
                    "download",
                    applicationId,
                    scholarId,
                    data
                );
            } else {
                console.error("No applicant data received");
                alert("Unable to generate PDF: No applicant data found");
            }
        } catch (error) {
            console.error("Error in handleViewPdf:", error);
            alert("Error generating PDF. Please try again.");
        }
    };

    return { viewPdf, downloadPdf };
};
