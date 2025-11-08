import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../../../config";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import { useAccountStatus } from "../../../hooks/useAccountStatus";

const EventButton = ({
    numberOfParticipants,
    participantLimit,
    hasJoinButton,
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

    const { user } = useAuth();
    const { accountStatus } = useAccountStatus(user.user_id);

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
            if (accountStatus === "not_renewed") {
                toast.error(
                    `You can’t join events until your renewal application is approved.`
                );
                return;
            }

            if (numberOfParticipants === participantLimit) {
                toast.error(
                    `This event has reached its participant limit (${numberOfParticipants}/${participantLimit}).`
                );
                return;
            }

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
        <>
            {hasJoinButton && (
                <button
                    onClick={handleClick}
                    disabled={actionLoading}
                    className={`${
                        joined
                            ? "bg-slate-300 text-slate-600 hover:bg-slate-400"
                            : "bg-green-600 text-white hover:bg-green-700 transition"
                    } px-4 py-2 rounded-lg font-medium text-sm `}
                >
                    {actionLoading
                        ? joined
                            ? "Cancelling..."
                            : "Joining..."
                        : joined
                          ? "Cancel"
                          : "Join Event"}
                </button>
            )}
        </>
    );
};

export default EventButton;
