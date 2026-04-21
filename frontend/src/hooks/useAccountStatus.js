import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useAccountStatus = (userId) => {
    const [accountStatus, setAccountStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAccountStatus = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${BASE_URL}app/api/account-status.php`,
                {
                    params: { id: userId ?? null },
                }
            );

            setAccountStatus(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Error checking email existence:", err);
            setError("Failed to check email. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            getAccountStatus();
        }
    }, [userId]);

    return { loading, accountStatus, getAccountStatus };
};
