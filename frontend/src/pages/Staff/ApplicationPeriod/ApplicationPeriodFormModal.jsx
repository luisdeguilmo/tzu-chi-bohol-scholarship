import { X } from "lucide-react";
import React from "react";
import { useApplicationPeriods } from "../../../hooks/useApplicationPeriods";
import { usePeriod } from "../../../context/PeriodContext";
import InputModal from "../../../components/InputModal";

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

        const { loading, createApplicationPeriod, editApplicationPeriod } =
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

        const handleSubmit = () => {
            if (isEditing) {
                handleEditApplicationPeriod();
            } else {
                handleCreateApplicationPeriod();
            }
            onClose(false);
        };

        return (
            <InputModal
                label={
                    isEditing ? "Edit Application Period" : "New Application Period"
                }
                isOpen={isOpen}
                isEditing={isEditing}
                onEdit={setIsEditing}
                resetFields={null}
                onClose={onClose}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                buttonLabel={isEditing ? "Save Changes" : "Save"}
                isLoading={loading}
            >
                <div
                    className={`${
                        !disabled ? "hidden" : isEditing ? "hidden" : "block"
                    } mx-8 mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400`}
                >
                    <p className="text-yellow-700 text-sm">
                        Cannot create new application periods while there is an
                        active period.
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
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
                </div>
            </InputModal>
        );
    }
);

export default ApplicationPeriodFormModal;
