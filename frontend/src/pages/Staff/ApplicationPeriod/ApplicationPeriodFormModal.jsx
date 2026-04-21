import { X } from "lucide-react";
import React, { useState } from "react";
import { useApplicationPeriods } from "../../../hooks/useApplicationPeriods";
import { usePeriod } from "../../../context/PeriodContext";
import InputModal from "../../../components/InputModal";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { date } from "../../../utils/getDateAndTime";
import { numbersOnly, validateSchoolYear } from "../../../utils/inputValidations";

const ApplicationPeriodFormModal = React.memo(
    ({
        isOpen,
        onClose,
        onRefresh,
        selectedApplicationPeriod,
        disabledNew,
        disabledRenewal,
    }) => {
        const {
            isEditing,
            id,
            startDate,
            endDate,
            schoolYear,
            announcementMessage,
            type,
            status,
            setStartDate,
            setEndDate,
            setSchoolYear,
            setAnnouncementMessage,
            setType,
            setStatus,
            setIsEditing,
        } = usePeriod();

        const [isFormModalOpen, setIsFormModalOpen] = useState(false);
        const [isSubmitting, setIsSubmitting] = useState(false);

        const { loading, createApplicationPeriod, editApplicationPeriod } =
            useApplicationPeriods();

        const handleCreateApplicationPeriod = async () => {
            if (type === "new" && disabledNew) {
                toast.error(
                    "Cannot create new application periods while there is an active period.",
                );
                return;
            } else if (type === "renewal" && disabledRenewal) {
                toast.error(
                    "Cannot create renewal application periods while there is an active period.",
                );
                return;
            }

            try {
                setIsSubmitting(true);

                const success = await createApplicationPeriod(
                    startDate,
                    endDate,
                    schoolYear,
                    announcementMessage,
                    status,
                    type,
                );

                if (success) {
                    resetFields();
                }

                await onRefresh();
            } catch (error) {
            } finally {
                setIsSubmitting(false);
            }
        };

        const handleEditApplicationPeriod = async () => {
            try {
                setIsSubmitting(true);

                await editApplicationPeriod(
                    id,
                    startDate,
                    endDate,
                    schoolYear,
                    announcementMessage,
                    status,
                    type === "new" ? type : selectedApplicationPeriod,
                );
                setIsEditing(false);
                await onRefresh();
            } catch (error) {
            } finally {
                setIsSubmitting(false);
            }
        };

        const resetFields = () => {
            setStartDate("");
            setEndDate("");
            setSchoolYear("");
            setAnnouncementMessage("");
            setType("");
            setStatus("");
        };

        const handleCancel = (e) => {
            e.preventDefault(); // Prevent form submission
            resetFields();
            setIsEditing(false);
        };

        const handleSubmit = () => {
            if (isEditing) {
                handleEditApplicationPeriod();
            } else {
                handleCreateApplicationPeriod();
            }
            onClose(false);
            setIsFormModalOpen(false);
        };

        return (
            <>
                <InputModal
                    label={
                        isEditing
                            ? "Edit Application Period"
                            : "New Application Period"
                    }
                    isOpen={isOpen}
                    isEditing={isEditing}
                    onEdit={setIsEditing}
                    resetFields={resetFields}
                    onClose={onClose}
                    onCancel={handleCancel}
                    onSubmit={status === "Closed" && handleSubmit}
                    disabledButton={status === "Active"}
                    buttonLabel={isEditing ? "Save Changes" : "Save"}
                    isLoading={loading}
                >
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
                                className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                                className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                            />
                        </div>

                        <div className="block mb-2 relative">
                            <label className="block mb-1 text-gray-600 text-xs">
                                School Year
                            </label>
                            <input
                                type="text"
                                value={schoolYear}
                                onChange={(e) => {
                                    const value = validateSchoolYear(e.target.value);

                                    setSchoolYear(value);
                                }}
                                placeholder="School Year"
                                className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                                className="w-full border resize-none text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                placeholder="Enter announcement message"
                                required
                            ></textarea>
                        </div>

                        {!isEditing && (
                            <div className="block mb-2">
                                <label className="text-gray-600 text-xs block mt-[-2px] mb-1">
                                    Type
                                </label>
                                <div className="flex space-x-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="typeNew"
                                            name="type"
                                            value="new"
                                            checked={type === "new"}
                                            onChange={() => setType("new")}
                                            className="h-4 w-4 accent-green-600 focus:ring-green-500 border-gray-300"
                                        />
                                        <label
                                            htmlFor="typeNew"
                                            className="ml-2 block text-xs text-gray-700"
                                        >
                                            New
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="typeRenewal"
                                            name="type"
                                            value="renewal"
                                            checked={type === "renewal"}
                                            onChange={() => setType("renewal")}
                                            className="h-4 w-4 accent-green-600 focus:ring-green-500 border-gray-300"
                                        />
                                        <label
                                            htmlFor="typeRenewal"
                                            className="ml-2 block text-xs text-gray-700"
                                        >
                                            Renewal
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

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

                    {status === "Active" && (
                        <div className="flex justify-end gap-2 p-3.5 border-t border-gray-300 bg-gray-50 flex-shrink-0">
                            <button
                                onClick={handleCancel}
                                type="button"
                                className="ml-auto bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    status === "Active" &&
                                    selectedApplicationPeriod === "renewal"
                                        ? setIsFormModalOpen(true)
                                        : handleSubmit();
                                }}
                                type="button"
                                disabled={isSubmitting}
                                className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
                            >
                                {isEditing ? "Save Changes" : "Save"}
                            </button>
                        </div>
                    )}
                </InputModal>

                <ConfirmationModal
                    isOpen={isFormModalOpen}
                    onClose={setIsFormModalOpen}
                    isLoading={loading}
                    label={"Confirmation"}
                    removeBackground={true}
                    message={
                        status === "Active" &&
                        selectedApplicationPeriod === "renewal" &&
                        "Activating a renewal period will mark all current scholars as Not Renewed. This action cannot be undone. Proceed?"
                    }
                    onClick={handleSubmit}
                />
            </>
        );
    },
);

export default ApplicationPeriodFormModal;
