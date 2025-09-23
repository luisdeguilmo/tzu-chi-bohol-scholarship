import { useState } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../config";

export const useSchedule = () => {
    // const [schedule, setSchedule] = useState("");

    const createSchedule = async (
        date,
        time,
        venue,
        setDate,
        setTime,
        batchToSet,
        onSuccess,
        setIsOpen
    ) => {
        const data = {
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
                setDate("");
                setTime("");
                setIsOpen(false);
            } else {
                alert("Error: " + result.message);
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
        }
    };

    return { createSchedule };
};
