import { useState } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../config";

export const useSchedule = () => {
    const [loading, setLoading] = useState(false);

    const createSchedule = async (
        purpose,
        date,
        time,
        venue,
        batchToSet,
        onSuccess,
        setIsOpen,
        batchId,
        applicants,
        selectedBatch
    ) => {
        const data = {
            purpose: purpose,
            schedule: date + " " + time,
            venue: venue,
            batch_id: batchId,
            applicants: applicants,
            date: date,
            time: time,
            batch: selectedBatch,
        };

        console.log(data);

        try {
            setLoading(true);
            const response = await fetch(
                `${BASE_URL}app/api/schedule.php?id=${batchToSet.batch_name}`,
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
                setLoading(false);
                return true;
            } else {
                alert("Error: " + result.message);
                setLoading(false);
            }

            return false;
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
            setLoading(false);

            return false;
        }
    };

    return { loading, createSchedule };
};
