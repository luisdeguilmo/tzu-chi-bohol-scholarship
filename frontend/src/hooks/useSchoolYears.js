import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useSchoolYears = () => {
    const [schoolYears, setSchoolYears] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getActiveSchoolYear = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/school-years.php?action=${"active"}`,
            );
            return response.data.data || [];
        } catch (err) {
            console.error("Error fetching batches data:", err);
            setError("Failed to load batches data. Please try again.");
            setLoading(false);
        }
    };

    const fetchSchoolYears = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/school-years.php`,
            );
            setSchoolYears(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching batches data:", err);
            setError("Failed to load batches data. Please try again.");
            setLoading(false);
        }
    };

    const updateSchoolYearStatus = async (id, action) => {
        try {
            setLoading(true);

            const response = await axios.put(
                `${BASE_URL}app/api/school-years.php`,
                {
                    id: id,
                    action: action === "activate" && "active",
                },
            );

            if (response.data.success) {
                // Refresh the data after account creation
            } else {
                toast.error("Error: " + response.data.message);
            }

            setLoading(false);
            return true;
        } catch (err) {
            console.error("Error updating scholar status:", err);
            setLoading(false);
            return false;
        }
    };

    useEffect(() => {
        fetchSchoolYears();
    }, []);

    return {
        loading,
        schoolYears,
        fetchSchoolYears,
        updateSchoolYearStatus,
        getActiveSchoolYear
    };
};
