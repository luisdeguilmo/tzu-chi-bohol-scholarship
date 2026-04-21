import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useCurrentYearLevel = (userId, schoolYear) => {
    const [yearLevel, setYearLevel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCurrentYearLevel = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/year-level.php?scholar_id=${userId}&school_year=${schoolYear}`
            );
            // Set application periods data
            setYearLevel(response.data.data || 0);
            // Set active application period flag
            setLoading(false);
        } catch (err) {
            console.error("Error fetching scholar allowances data: ", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId && schoolYear) {
            getCurrentYearLevel();
        }
    }, [userId, schoolYear]);

    return { yearLevel, getCurrentYearLevel };
};
