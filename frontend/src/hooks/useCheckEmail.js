import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useCheckEmail = (email, userId) => {
    const [isEmailExist, setIsEmailExist] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkEmail = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${BASE_URL}app/views/check-email.php`,
                {
                    params: { email: email, id: userId ?? null}
                }
            );

            setIsEmailExist(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Error checking email existence:", err);
            setError("Failed to check email. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (email) {
            checkEmail();
        }
    }, [email]);

    return { isEmailExist, loading, error, refetch: checkEmail };
};
