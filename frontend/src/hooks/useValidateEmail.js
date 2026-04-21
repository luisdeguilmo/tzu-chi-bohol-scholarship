import { toast } from "react-toastify";
import BASE_URL from "../config";
import { useState } from "react";

export const useValidateEmail = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const validateEmail = async (email) => {
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch(
                `${BASE_URL}app/api/validate-email.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                throw new Error("Invalid JSON response from server");
            }

            if (!response.ok) {
                setError(data.message || "Validation failed");
                toast.error(
                    data.message ||
                        "Validation service error. Please try again."
                );
                setLoading(false);
                return false;
            }

            setResult(data);
            setLoading(false);

            // Check if email is actually deliverable
            if (!data.deliverable) {
                toast.error(
                    "This email address does not exist or cannot receive emails."
                );
                return false;
            }

            // Optional: Check for disposable emails
            if (data.is_disposable) {
                toast.error("Disposable email addresses are not allowed.");
                return false;
            }

            // Email is valid and deliverable
            // toast.success("Email validated successfully!");
            return true;
        } catch (err) {
            console.error("Email validation error:", err);
            setError(err.message || "Network error. Please try again.");
            toast.error(err.message || "Network error. Please try again.");
            setLoading(false);
            return false;
        }
    };

    return { loading, result, error, validateEmail };
};
