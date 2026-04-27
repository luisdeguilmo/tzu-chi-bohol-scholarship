import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useCurrentYearLevel = (schoolYear) => {
    const [yearLevel, setYearLevel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const getCurrentYearLevel = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/year-level.php?school_year=${schoolYear}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
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
        if (schoolYear) {
            getCurrentYearLevel();
        }
    }, [schoolYear]);

    return { yearLevel, getCurrentYearLevel };
};
