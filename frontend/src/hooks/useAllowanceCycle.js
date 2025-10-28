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
                `${BASE_URL}app/views/allowance-cycles.php`
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

    const startNewCycle = async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${BASE_URL}app/views/allowance-cycles.php`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            if (data.success) {
                toast.success("New Cycle Started Successfully");
                setLoading(false);
                return true;
            } else {
                toast.error("A cycle has already been started for this month.");
                setLoading(false);
                return false;
            }

            setLoading(false);
            return false;
        } catch (error) {
            console.log("Error: ", error);
            alert("Failed: ", error);
            setLoading(false);
            return false;
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    return {
        loading,
        isProcessed,
        fetchStatus,
        startNewCycle,
    };
};
