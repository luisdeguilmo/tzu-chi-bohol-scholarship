import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export const useEvents = (tab) => {
    const [currentTab, setCurrentTab] = useState("upcoming");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

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

    const fetchEventParticipants = async (eventId) => {
        try {
            const response = await axios.get(
                `${BASE_URL}app/api/event-participants.php?event_id=${eventId}`,
            );
            return response.data.data || 0;
        } catch (error) {
            console.error("Error fetching event participants:", error);
            setError("Failed to load event participants. Please try again.");
            return [];
        }
    };

    const joinEvent = async (eventName, eventId) => {
        try {
            const response = await axios.post(
                `${BASE_URL}app/api/event-participants.php`,
                {
                    event_id: eventId,
                    event_name: eventName,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (response.data.success) {
                // Optionally, you can refetch events to update the UI
                // fetchEvents(currentTab);
            } else {
                throw new Error(
                    response.data.message || "Failed to join event",
                );
            }
        } catch (error) {
            console.error("Error joining event:", error);
            setError(error.message || "Failed to join event");
        }
    };

    const cancelEvent = async (eventName, eventId) => {
        try {
            const response = await axios.delete(
                `${BASE_URL}app/api/event-participants.php`,
                {
                    data: {
                        event_id: eventId,
                        event_name: eventName,
                    },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.data.success) {
            } else {
                throw new Error(
                    response.data.message || "Failed to cancel event",
                );
            }
        } catch (error) {
            console.error("Error cancelling event:", error);
            setError(error.message || "Failed to cancel event");
        }
    };

    useEffect(() => {
        if (tab) {
            fetchEvents();
        }
    }, [tab]);

    return {
        loading,
        joinEvent,
        cancelEvent,
        events,
        fetchEvents,
    };
};
