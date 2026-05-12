import { useEffect, useState } from "react";
import BASE_URL from "../config";
import axios from "axios";
import { toast } from "react-toastify";

export const useAllowanceCycle = () => {
    const [isProcessed, setIsProcessed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStatus = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${BASE_URL}app/api/allowance-cycles.php`,
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();

            if (json.success) {
                setIsProcessed(json.data);
            } else {
                throw new Error(json.message || "Failed to fetch status");
            }
        } catch (error) {
            console.error("Error fetching scholars:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    return {
        loading,
        isProcessed,
        fetchStatus,
    };
};
