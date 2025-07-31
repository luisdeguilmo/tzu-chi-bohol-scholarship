import { useState } from "react";
import { generatePDF } from "../utils/generatePdf";

export const usePdfActions = (fetchApplicantData) => {
    const [applicationId, setApplicationId] = useState(null);

    const viewPdf = async (id) => {
        try {
            // Set the application ID first
            setApplicationId(id);

            // Fetch applicant data and wait for it to complete
            const data = await fetchApplicantData(id);

            // Use the returned data directly instead of relying on state
            if (data) {
                await generatePDF("view", id, data);
            } else {
                console.error("No applicant data received");
                alert("Unable to generate PDF: No applicant data found");
            }
        } catch (error) {
            console.error("Error in handleViewPdf:", error);
            alert("Error generating PDF. Please try again.");
        }
    };

    const downloadPdf = async (id) => {
        try {
            // Set the application ID first
            setApplicationId(id);

            // Fetch applicant data and wait for it to complete
            const data = await fetchApplicantData(id);

            // Use the returned data directly instead of relying on state
            if (data) {
                await generatePDF("download", id, data);
            } else {
                console.error("No applicant data received");
                alert("Unable to generate PDF: No applicant data found");
            }
        } catch (error) {
            console.error("Error in handleViewPdf:", error);
            alert("Error generating PDF. Please try again.");
        }
    };

    return { applicationId, viewPdf, downloadPdf };
};
