import React, { useEffect, useMemo, useState } from "react";
import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";
import {
    Calendar,
    CheckCircle,
    CircleAlert,
    Clock,
    MapPin,
    X,
} from "lucide-react";
import { convertTo24HourFormat } from "../utils/convertTo24HourFormat";
import { useRecordHours } from "../hooks/useRecordHours";
import BASE_URL from "../config";

const CommunityServiceDetailsModal = React.memo(
    ({
        isOpen,
        onClose,
        activity,
        isStaff = false,
        onRefresh,
        status,
        year,
        month,
        sort,
    }) => {
        const URL = `${BASE_URL}public/`;
        const [filePreviews, setFilePreviews] = useState([]);
        const [feedback, setFeedback] = useState("");
        const [isRevoked, setIsRevoked] = useState(false);
        const [action, setAction] = useState("");
        const [method, setMethod] = useState("");
        const [renderedHours, setRenderedHours] = useState("");

        const { isLoading, recordCommunityServiceHours, markAsNotRecorded } =
            useRecordHours();

        useEffect(() => {
            // Reset file previews when scholar data changes
            if (activity && activity?.files) {
                setFilePreviews(activity?.files);
            }
        }, [activity]);

        useEffect(() => {
            if (method === "automatic") {
                const startTime = convertTo24HourFormat(
                    activity?.start_time
                ).split(":");
                const endTime = convertTo24HourFormat(activity?.end_time).split(
                    ":"
                );
                const renderedHours = endTime[0] - startTime[0];
                setRenderedHours(renderedHours);
            } else {
                setRenderedHours("");
            }
        }, [method]);

        const handleApprove = async () => {
            await recordCommunityServiceHours(
                activity,
                renderedHours,
                onRefresh,
                year,
                month,
                status,
                sort
            );
            await onClose(false);
            setAction("");
            setIsRevoked(false);
            setMethod("");
            setFeedback("");
            setRenderedHours("");
        };

        const handleReject = async () => {
            await markAsNotRecorded(
                activity?.id,
                activity?.application_id,
                feedback,
                year,
                month,
                status,
                sort,
                onRefresh
            );
            await onClose(false);
            setAction("");
            setIsRevoked(false);
            setMethod("");
            setFeedback("");
            setRenderedHours("");
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (action === "approve") {
                handleApprove();
            } else if (action === "reject") {
                handleReject();
            }
            setAction("");
            setIsRevoked(false);
            setMethod("");
            setFeedback("");
            setRenderedHours("");
        };

        const [selectedPdf, setSelectedPdf] = useState(null);
        const isPdf = (type) => type === "application/pdf";
        const isImage = (type) => type && type.startsWith("image/");

        const removeFile = (index) => {
            setFilePreviews((prev) => prev.filter((_, i) => i !== index));
        };

        const openPdfViewer = (filePreview) => {
            setSelectedPdf(filePreview);
        };

        const closePdfViewer = () => {
            setSelectedPdf(null);
        };

        return (
            <div>
                {isOpen && (
                    <div
                        className={`fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-in fade-in duration-200 ${
                            isOpen ? "block" : "hidden"
                        }`}
                        // onKeyDown={handleKeyDown}
                        // onClick={handleBackdropClick}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <div
                            className={`
                        relative bg-white rounded-sm shadow-2xl w-full
                        sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[35%]
                        transition-transform duration-300
                        ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}

                        absolute bottom-0 sm:relative sm:bottom-auto flex flex-col h-auto
                    `}
                        >
                            {/* Header */}
                            <div className="relative px-4 py-4 rounded-t-sm border-b bg-gray-100 border-slate-200">
                                <h2
                                    id="modal-title"
                                    className="text-sm text-slate-700 pr-10 leading-tight"
                                >
                                    {activity?.activity_name}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsRevoked(false);
                                        onClose(false);
                                    }}
                                    className="absolute top-2 right-4 p-2 text-slate-700 rounded-full hover:bg-gray-100 active:ring-1 active:ring-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    aria-label="Close modal"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Content */}
                            <form
                                onSubmit={handleSubmit}
                                className="max-h-[550px] overflow-y-auto scroll-smooth "
                            >
                                {/* Event Details Grid */}
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-2 sm:gap-4 gap-6 text-xs">
                                        <div className="space-y-3">
                                            <div className="flex items-center text-slate-600">
                                                <Calendar className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                                <span className="text-slate-700 font-medium">
                                                    {formatDate(
                                                        activity?.activity_date
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-center text-slate-600">
                                                <MapPin className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                                <span className="text-slate-700 font-medium truncate">
                                                    {
                                                        activity?.activity_location
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center text-slate-600">
                                                <Clock className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                                <span className="text-slate-700 font-medium">
                                                    {formatTime(
                                                        activity?.start_time
                                                    )}{" "}
                                                    -{" "}
                                                    {formatTime(
                                                        activity?.end_time
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-center text-slate-600">
                                                {activity?.activity_status ===
                                                "Pending" ? (
                                                    <CircleAlert className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                                )}
                                                <span>
                                                    {activity?.activity_status ===
                                                    "Pending"
                                                        ? "Pending"
                                                        : "Recorded"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {filePreviews.length > 0 && (
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-1 text-sm text-gray-700">
                                            {filePreviews.map(
                                                (filePreview, index) => (
                                                    <li
                                                        key={
                                                            filePreview.id ||
                                                            index
                                                        }
                                                        className="p-2 bg-gray-50 rounded-lg flex justify-between text-xs items-center text-gray-500 border"
                                                    >
                                                        <div className="flex items-center">
                                                            {/* PDF Preview */}
                                                            {isPdf(
                                                                filePreview.file_type
                                                            ) && (
                                                                <div className="w-12 h-12 bg-red-100 rounded mr-2 flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors">
                                                                    <svg
                                                                        onClick={() =>
                                                                            openPdfViewer(
                                                                                filePreview
                                                                            )
                                                                        }
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-6 w-6 text-red-600"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={
                                                                                2
                                                                            }
                                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            )}

                                                            {/* Image Preview */}
                                                            {isImage(
                                                                filePreview.file_type
                                                            ) && (
                                                                <img
                                                                    src={`${URL}/${filePreview.file_path}`}
                                                                    alt={
                                                                        filePreview.file_name
                                                                    }
                                                                    className="w-12 h-12 object-cover rounded mr-2"
                                                                />
                                                            )}

                                                            <div className="flex-1">
                                                                <div className="font-medium text-gray-700 flex items-center">
                                                                    {
                                                                        filePreview.file_name
                                                                    }
                                                                    {/* {isPdf(
                                                    filePreview.file_type
                                                ) && (
                                                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                                        PDF
                                                    </span>
                                                )} */}
                                                                </div>
                                                                {/* <div className="text-gray-500">
                                                    {(
                                                        filePreview.size / 1024
                                                    ).toFixed(2)}{" "}
                                                    KB
                                                </div> */}
                                                                {/* {isPdf(filePreview.type) && (
                                        <button
                                            onClick={() => openPdfViewer(filePreview)}
                                            className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                                        >
                                            Click to view PDF
                                        </button>
                                    )} */}
                                                                {isPdf(
                                                                    filePreview.file_type
                                                                ) && (
                                                                    <button
                                                                        onClick={() =>
                                                                            window.open(
                                                                                URL +
                                                                                    filePreview.file_path,
                                                                                "_blank"
                                                                            )
                                                                        }
                                                                        className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                                                                    >
                                                                        Click to
                                                                        view PDF
                                                                    </button>
                                                                )}
                                                                {isImage(
                                                                    filePreview.file_type
                                                                ) && (
                                                                    <button
                                                                        onClick={() =>
                                                                            window.open(
                                                                                URL +
                                                                                    filePreview.file_path,
                                                                                "_blank"
                                                                            )
                                                                        }
                                                                        className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                                                                    >
                                                                        Click to
                                                                        view
                                                                        image
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* <button
                                        onClick={() => removeFile(index)}
                                        className="hover:text-red-700 text-red-500 p-1 ml-2"
                                        type="button"
                                        // disabled={isSubmitting}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 6l12 12M18 6l-12 12"
                                            />
                                        </svg>
                                    </button> */}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}

                                    <div
                                        className={`${!isRevoked && isStaff && activity?.status === "Pending" ? "block" : "hidden"}`}
                                    >
                                        <h3 className="text-xs mb-2 text-gray-700">
                                            Choose Action:
                                        </h3>
                                        <div className="block mb-2 relative p-4 border rounded-lg bg-gray-50/50 border-gray-200">
                                            <label className="mb-1 text-xs text-slate-600 flex gap-2 items-center">
                                                <input
                                                    value={action}
                                                    onChange={() => {
                                                        setAction("approve");
                                                    }}
                                                    name="action"
                                                    type="radio"
                                                    className="accent-green-600"
                                                />
                                                Approve
                                            </label>
                                            <label className="text-xs text-slate-600 flex gap-2 items-center">
                                                <input
                                                    value={action}
                                                    onChange={() => {
                                                        setAction("reject");
                                                    }}
                                                    name="action"
                                                    type="radio"
                                                    className="accent-green-600"
                                                />
                                                Reject
                                            </label>
                                        </div>
                                    </div>

                                    <div
                                        className={`${
                                            (isStaff && isRevoked) ||
                                            (activity?.status === "Pending" &&
                                                !isRevoked)
                                                ? "block"
                                                : "hidden"
                                        } relative`}
                                    >
                                        <h3
                                            className={`${action === "approve" || (isRevoked && activity?.status === "Not Recorded") ? "block" : "hidden"} text-xs mb-2 text-gray-700`}
                                        >
                                            Rendered Hours:
                                        </h3>
                                        <div
                                            className={`${action === "approve" || (isRevoked && activity?.status === "Not Recorded") ? "block" : "hidden"} p-4 border rounded-lg bg-gray-50/50 border-gray-200`}
                                        >
                                            <div
                                                className={`block relative ${method === "manual" ? "mb-4" : "mb-0"}`}
                                            >
                                                <label className="mb-1 text-xs text-slate-600 flex gap-2 items-center">
                                                    <input
                                                        value={method}
                                                        onChange={() =>
                                                            setMethod(
                                                                "automatic"
                                                            )
                                                        }
                                                        name="rendered"
                                                        type="radio"
                                                        className="accent-green-600"
                                                    />
                                                    Based on the event's start
                                                    and end time
                                                </label>
                                                <label className="text-xs text-slate-600 flex gap-2 items-center">
                                                    <input
                                                        value={method}
                                                        onChange={() =>
                                                            setMethod("manual")
                                                        }
                                                        name="rendered"
                                                        type="radio"
                                                        className="accent-green-600"
                                                    />
                                                    Enter number of hour(s)
                                                    manually
                                                </label>
                                            </div>

                                            {method === "manual" && (
                                                <div className="block mb-2 relative">
                                                    <label className="block mb-1 text-gray-600 text-xs">
                                                        Rendered Hours
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={renderedHours}
                                                        onChange={(e) =>
                                                            setRenderedHours(
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                        placeholder="Enter number of hours"
                                                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6">
                                            <label className="block mb-1 text-gray-600 text-xs">
                                                Feedback{" "}
                                                <span className="font-normal text-[10px] italic">
                                                    (Optional for approval,
                                                    required for rejection)
                                                </span>
                                            </label>
                                            <textarea
                                                rows={5}
                                                placeholder="Enter feedback"
                                                value={feedback}
                                                onChange={(e) =>
                                                    setFeedback(e.target.value)
                                                }
                                                className="w-full resize-none border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                                required={
                                                    action === "reject" ||
                                                    (isRevoked &&
                                                        activity?.status ===
                                                            "Recorded")
                                                }
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2 p-3.5 border-t border-gray-300">
                                    <button
                                        onClick={() => {
                                            onClose(false);
                                            setIsRevoked(false);
                                            setAction("");
                                        }}
                                        type="button"
                                        className="w-[20%] text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors duration-200"
                                    >
                                        Close
                                    </button>
                                    {!isRevoked &&
                                    activity?.status === "Pending" ? (
                                        <button
                                            type="submit"
                                            className={`w-[20%] text-sm  text-white px-4 py-2 rounded-lg font-medium  transition-colors duration-200 ${action === "" ? "bg-green-400" : "bg-green-600 hover:bg-green-700"} ${
                                                isStaff ? "block" : "hidden"
                                            }`}
                                            disabled={action === ""}
                                        >
                                            {isLoading
                                                ? "Confirming..."
                                                : "Confirm"}
                                        </button>
                                    ) : isRevoked &&
                                      activity?.status === "Recorded" ? (
                                        <button
                                            onClick={handleReject}
                                            type="button"
                                            className={`w-[20%] text-sm  text-white px-4 py-2 rounded-lg font-medium  transition-colors duration-200 bg-green-600 hover:bg-green-700 ${
                                                isStaff ? "block" : "hidden"
                                            }`}
                                        >
                                            {isLoading
                                                ? "Confirming..."
                                                : "Confirm"}
                                        </button>
                                    ) : isRevoked &&
                                      activity?.status === "Not Recorded" ? (
                                        <button
                                            onClick={handleApprove}
                                            type="button"
                                            className={`w-[20%] text-sm  text-white px-4 py-2 rounded-lg font-medium  transition-colors duration-200 ${
                                                isStaff ? "block" : "hidden"
                                            } ${method === "" ? "bg-green-400" : "bg-green-600 hover:bg-green-700"}`}
                                            disabled={method === ""}
                                        >
                                            {isLoading
                                                ? "Confirming..."
                                                : "Confirm"}
                                        </button>
                                    ) : null}

                                    {(activity?.status === "Recorded" ||
                                        activity?.status === "Not Recorded") &&
                                        !isRevoked &&
                                        isStaff && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setIsRevoked(true);
                                                        setAction("reject");
                                                    }}
                                                    type="submit"
                                                    className={`w-[35%] text-sm bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200 ${
                                                        isStaff &&
                                                        activity?.status ===
                                                            "Recorded" &&
                                                        !isRevoked
                                                            ? "block"
                                                            : "hidden"
                                                    }`}
                                                >
                                                    Revoke Approval
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setIsRevoked(true);
                                                        setAction("approve");
                                                    }}
                                                    type="submit"
                                                    className={`w-[35%] text-sm bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200 ${
                                                        isStaff &&
                                                        activity?.status ===
                                                            "Not Recorded" &&
                                                        !isRevoked
                                                            ? "block"
                                                            : "hidden"
                                                    }`}
                                                >
                                                    Revoke Rejection
                                                </button>
                                            </>
                                        )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

export default CommunityServiceDetailsModal;
