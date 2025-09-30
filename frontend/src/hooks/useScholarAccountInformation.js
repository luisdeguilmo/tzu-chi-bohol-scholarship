import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { toast } from "react-toastify";

export const useScholarAccountInformation = (userId, currentSchoolYear) => {
    const [scholarInfo, setScholarInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchScholarInfo = async () => {
        try {
            setLoading(true);
            // Replace with your actual API endpoint
            const response = await axios.get(
                `${BASE_URL}app/views/scholar-info.php?scholar_id=${userId}&current_school_year=${currentSchoolYear}`
            );

            if (response.data.success) {
                setScholarInfo(response.data.data || {});
                setLoading(false);
            } else {
                setScholarInfo({});
                setLoading(false);
            }
        } catch (err) {
            console.error("Error fetching accounts data:", err);
            setError("Failed to load accounts data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchScholarInfo();
        }
    }, [userId]);

    return {
        loading,
        scholarInfo,
        fetchScholarInfo,
    };
};
