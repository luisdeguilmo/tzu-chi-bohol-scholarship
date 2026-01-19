import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useEvents = (tab, userId) => {
    const [currentTab, setCurrentTab] = useState("upcoming");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/events.php?tab=${tab}&id=${userId}&is_scholar=true`
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

    const fetchEventParticipants = async (eventId) => {
        try {
            const response = await axios.get(
                `${BASE_URL}app/views/event-participants.php?event_id=${eventId}`
            );
            return response.data.data || 0;
        } catch (error) {
            console.error("Error fetching event participants:", error);
            setError("Failed to load event participants. Please try again.");
            return [];
        }
    };

    const joinEvent = async (eventId, scholarId) => {
        try {
            const response = await axios.post(
                `${BASE_URL}app/views/event-participants.php`,
                { event_id: eventId, scholar_id: scholarId },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.success) {
                // Optionally, you can refetch events to update the UI
                // fetchEvents(currentTab);
            } else {
                throw new Error(
                    response.data.message || "Failed to join event"
                );
            }
        } catch (error) {
            console.error("Error joining event:", error);
            setError(error.message || "Failed to join event");
        }
    };

    const cancelEvent = async (eventId, scholarId) => {
        try {
            const response = await axios.delete(
                `${BASE_URL}app/views/event-participants.php`,
                {
                    data: { event_id: eventId, scholar_id: scholarId },
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
            } else {
                throw new Error(
                    response.data.message || "Failed to cancel event"
                );
            }
        } catch (error) {
            console.error("Error cancelling event:", error);
            setError(error.message || "Failed to cancel event");
        }
    };

    useEffect(() => {
        if (tab && userId) {
            fetchEvents();
        }
    }, [tab, userId]);

    return {
        loading,
        joinEvent,
        cancelEvent,
        events,
        fetchEvents,
    };
};
