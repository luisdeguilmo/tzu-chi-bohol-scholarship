import { useState } from "react";
import axios from "axios";
import BASE_URL from "../config";

export const useDownloadExcel = () => {
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState(null);

    const downloadExcel = async (id, fileName = null) => {
        setDownloading(true);
        setError(null);

        try {
            const response = await axios.get(
                `${BASE_URL}app/views/allowance-cycle-excel.php?id=${id}`,
                {
                    responseType: "blob", // Important: Get response as blob
                    headers: {
                        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    },
                }
            );

            // Create blob link to download
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);

            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            setDownloading(false);
            return true;
        } catch (err) {
            console.error("Error downloading Excel file:", err);

            // Handle error response
            let errorMessage = "Failed to download file";

            if (err.response) {
                // Try to parse error message from blob
                if (err.response.data instanceof Blob) {
                    try {
                        const text = await err.response.data.text();
                        const errorData = JSON.parse(text);
                        errorMessage = errorData.message || errorMessage;
                    } catch (parseError) {
                        // If parsing fails, use default message
                        errorMessage = `Error ${err.response.status}: ${err.response.statusText}`;
                    }
                } else {
                    errorMessage = err.response.data?.message || errorMessage;
                }
            } else if (err.request) {
                errorMessage = "No response from server";
            } else {
                errorMessage = err.message;
            }

            setError(errorMessage);
            setDownloading(false);
            return false;
        }
    };

    return { downloadExcel };
};
