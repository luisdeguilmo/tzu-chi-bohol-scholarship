import { useEffect, useState } from "react";
import BASE_URL from "../config";
import axios from "axios";
import { toast } from "react-toastify";

export const useScholars = (tab, status, scholarYear, sortBy) => {
    const [scholars, setScholars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchScholars = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${BASE_URL}app/views/scholars.php?tab=${tab}&status=${status}&school_year=${scholarYear}&sort=${sortBy}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            setScholars(json.data || []);
        } catch (error) {
            console.error("Error fetching scholars:", error);
            setError(error.message);
            setScholars([]);
        } finally {
            setLoading(false);
        }
    };

    const processAllowance = async () => {
        try {
            setLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/views/process-allowance.php`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            if (data.success) {
                toast.success("Allowance Processed Successfully");
                setLoading(false);
                return true;
            } else {
                toast.error(
                    "You’ve already processed the allowance for this cycle. Please start a new cycle to proceed."
                );
                setLoading(false);
                return false;
            }
        } catch (error) {
            console.log("Error: ", error);
            alert("Failed: ", error);
            setLoading(false);
            return false;
        }
    };

    const updateAllowanceStatus = async (
        status,
        accountId,
        transportAllowance,
        loadAllowance
    ) => {
        try {
            setLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/views/scholar.php`,
                {
                    account_id: accountId,
                    allowance_status: status,
                    transport_allowance: transportAllowance,
                    load_allowance: loadAllowance,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;

            if (data.success) {
                toast.success("Allowance Status Updated Successfully");
                setLoading(false);
                return true;
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
        if (tab && status && scholarYear && sortBy) {
            fetchScholars();
        }
    }, [tab, status, scholarYear, sortBy]);

    return {
        scholars,
        loading,
        error,
        fetchScholars,
        updateAllowanceStatus,
        processAllowance,
        refetch: fetchScholars,
    };
};
