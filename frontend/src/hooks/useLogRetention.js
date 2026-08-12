import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../config";

export const useLogRetention = () => {
    const [logRetention, setLogRetention] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchLogRetention = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}app/api/log-retention.php`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const json = await response.json();

            if (response.ok) {
                setLogRetention(json.logRetention || 0);
            }
        } catch (err) {
            console.error("Submission error:", err);
            alert("Failed to submit the form. Please try again.");
        }
    };

    const updateLogRetention = async (logRetention) => {
        const data = {
            log_retention: logRetention,
        };

        try {
            setLoading(true);
            const response = await fetch(
                `${BASE_URL}app/api/log-retention.php`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json", // Important for JSON body
                    },
                    body: JSON.stringify(data),
                },
            );

            const result = await response.json(); // Parse as JSON instead of text

            if (result.success) {
                toast.success(result.message + ".");

                return true;
            } else {
                alert("Error: " + result.message);
            }
            // if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogRetention();
    }, []);

    return { loading, logRetention, updateLogRetention };
};
