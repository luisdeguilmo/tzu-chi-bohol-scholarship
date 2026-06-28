import { useState } from "react";
import { generatePDF } from "../utils/generatePdf";

export const usePdfActions = (type, fetchApplicantData) => {
    const [applicationId, setApplicationId] = useState(null);

    const viewPdf = async ({ applicationId, scholarId }) => {
    // Must happen synchronously, before any await, or the browser blocks it
    const pdfWindow = window.open("", "_blank");

    try {
        const data = await fetchApplicantData(applicationId);

        if (data) {
            await generatePDF(type, "view", applicationId, scholarId, data, pdfWindow);
        } else {
            console.error("No applicant data received");
            alert("Unable to generate PDF: No applicant data found");
            if (pdfWindow) pdfWindow.close();
        }
    } catch (error) {
        console.error("Error in handleViewPdf:", error);
        alert("Error generating PDF. Please try again.");
        if (pdfWindow) pdfWindow.close();
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
