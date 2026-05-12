import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";
import { useLocation } from "react-router-dom";

export const useRecentAndUpcomingEvents = (tab) => {
    const [currentTab, setCurrentTab] = useState("upcoming");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");
    const { pathname } = useLocation();

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/api/events.php?tab=${tab}&is_scholar=true`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            // Set application periods data
            setEvents(response.data.data || []);
            // Set active application period flag
            setLoading(false);
        } catch (err) {
            console.error("Error fetching application period data:", err);
            setError(
                "Failed to load application period data. Please try again.",
            );
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tab && pathname.includes("scholar/dashboard")) {
            fetchEvents();
        }
    }, [tab, pathname]);

    return {
        loading,
        events,
        fetchEvents,
    };
};
