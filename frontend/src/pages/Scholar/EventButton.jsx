import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../../config";

const EventButton = ({
    setIsOpen,
    joinEvent,
    cancelEvent,
    eventId,
    scholarId,
    onRefresh,
    activeTab,
}) => {
    const [joined, setJoined] = useState(false); // Start with false instead of true
    const [loading, setLoading] = useState(true); // Add loading state
    const [actionLoading, setActionLoading] = useState(false); // Add action loading state

    const isUserParticipant = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}app/views/event-participants.php?scholar_id=${scholarId}&event_id=${eventId}`
            );

            if (response.data.success) {
                setJoined(true);
            } else {
                setJoined(false);
            }
        } catch (error) {
            console.error("Error checking participation:", error);
            setJoined(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only check participation if both eventId and scholarId are available
        if (eventId && scholarId) {
            isUserParticipant();
        }
    }, [eventId, scholarId]); // Add dependencies

    const handleJoin = async () => {
        try {
            setIsOpen(false); // Close modal before joining
            setActionLoading(true);
            await joinEvent(eventId, scholarId);
            setJoined(true); // Update state after successful join
            onRefresh(activeTab);
        } catch (error) {
            console.error("Error joining event:", error);
            // Revert state if join fails
            setJoined(false);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        try {
            setIsOpen(false); // Close modal before cancelling
            setActionLoading(true);
            await cancelEvent(eventId, scholarId);
            setJoined(false); // Update state after successful cancel
            onRefresh(activeTab);
        } catch (error) {
            console.error("Error cancelling event:", error);
            // Revert state if cancel fails
            setJoined(true);
        } finally {
            setActionLoading(false);
        }
    };

    const handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        // Prevent action if already loading
        if (actionLoading || loading) return;

        if (joined) {
            handleCancel();
        } else {
            handleJoin();
        }
    };

    // Show loading state while checking participation
    if (loading) {
        return (
            <button
                disabled
                className="bg-gray-300 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium"
            >
                Loading...
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={actionLoading}
            className={`${
                joined
                    ? "bg-slate-300 text-slate-600 hover:bg-slate-400"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-green-600 hover:to-emerald-600 text-white"
            } px-4 py-2 flex-1 text-sm rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {actionLoading
                ? joined
                    ? "Cancelling..."
                    : "Joining..."
                : joined
                ? "Cancel"
                : "Join Event"}
        </button>
    );
};

export default EventButton;
