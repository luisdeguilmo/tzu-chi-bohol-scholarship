import { X } from "lucide-react";
import React from "react";
import { useApplicationPeriods } from "../../../hooks/useApplicationPeriods";
import { usePeriod } from "../../../context/PeriodContext";

const ApplicationPeriodFormModal = React.memo(
    ({ isOpen, onClose, onRefresh, disabled }) => {
        const {
            isEditing,
            id,
            startDate,
            endDate,
            announcementMessage,
            status,
            setStartDate,
            setEndDate,
            setAnnouncementMessage,
            setStatus,
            setIsEditing,
        } = usePeriod();

        const { createApplicationPeriod, editApplicationPeriod } =
            useApplicationPeriods();

        const handleCreateApplicationPeriod = async () => {
            await createApplicationPeriod(
                startDate,
                endDate,
                announcementMessage
            );
            await onRefresh();
        };

        const handleEditApplicationPeriod = async () => {
            await editApplicationPeriod(
                id,
                startDate,
                endDate,
                announcementMessage,
                status
            );
            setIsEditing(false);
            await onRefresh();
        };

        const handleCancel = (e) => {
            e.preventDefault(); // Prevent form submission
            setStartDate("");
            setEndDate("");
            setAnnouncementMessage("");
            setIsEditing(false);
        };

        const handleClose = () => {
            onClose(false);
            setIsEditing(false);
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (isEditing) {
                handleEditApplicationPeriod();
            } else {
                handleCreateApplicationPeriod();
            }
            onClose(false);
        };

        return (
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
                <div className="relative w-full sm:w-[60%] md:[45%] lg:w-[40%] xl:w-[30%] bg-white rounded-xl shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="relative px-6 py-4 border-b border-slate-200">
                        <h2
                            id="modal-title"
                            className="text-lg text-slate-700 pr-10 leading-tight"
                        >
                            {isEditing ? "Edit" : "New"} Application Period
                        </h2>
                        <button
                            type="button"
                            onClick={() => handleClose(false)}
                            className="absolute top-3 right-4 p-2 text-slate-700 rounded-full hover:bg-gray-100 active:ring-1 active:ring-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div
                        className={`${
                            !disabled
                                ? "hidden"
                                : isEditing
                                ? "hidden"
                                : "block"
                        } mx-8 mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400`}
                    >
                        <p className="text-yellow-700 text-sm">
                            Cannot create new application periods while there is
                            an active period.
                        </p>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-3">
                        {/* Start Date Input */}
                        <div className="block mb-2 relative">
                            <label className="block mb-1 text-gray-600 text-xs">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder="Start Date"
                                className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                            />
                        </div>

                        <div className="block mb-2 relative">
                            <label className="block mb-1 text-gray-600 text-xs">
                                End Date
                            </label>
                            <input
                                type="date"
                                min={startDate}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                placeholder="End Date"
                                className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                            />
                        </div>

                        <div className="block mb-2 relative">
                            <label className="block mb-1 text-gray-600 text-xs">
                                Announcement Message
                            </label>
                            <textarea
                                rows={5}
                                type="text"
                                value={announcementMessage}
                                onChange={(e) =>
                                    setAnnouncementMessage(e.target.value)
                                }
                                className="w-full border resize-none text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                placeholder="Enter announcement message"
                                required
                            ></textarea>
                        </div>

                        <div className="block mb-2">
                            <label className="text-gray-600 text-xs block mt-[-2px] mb-1">
                                Status
                            </label>
                            <div className="flex space-x-4">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="statusActive"
                                        name="status"
                                        value="Active"
                                        checked={status === "Active"}
                                        onChange={() => setStatus("Active")}
                                        className="h-4 w-4 accent-green-600 focus:ring-green-500 border-gray-300"
                                    />
                                    <label
                                        htmlFor="statusActive"
                                        className="ml-2 block text-xs text-gray-700"
                                    >
                                        Active
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="statusClosed"
                                        name="status"
                                        value="Closed"
                                        checked={status === "Closed"}
                                        onChange={() => setStatus("Closed")}
                                        className="h-4 w-4 accent-green-600 focus:ring-green-500 border-gray-300"
                                    />
                                    <label
                                        htmlFor="statusClosed"
                                        className="ml-2 block text-xs text-gray-700"
                                    >
                                        Closed
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 text-sm">
                            <button
                                type="button" // Explicitly set type to prevent form submission
                                onClick={handleCancel}
                                className="w-full py-2 px-4 rounded-lg shadow-sm focus:outline-none bg-gray-200 text-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`w-full py-2 px-4 rounded-lg shadow-sm focus:outline-none ${
                                    disabled && !isEditing
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-green-600 text-white hover:bg-green-700"
                                } transition-all`}
                                disabled={disabled && !isEditing}
                            >
                                {isEditing ? "Save" : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
);

export default ApplicationPeriodFormModal;
