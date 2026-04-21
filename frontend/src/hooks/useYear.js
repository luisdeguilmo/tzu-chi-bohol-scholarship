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
            const response = await axios.get(`${BASE_URL}app/api/years.php`);
            setYears(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching batches data:", err);
            setError("Failed to load batches data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchYears();
    }, []);

    return {
        loading,
        years,
        fetchYears,
    };
};
