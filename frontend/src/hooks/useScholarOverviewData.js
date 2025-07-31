import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useScholarOverviewData = (id, section) => {
    const [overviewData, setOverviewData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOverviewData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/sholar-overview-data.php?section=${section}&id=${id}`
            );
            setOverviewData(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching overview data:", err);
            setError("Failed to load overview data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverviewData();
    }, []);

    return { overviewData, loading, error };
};
