import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useYears = () => {
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchYears = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`${BASE_URL}app/api/years.php`);
            setYears(response.data.data || []);
        } catch (err) {
            console.error("Error fetching years:", err);
            setError("Failed to load years. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchYears();
    }, []);

    return {
        years,
        loading,
        error,
        fetchYears,
    };
};
