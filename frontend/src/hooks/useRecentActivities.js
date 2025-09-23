import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";

export const useRecentActivities = (id) => {
    const [recentActivities, setRecentActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchRecentActivities = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/recent-activities.php?id=${id}`
            );
            setRecentActivities(response.data.data || []);
            setIsLoading(false);
        } catch (err) {
            console.log("Error: ", err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentActivities();
    }, [id]);

    return { recentActivities, fetchRecentActivities };
};
