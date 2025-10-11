import { useState } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../config";

export const useSchedule = () => {
    // const [schedule, setSchedule] = useState("");

    const createSchedule = async (
        purpose,
        date,
        time,
        venue,
        batchToSet,
        onSuccess,
        setIsOpen
    ) => {
        const data = {
            purpose: purpose,
            schedule: date + " " + time,
            venue: venue,
        };

        try {
            const response = await fetch(
                `${BASE_URL}app/views/schedule.php?id=${batchToSet.batch_name}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", // Important for JSON body
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json(); // Parse as JSON instead of text

            if (result.success) {
                toast.success(result.message + ".");
                setIsOpen(false);
                onSuccess();
                return true;
            } else {
                alert("Error: " + result.message);
            }

            return false;
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");

            return false;
        }
    };

    return { createSchedule };
};
