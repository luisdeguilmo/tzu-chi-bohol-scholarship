import {
    Calendar,
    Check,
    Clock,
    EllipsisVertical,
    MapPin,
    SendHorizonal,
    Users,
    X,
} from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";
import { date } from "../utils/getDateAndTime";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { convertTo24HourFormat } from "../utils/convertTo24HourFormat";
import EventButton from "../pages/Scholar/Events/EventButton";
import ConfirmationModal from "../pages/Staff/Event/ConfirmationModal";
import InputModal from "./InputModal";
import { toast } from "react-toastify";
import { useEventReason } from "../hooks/useEventReason";
import { formatTimestamp } from "../utils/formatTimestamp";
import { numbersOnly } from "../utils/inputValidations";
import { useAuth } from "../context/AuthContext";

const EventDetailsModal = React.memo(
    ({
        isOpen,
        onClose,
        event,
        isStaff = false,
        joinEvent,
        cancelEvent,
        userId,
        firstName,
        lastName,
        fetchEvents,
        activeTab,
        isScholar = false,
        shouldScrollToComments = false,
        onStaffEventsRefresh = null,
        onScholarEventsRefresh = null,
    }) => {
        const [isOpenSelectedScholarModal, setIsOpenSelectedScholarModal] =
            useState(false);
        const [method, setMethod] = useState("");
        const [renderedHours, setRenderedHours] = useState("");
        const [selectedScholars, setSelectedScholars] = useState([]);
        const [localEvent, setLocalEvent] = useState(event);
        const [isOnTheList, setIsOnTheList] = useState(false);
        const [hasReason, setHasReason] = useState(false);
        const [scholarPrivateComment, setScholarPrivateComment] = useState("");
        const [staffPrivateComment, setStaffPrivateComment] = useState({});
        const [groupIndex, setGroupIndex] = useState(null);
        const [isDotMenuOpen, setIsDotMenuOpen] = useState(false);
        const [itemIndex, setItemIndex] = useState(null);
        const [isPrivateCommentFieldOpen, setIsPrivateCommentFieldOpen] =
            useState(false);

        const { user } = useAuth();

        const privateCommentsRef = useRef(null);

        // Add effect to scroll to comments when modal opens with shouldScrollToComments flag
        useEffect(() => {
            if (
                isOpen &&
                shouldScrollToComments &&
                privateCommentsRef.current
            ) {
                // Small delay to ensure modal is fully rendered
                setTimeout(() => {
                    privateCommentsRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }, 100);
            }
        }, [isOpen, shouldScrollToComments]);

        const {
            addReason,
            privateComments,
            fetchPrivateComments,
            fetchScholarPrivateComments,
            markCommentAsRead,
            deletePrivateComment,
        } = useEventReason(localEvent?.id, user.type);

        useEffect(() => {
            const markCommentsRead = async () => {
                if (isScholar) {
                    const success = await markCommentAsRead(
                        "scholar",
                        localEvent?.id,
                        user.user_id,
                    );

                    if (
                        success &&
                        localEvent?.numberOfStaffUnreadComments > 0
                    ) {
                        onScholarEventsRefresh();
                    }
                } else if (isStaff) {
                    const success = await markCommentAsRead(
                        "staff",
                        localEvent?.id,
                        user.user_id,
                    );

                    if (
                        success &&
                        localEvent?.numberOfScholarUnreadComments > 0
                    ) {
                        onStaffEventsRefresh();
                    }
                }
            };

            if (isOpen) {
                markCommentsRead();
            }
        }, [user, localEvent]);

        // Update local event when prop changes
        useEffect(() => {
            setLocalEvent(event);
        }, [event]);

        const handleSelectScholar = (scholarId) => {
            setSelectedScholars((prev) => {
                if (prev.includes(scholarId)) {
                    return prev.filter((id) => id !== scholarId);
                } else {
                    return [...prev, scholarId];
                }
            });
        };

        useEffect(() => {
            if (method === "automatic") {
                const startTime = convertTo24HourFormat(
                    localEvent?.start_time,
                ).split(":");
                const endTime = convertTo24HourFormat(
                    localEvent?.end_time,
                ).split(":");
                const renderedHours = endTime[0] - startTime[0];
                setRenderedHours(renderedHours);
            } else {
                setRenderedHours("");
            }
        }, [method, localEvent]);

        const participated = localEvent?.participants.filter(
            (participant) => participant.is_attended,
        );

        const handleCancel = () => {
            onClose(false);
            setScholarPrivateComment("");
        };

        const handleOpenConfirmationModal = () => {
            if (selectedScholars.length < 1) {
                toast.error("Select scholar(s) to proceed.");
                return;
            }

            if (renderedHours === "") {
                toast.error("Please enter number of hours.");
                return;
            }

            setIsOpenSelectedScholarModal(true);
        };

        const handleRecordSuccess = () => {
            // Update local participants to mark selected scholars as attended
            setLocalEvent((prev) => ({
                ...prev,
                participants: prev.participants.map((participant) =>
                    selectedScholars.includes(participant.scholar_id)
                        ? { ...participant, is_attended: true }
                        : participant,
                ),
            }));

            // Clear selections and reset
            setSelectedScholars([]);
            setMethod("");
            setRenderedHours("");
            setIsOpenSelectedScholarModal(false);

            // Refresh the parent data
            if (fetchEvents) {
                fetchEvents();
            }
        };

        useMemo(() => {
            if (event?.event_type === "mandatory") {
                const isExist = event.participants.some(
                    (item) => item.scholar_id === userId,
                );

                if (isExist) {
                    setIsOnTheList(true);
                }
            } else {
                setIsOnTheList(false);
            }
        }, [event]);

        useMemo(() => {
            if (event?.event_type === "mandatory") {
                const isExist = event.participants.some((item) => item.reason);

                if (isExist) {
                    setHasReason(true);
                }
            } else {
                setHasReason(false);
            }
        }, [event]);

        const handleSubmit = async (userId) => {
            if (isScholar && scholarPrivateComment.trim() === "") {
                return;
            }

            if (isStaff && staffPrivateComment[groupIndex] === "") {
                return;
            }

            const success = await addReason(
                localEvent?.id,
                userId,
                isStaff ? user.user_id : null,
                isScholar
                    ? scholarPrivateComment
                    : staffPrivateComment[groupIndex],
                firstName,
                lastName,
                user.type,
            );

            if (success && isScholar) {
                fetchScholarPrivateComments();
                setScholarPrivateComment("");
            }

            if (success && isStaff) {
                fetchPrivateComments();
                setStaffPrivateComment({});
            }
        };

        const handleDeleteComment = async (id) => {
            const success = await deletePrivateComment(id);

            if (success) {
                fetchPrivateComments();
            }
        };

        const handleOpenDotMenu = useCallback(
            async (event, index) => {
                event.stopPropagation();
                if (itemIndex === index && isDotMenuOpen === true) {
                    setIsDotMenuOpen(false);
                } else {
                    setIsDotMenuOpen(true);
                }
                setItemIndex(index);
            },
            [itemIndex, isDotMenuOpen],
        );

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (
                    isPrivateCommentFieldOpen &&
                    !event.target.closest(".private_comments")
                ) {
                    setIsPrivateCommentFieldOpen(false);
                }
            };

            document.addEventListener("click", handleClickOutside);
            return () =>
                document.removeEventListener("click", handleClickOutside);
        }, [isPrivateCommentFieldOpen]);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (isDotMenuOpen && !event.target.closest(".dot_menu")) {
                    setIsDotMenuOpen(false);
                }
            };

            document.addEventListener("click", handleClickOutside);
            return () =>
                document.removeEventListener("click", handleClickOutside);
        }, [isDotMenuOpen]);

        return (
            <>
                <InputModal
                    label={"Event Details"}
                    isOpen={isOpen}
                    onClose={onClose}
                    resetFields={() => setScholarPrivateComment("")}
                    expandable={true}
                    onCancel={handleCancel}
                    disabledButton={
                        localEvent?.event_type === "optional" ||
                        (isStaff && localEvent?.event_type === "mandatory")
                    }
                    disabledButtonSave={true}
                >
                    {/* Content */}
                    <div
                        className={`max-h-[400px] overflow-y-auto scroll-smooth p-6 ${localEvent?.participants.length > 0 && "space-y-6"}`}
                    >
                        {/* Event Details Grid */}
                        <h3
                            className={`flex items-center gap-2 rounded-md text-[16px] text-gray-800 ${localEvent?.participants.length > 0 ? "-mb-3" : "mb-3.5"}`}
                        >
                            {localEvent?.event_name}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-12  text-xs">
                            <div className="mb-3 sm:mb-0 space-y-3">
                                <div className="flex items-center text-slate-600">
                                    <Calendar className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium">
                                        {formatDate(localEvent?.date)}
                                    </span>
                                </div>

                                <div className="flex items-center text-slate-600">
                                    <MapPin className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium truncate">
                                        {localEvent?.event_location}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-slate-600">
                                    <Clock className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium">
                                        {formatTime(localEvent?.start_time)} -{" "}
                                        {formatTime(localEvent?.end_time)}
                                    </span>
                                </div>

                                <div className="flex items-center text-slate-600">
                                    <Users className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                    {localEvent?.event_type === "optional" ? (
                                        localEvent?.date +
                                            " " +
                                            localEvent?.end_time >
                                        date.getCurrentDateAndTime() ? (
                                            <span className="text-slate-700 font-medium">
                                                {
                                                    localEvent?.numberOfParticipants
                                                }
                                                {" / "}
                                                {
                                                    localEvent?.participant_limit
                                                }{" "}
                                                Participants
                                            </span>
                                        ) : (
                                            <span className="text-slate-700 font-medium">
                                                {
                                                    localEvent?.numberOfParticipants
                                                }
                                                {" / "}
                                                {
                                                    localEvent?.participant_limit
                                                }{" "}
                                                Participated
                                            </span>
                                        )
                                    ) : localEvent?.date +
                                          " " +
                                          localEvent?.end_time >
                                      date.getCurrentDateAndTime() ? (
                                        <span className="text-slate-700 font-medium">
                                            {localEvent?.numberOfParticipants}{" "}
                                            Participants
                                        </span>
                                    ) : (
                                        <span className="text-slate-700 font-medium">
                                            {localEvent?.numberOfParticipants}{" "}
                                            Participated
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div
                                className={`mt-2 ${localEvent?.participants?.length > 0 ? "block" : "hidden"}  rounded-md`}
                            >
                                <h3
                                    className={`${
                                        localEvent?.participants?.length > 0
                                            ? "block"
                                            : "hidden"
                                    } bg-green-600 border-b rounded-lg px-4 py-3 text-xs text-white `}
                                >
                                    {localEvent?.date +
                                        " " +
                                        localEvent?.end_time >
                                    date.getCurrentDateAndTime()
                                        ? "Scholars Who Will Participate:"
                                        : "Scholars Who Participated:"}
                                </h3>
                                <ul
                                    className={`py-2 space-y-0.5 grid ${
                                        localEvent?.participants?.length >= 15
                                            ? "grid-cols-2"
                                            : "grid-cols-1"
                                    }`}
                                >
                                    {localEvent?.participants?.map(
                                        (participant, index) => (
                                            <li
                                                key={index}
                                                className="w-[max-content]"
                                            >
                                                <label className="flex gap-2 items-center text-slate-600 bg-gray-100 px-4 py-2 rounded-lg text-xs">
                                                    {isStaff && (
                                                        <>
                                                            {participant.is_attended ? (
                                                                <Check className="w-4 h-4 font-bold rounded-sm text-green-600" />
                                                            ) : (
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedScholars.includes(
                                                                        participant.scholar_id,
                                                                    )}
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleSelectScholar(
                                                                            participant.scholar_id,
                                                                            e
                                                                                .target
                                                                                .checked,
                                                                        )
                                                                    }
                                                                    className={`${
                                                                        localEvent?.date +
                                                                            " " +
                                                                            localEvent?.end_time >
                                                                        date.getCurrentDateAndTime()
                                                                            ? "hidden"
                                                                            : "block"
                                                                    } accent-green-600`}
                                                                />
                                                            )}
                                                        </>
                                                    )}{" "}
                                                    <span>
                                                        {
                                                            participant.participant_name
                                                        }
                                                    </span>
                                                </label>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        </div>

                        {localEvent?.date + " " + localEvent?.end_time <
                            date.getCurrentDateAndTime() &&
                            isStaff &&
                            participated.length <
                                localEvent?.numberOfParticipants && (
                                <div>
                                    <div className="mt-2 border rounded-md border-gray-200">
                                        <h3 className="bg-gray-50 rounded-tl-md rounded-tr-md px-4 py-4 border-b text-xs text-gray-600 font-bold">
                                            Rendered Hours:
                                        </h3>
                                        <div
                                            className={`p-4 block relative ${method === "manual" ? "-mb-4" : ""}`}
                                        >
                                            <label className="mb-1 text-xs text-slate-600 flex gap-2 items-center">
                                                <input
                                                    checked={
                                                        method === "automatic"
                                                    }
                                                    onChange={() =>
                                                        setMethod("automatic")
                                                    }
                                                    name="rendered"
                                                    type="radio"
                                                    className="accent-green-600"
                                                />
                                                Based on the event's start and
                                                end time
                                            </label>
                                            <label className="text-xs text-slate-600 flex gap-2 items-center">
                                                <input
                                                    checked={
                                                        method === "manual"
                                                    }
                                                    onChange={() =>
                                                        setMethod("manual")
                                                    }
                                                    name="rendered"
                                                    type="radio"
                                                    className="accent-green-600"
                                                />
                                                Enter number of hour(s) manually
                                            </label>
                                        </div>

                                        {method === "manual" && (
                                            <div className="block p-4 mb-2 relative">
                                                <label className="block mb-1 text-gray-600 text-xs">
                                                    Rendered Hours
                                                </label>
                                                <input
                                                    type="text"
                                                    min={1}
                                                    value={renderedHours}
                                                    onChange={(e) => {
                                                        const value =
                                                            numbersOnly(
                                                                e.target.value,
                                                            );
                                                        setRenderedHours(value);
                                                    }}
                                                    required
                                                    placeholder="Enter number of hours"
                                                    className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        {isStaff && (
                            <div
                                ref={privateCommentsRef}
                                className={`border mt-2 rounded-md`}
                            >
                                <h3
                                    className={`border-b bg-gray-50 rounded-tl-md rounded-tr-md px-4 py-4 text-xs text-gray-600 font-bold`}
                                >
                                    Private Comments
                                </h3>
                                <ul className="">
                                    {privateComments.map(
                                        (group, groupIndex) => (
                                            <li
                                                key={groupIndex}
                                                className={`${groupIndex !== privateComments.length - 1 && "border-b"}`}
                                            >
                                                {group.map((comment, index) => (
                                                    <div
                                                        key={comment.id}
                                                        className={`group re relative px-4 py-4 flex flex-col ${index !== group.length - 1 && "border-b"}`}
                                                    >
                                                        <div
                                                            className={`flex items-center gap-1`}
                                                        >
                                                            <p className="mb-2 text-[11px] font-bold text-gray-600">
                                                                {comment.first_name +
                                                                    " " +
                                                                    comment.last_name}
                                                            </p>
                                                            <span className="mb-3 text-xs text-gray-600">
                                                                {"•"}
                                                            </span>
                                                            <p className="mb-2 text-[11px] text-gray-500">
                                                                {formatTimestamp(
                                                                    comment.created_at,
                                                                )}
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-gray-600">
                                                            {comment.message}
                                                        </p>

                                                        {isStaff && (
                                                            <button
                                                                onClick={(e) =>
                                                                    handleOpenDotMenu(
                                                                        e,
                                                                        index,
                                                                    )
                                                                }
                                                                type="button"
                                                                className="hidden absolute top-2 right-1 group-hover:block p-2 hover:bg-gray-100 rounded-full"
                                                            >
                                                                <EllipsisVertical className="w-4 h-4 text-gray-600" />
                                                            </button>
                                                        )}

                                                        {isDotMenuOpen &&
                                                            index ===
                                                                itemIndex && (
                                                                <div className="dot_menu absolute top-10 -right-6 bg-white rounded-xl shadow-lg border border-slate-200 z-50 min-w-[80px] p-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteComment(
                                                                                comment.id,
                                                                            );
                                                                            setIsDostMenuOpen(
                                                                                false,
                                                                            );
                                                                        }}
                                                                        className="w-full text-center rounded-lg px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                    </div>
                                                ))}

                                                <div className="px-4 pb-2 flex items-center">
                                                    <label className="flex-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Add a comment..."
                                                            value={
                                                                staffPrivateComment[
                                                                    groupIndex
                                                                ] || ""
                                                            }
                                                            onChange={(e) => {
                                                                setStaffPrivateComment(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [groupIndex]:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }),
                                                                );

                                                                setGroupIndex(
                                                                    groupIndex,
                                                                );
                                                            }}
                                                            className="w-[100%] border text-xs border-gray-300 rounded-lg py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                                            required
                                                        />
                                                    </label>
                                                    <div className="">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleSubmit(
                                                                    group[0]
                                                                        .scholar_id,
                                                                );
                                                            }}
                                                            type="button"
                                                            className="pl-2 py-2 flex"
                                                        >
                                                            <SendHorizonal className="w-6 h-6 text-gray-400/80" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        )}

                        {isScholar && (
                            <div
                                className={`${localEvent?.event_type === "optional" ? "mt-6" : "mt-2"} rounded-md`}
                            >
                                <h3
                                    className={`bg-green-600 mb-2 rounded-lg px-4 py-3 text-xs text-white`}
                                >
                                    Private comments
                                </h3>

                                <ul
                                    className={`${privateComments.length === 0 && "pt-2"} space-y-2`}
                                >
                                    {privateComments.map((comment, index) => (
                                        <li
                                            key={comment.id}
                                            className={`group relative ${index !== privateComments.length - 1 && ""} px-4 py-3 flex items-center justify-between bg-gray-100 rounded-lg`}
                                        >
                                            <div className="w-full">
                                                <div className="flex items-center gap-1">
                                                    <p className="mb-2 text-[10px] text-gray-600">
                                                        {comment.first_name +
                                                            " " +
                                                            comment.last_name}
                                                    </p>
                                                    <span className="mb-3 text-xs text-gray-600">
                                                        {"•"}
                                                    </span>
                                                    <p className="mb-2 text-[10px] text-gray-500">
                                                        {formatTimestamp(
                                                            comment.created_at,
                                                        )}
                                                    </p>
                                                </div>
                                                <p className="text-justify text-sm break-words text-gray-800">
                                                    {comment.message}
                                                </p>
                                            </div>
                                        </li>
                                    ))}

                                    {!isPrivateCommentFieldOpen &&
                                        privateComments.length === 0 && (
                                            <button
                                                onClick={() =>
                                                    setIsPrivateCommentFieldOpen(
                                                        true,
                                                    )
                                                }
                                                className="private_comments px-4 pt-3 pb-5 italic text-xs text-green-600 hover:underline"
                                            >
                                                Add a private comment (e.g.,
                                                questions, concerns, or reasons
                                                for absence)
                                            </button>
                                        )}

                                    {(isPrivateCommentFieldOpen ||
                                        privateComments.length > 0) && (
                                        <div className="private_comments pb-2 flex items-center">
                                            <label className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Add a comment..."
                                                    value={
                                                        scholarPrivateComment
                                                    }
                                                    onChange={(e) =>
                                                        setScholarPrivateComment(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-[100%] border text-xs border-gray-400 rounded-lg py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                                    required
                                                />
                                            </label>
                                            <div className="">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleSubmit(userId);
                                                    }}
                                                    type="button"
                                                    className="pl-1 py-2 flex"
                                                >
                                                    <SendHorizonal className="w-7 h-7 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    {(isStaff ||
                        (isScholar &&
                            localEvent?.event_type === "optional")) && (
                        <div className="flex justify-end rounded-b-lg gap-2 p-3.5 border-t bg-gray-50 flex-shrink-0">
                            <button
                                onClick={() => onClose(false)}
                                type="button"
                                className="ml-auto bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                            >
                                Close
                            </button>
                            {isScholar &&
                                date.getCurrentDateAndTime() <
                                    localEvent?.date +
                                        " " +
                                        localEvent?.start_time && (
                                    <EventButton
                                        numberOfParticipants={
                                            localEvent?.numberOfParticipants
                                        }
                                        participantLimit={
                                            localEvent?.participant_limit
                                        }
                                        hasJoinButton={
                                            localEvent?.event_type ===
                                            "optional"
                                        }
                                        setIsOpen={onClose}
                                        joinEvent={joinEvent}
                                        cancelEvent={cancelEvent}
                                        eventId={localEvent?.id}
                                        eventName={localEvent?.event_name}
                                        scholarId={userId}
                                        onRefresh={fetchEvents}
                                        activeTab={activeTab}
                                    />
                                )}
                            {isStaff &&
                                localEvent?.date + " " + localEvent?.end_time <
                                    date.getCurrentDateAndTime() &&
                                participated.length !==
                                    localEvent?.numberOfParticipants && (
                                    <button
                                        onClick={handleOpenConfirmationModal}
                                        type="button"
                                        className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
                                    >
                                        Record
                                    </button>
                                )}
                        </div>
                    )}
                </InputModal>
                <ConfirmationModal
                    isOpen={isOpenSelectedScholarModal}
                    onClose={setIsOpenSelectedScholarModal}
                    event={localEvent}
                    participants={localEvent?.participants}
                    eventId={localEvent?.id}
                    selectedScholars={selectedScholars}
                    renderedHours={renderedHours}
                    onRecordSuccess={handleRecordSuccess}
                />
            </>
        );
    },
);

export default EventDetailsModal;
