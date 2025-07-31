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

const CommunityServiceDetailsModal = React.memo(
    ({
        isOpen,
        onClose,
        activity,
        isStaff = false,
        onRefresh,
        activeTab,
        year,
        month,
    }) => {
        const URL = "http://localhost:8000/public/";
        const [filePreviews, setFilePreviews] = useState([]);

        const { recordCommunityServiceHours } = useRecordHours();

        useEffect(() => {
            // Reset file previews when scholar data changes
            if (activity && activity?.files) {
                setFilePreviews(activity?.files);
            }
        }, [activity]);

        const handleRecord = async () => {
            const startTime = convertTo24HourFormat(activity?.start_time).split(
                ":"
            );
            const endTime = convertTo24HourFormat(activity?.end_time).split(
                ":"
            );
            const renderedHours = endTime[0] - startTime[0];

            console.log(renderedHours);

            await recordCommunityServiceHours(
                activity?.id,
                activity?.application_id,
                renderedHours,
                onRefresh,
                activeTab,
                year,
                month
            );
            await onClose(false);
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
                        <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="relative px-6 py-4 border-b border-slate-200">
                                <h2
                                    id="modal-title"
                                    className="text-xl text-slate-700 pr-10 leading-tight"
                                >
                                    {activity?.activity_name}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => onClose(false)}
                                    className="absolute top-3 right-4 p-2 text-slate-700 rounded-full hover:bg-gray-100 active:ring-1 active:ring-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    aria-label="Close modal"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="max-h-[400px] overflow-y-auto scroll-smooth p-6 space-y-6">
                                {/* Event Details Grid */}
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
                                                {activity?.activity_location}
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
                                                {formatTime(activity?.end_time)}
                                            </span>
                                        </div>

                                        <div className="flex items-center text-slate-600">
                                            {activity?.status === "Pending" ? (
                                                <CircleAlert className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                            )}
                                            <span>
                                                {activity?.status === "Pending"
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
                                                        filePreview.id || index
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
                                                                    view image
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

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => onClose(false)}
                                        type="button"
                                        className="flex-1 text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors duration-200"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleRecord}
                                        type="button"
                                        className={`flex-1 text-sm bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 ${
                                            isStaff ? "block" : "hidden"
                                        }`}
                                    >
                                        Record
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

export default CommunityServiceDetailsModal;
