import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useScholarAllowances = () => {
    const [scholarAllowances, setScholarAllowances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const fetchScholarAllowances = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/scholar-allowances.php`,
            );
            // Set application periods data
            setScholarAllowances(response.data.data || []);
            // Set active application period flag
            setLoading(false);
        } catch (err) {
            console.error("Error fetching scholar allowances data: ", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScholarAllowances();
    }, []);

    return { scholarAllowances, fetchScholarAllowances };
};
