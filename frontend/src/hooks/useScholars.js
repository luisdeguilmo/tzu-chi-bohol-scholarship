import { useEffect, useState } from "react";
import BASE_URL from "../config";
import axios from "axios";
import { toast } from "react-toastify";

export const useScholars = (
    tab,
    status,
    schoolYear,
    school,
    course,
    yearLevel,
    sortBy,
    filter,
) => {
    const [type, setType] = useState("");
    const [scholars, setScholars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const fetchScholars = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${BASE_URL}app/api/scholars.php?tab=${tab}&status=${status}&school=${school}&course=${course}&year_level=${yearLevel}&school_year=${schoolYear}&sort=${sortBy}&filter=${filter}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
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

    const processAllowance = async (type) => {
        try {
            setLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/api/process-allowance.php`,
                { type: type },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = response.data;

            if (data.success) {
                if (type === "process_final_allowance") {
                    toast.success("Allowance Processed Successfully");
                }
                setLoading(false);
                return true;
            } else {
                toast.error("Failed to process allowance. Please try again.");
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
        loadAllowance,
    ) => {
        try {
            setLoading(true);
            const response = await axios.put(
                `${BASE_URL}app/api/scholar.php`,
                {
                    account_id: accountId,
                    allowance_status: status,
                    transport_allowance: transportAllowance,
                    load_allowance: loadAllowance,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
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
        if (tab && status && school && course && schoolYear && sortBy) {
            fetchScholars();
        }
    }, [tab, status, school, course, schoolYear, sortBy]);

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
