import axios from "axios";
import { useEffect, useState } from "react";

export const useEvents = () => {
    const [currentTab, setCurrentTab] = useState("upcoming");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = async (tab = 'upcoming') => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/app/views/events.php?tab=${tab}`
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
        fetchEvents();
    }, []);

    return { events, fetchEvents };
};
