import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useEventsOnStaff = (year) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = async (year) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/events.php?is_staff=true&year=${year}`
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
        fetchEvents(year);
    }, [year]);

    return { events, fetchEvents };
};
