import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useSchoolYears = () => {
    const [schoolYears, setSchoolYears] = useState([]);
    const [activeSchoolYear, setActiveSchoolYear] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchActiveSchoolYear = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}app/api/school-years.php?action=active`
            );

            setActiveSchoolYear(response.data.data || null);
            return response.data.data;
        } catch (err) {
            console.error("Error fetching active school year:", err);
            setError("Failed to load active school year.");
            return null;
        }
    };

    const fetchSchoolYears = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}app/api/school-years.php`
            );

            setSchoolYears(response.data.data || []);
        } catch (err) {
            console.error("Error fetching school years:", err);
            setError("Failed to load school years.");
        }
    };

    const updateSchoolYearStatus = async (id, action) => {
        try {
            setLoading(true);

            const response = await axios.put(
                `${BASE_URL}app/api/school-years.php`,
                {
                    id,
                    action: action === "activate" ? "active" : action,
                }
            );

            if (response.data.success) {
                await fetchSchoolYears();
                await fetchActiveSchoolYear(); // refresh active year
            }

            return response.data.success;
        } catch (err) {
            console.error("Error updating school year status:", err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);

            await Promise.all([
                fetchSchoolYears(),
                fetchActiveSchoolYear(),
            ]);

            setLoading(false);
        };

        init();
    }, []);

    return {
        loading,
        error,
        schoolYears,
        activeSchoolYear,
        fetchSchoolYears,
        fetchActiveSchoolYear,
        updateSchoolYearStatus,
    };
};