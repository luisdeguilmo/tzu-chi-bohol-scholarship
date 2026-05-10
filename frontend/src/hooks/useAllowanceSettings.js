import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../config";

export const useAllowanceSettings = () => {
    const [allowanceSettings, setAllowanceSettings] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    const fetchMaximumHoursAndAmountPerHour = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${BASE_URL}app/api/allowance-settings.php`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const json = await response.json();

            if (response.ok) {
                setAllowanceSettings(json.data || {});
                setLoading(false);
            }

            setLoading(false);
        } catch (err) {
            console.error("Submission error:", err);
            alert("Failed to submit the form. Please try again.");
            setLoading(false);
        }
    };

    const setMaximumHoursAndAmountPerHour = async (
        maximumHours,
        amountPerHour,
    ) => {
        const data = {
            maximum_hours: maximumHours,
            amount_per_hour: amountPerHour,
        };

        try {
            setLoading(true);

            const response = await fetch(
                `${BASE_URL}app/api/allowance-settings.php`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json", // Important for JSON body
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                },
            );

            const result = await response.json(); // Parse as JSON instead of text

            if (result.success) {
                toast.success(result.message + ".");
                setLoading(false);
                return true;
            } else {
                alert("Error: " + result.message);
                setLoading(false);
                return false;
            }
            // if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
            setLoading(false);
            return false;
        }
    };

    useEffect(() => {
        fetchMaximumHoursAndAmountPerHour();
    }, []);

    return {
        loading,
        allowanceSettings,
        setMaximumHoursAndAmountPerHour,
        fetchMaximumHoursAndAmountPerHour,
    };
};
