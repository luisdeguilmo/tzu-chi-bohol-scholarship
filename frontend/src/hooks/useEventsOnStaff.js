import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useEventsOnStaff = (year, status, sortBy) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/events.php?is_staff=true&year=${year}&status=${status}&sort_by=${sortBy}`
            );
            // Set application periods data
            setEvents(response.data.data || []);
            // Set active application period flag
            setLoading(false);
        } catch (err) {
            console.error("Error fetching application period data:", err);
            setError(
                "Failed to load application period data. Please try again."
            );
            setLoading(false);
        }
    };

    useEffect(() => {
        if (year && status && sortBy) {
            fetchEvents();
        }
    }, [year, status, sortBy]);

    return { events, fetchEvents };
};
