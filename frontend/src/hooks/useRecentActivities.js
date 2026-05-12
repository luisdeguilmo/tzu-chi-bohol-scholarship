import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import { useLocation } from "react-router-dom";

export const useRecentActivities = () => {
    const [recentActivities, setRecentActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");
    const { pathname } = useLocation();

    const fetchRecentActivities = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/recent-activities.php`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            setRecentActivities(response.data.data || []);
            setIsLoading(false);
        } catch (err) {
            console.log("Error: ", err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (pathname.includes("scholar/dashboard")) {
            fetchRecentActivities();
        }
    }, [pathname]);

    return { recentActivities, fetchRecentActivities };
};
