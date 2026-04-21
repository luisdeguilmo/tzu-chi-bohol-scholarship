import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../config";

export const useSettings = () => {
    const [passingScore, setPassingScore] = useState(0);

    const fetchPassingScore = async () => {
        try {
            const response = await fetch(`${BASE_URL}app/api/settings.php`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const json =  await response.json();

            if (response.ok) {
                setPassingScore(json.passingScore || 0);
            }
        } catch (err) {
            console.error("Submission error:", err);
            alert("Failed to submit the form. Please try again.");
        }
    };

    const createPassingScore = async (passingScore) => {
        const data = {
            passing_score: passingScore,
        };

        try {
            const response = await fetch(`${BASE_URL}app/api/settings.php`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json", // Important for JSON body
                },
                body: JSON.stringify(data),
            });

            const result = await response.json(); // Parse as JSON instead of text

            if (result.success) {
                toast.success(result.message + ".");
            } else {
                alert("Error: " + result.message);
            }
            // if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
        }
    };

    useEffect(() => {
        fetchPassingScore();
    }, []);

    return { passingScore, createPassingScore };
};
