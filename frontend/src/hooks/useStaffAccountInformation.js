import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useStaffAccountInformation = () => {
    const [staffInfo, setStaffInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const fetchStaffInfo = async () => {
        try {
            setLoading(true);
            // Replace with your actual API endpoint
            const response = await axios.get(
                `${BASE_URL}app/api/staff-info.php`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
                setStaffInfo(response.data.data || {});
                setLoading(false);
            } else {
                setStaffInfo({});
                setLoading(false);
            }
        } catch (err) {
            console.error("Error fetching accounts data:", err);
            setError("Failed to load accounts data. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffInfo();
    }, []);

    return {
        loading,
        staffInfo,
        fetchStaffInfo,
    };
};
