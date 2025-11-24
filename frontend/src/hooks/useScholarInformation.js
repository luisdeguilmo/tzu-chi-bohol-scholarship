import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useScholarInformation = (
    tab,
    status,
    schoolYear,
    school,
    course,
    yearLevel,
    sortBy
) => {
    const [scholarsInformation, setScholarsInformation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchScholarsInformation = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/scholar-information.php?tab=${tab}&status=${status}&school=${school}&course=${course}&year_level=${yearLevel}&school_year=${schoolYear}&sort=${sortBy}`
            );
            // Set application periods data
            setScholarsInformation(response.data.data || []);
            // Set active application period flag
            setLoading(false);
        } catch (err) {
            console.error("Error fetching scholar allowances data: ", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status && schoolYear && sortBy) {
            fetchScholarsInformation();
        }
    }, [status, schoolYear, sortBy]);

    return { loading, scholarsInformation, fetchScholarsInformation };
};
