import { useState } from "react";
import { toast } from "react-toastify";

export const useSchedule = () => {
    // const [schedule, setSchedule] = useState("");

    const createSchedule = async (
        date,
        time,
        setDate,
        setTime,
        batchToSet,
        onSuccess,
        setIsOpen
    ) => {
        const data = {
            schedule: date + ' ' + time,
        };

        try {
            const response = await fetch(
                `http://localhost:8000/app/views/schedule.php?id=${batchToSet.batch_name}`,
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
