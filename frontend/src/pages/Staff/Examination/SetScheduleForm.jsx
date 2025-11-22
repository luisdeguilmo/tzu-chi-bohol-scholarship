import { CalendarCog, Check, Mail, Pencil, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSchedule } from "../../../hooks/useSchedule";
import { manageApplication } from "../../../services/emailService";
import ConfirmationModal from "../../../components/ConfirmationModal";
import InputModal from "../../../components/InputModal";

export default function SetScheduleForm({
    applications,
    isOpen,
    setIsOpen,
    batches,
    selectedBatch,
    onSuccess,
}) {
    const [batchId, setBatchId] = useState(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [venue, setVenue] = useState("");
    const [editing, setEditing] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isEmailSentToAll, setIsEmailSentToAll] = useState(false);
    const [isInputChanged, setIsInputChanged] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const { loading, createSchedule } = useSchedule();
    const { isLoading, sendSchedule } = manageApplication();

    // Use useEffect to set the initial schedule value when component mounts or selectedBatch changes
    useEffect(() => {
        if (selectedBatch && batches) {
            const batch = batches.find(
                (batch) => batch.batch_name === selectedBatch
            );

            setIsEmailSentToAll(batch?.is_schedule_sent);

            if (batch && batch.schedule) {
                const dateAndTime = batch.schedule.split(" ");
                setDate(dateAndTime[0]);
                setTime(dateAndTime[1]);
                setVenue(batch.venue || "");
                setBatchId(batch.id);
                setEditing(true);
            } else {
                setBatchId(null);
                setDate("");
                setTime("");
                setVenue("");
                setEditing(false);
            }
        }
    }, [selectedBatch, batches]);

    const handleSubmit = async () => {
        const batchToSet = batches.find(
            (batch) => batch.batch_name === selectedBatch
        );

        const success = await createSchedule(
            "entrance_examination",
            date,
            time,
            venue,
            batchToSet,
            onSuccess,
            setIsOpen,
            batchId,
            applications,
            selectedBatch
        );

        if (success) {
            setIsOpen(false);
        }
    };

    const handleSendSchedule = async () => {
        if (date === "" || time === "" || venue === "") {
            toast.error("Please set the schedule first.");
            return;
        }

        const success = await sendSchedule(
            batchId,
            applications,
            date,
            time,
            venue,
            selectedBatch
        );

        if (success) {
            setIsEmailSent(true);
            setIsFormModalOpen(false);
        }
    };

    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        setIsOpen(false);
        setIsEmailSent(false);
    };

    const resetFields = () => {
        setDate("");
        setTime("");
        setVenue("");
    };

    // Helper function to check if batch has schedule (no state updates)
    const hasSchedule = () => {
        if (!selectedBatch || !batches) return false;
        const batch = batches.find(
            (batch) => batch.batch_name === selectedBatch
        );
        return batch && batch.schedule;
    };

    return (
        <>
            <div>
                <button
                    onClick={() => setIsOpen(true)}
                    title={hasSchedule() ? "Edit Schedule" : "Set Schedule"}
                    className="p-2 bg-blue-600 text-xs rounded-lg hover:bg-blue-700 transition-colors flex items-center text-white"
                >
                    <Pencil className="w-4 h-4 mr-1" />
                    {hasSchedule() ? "Edit Schedule" : "Set Schedule"}
                </button>

                <InputModal
                    label={hasSchedule() ? "Edit Schedule" : "Set Schedule"}
                    isOpen={isOpen}
                    onClose={setIsOpen}
                    buttonLabel={editing ? "Save Changes" : "Save"}
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                >
                    {/* Content */}
                    <div className="p-6 space-y-4">
                        {/* Start Date Input */}
                        <div>
                            <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                                Batch
                                <input
                                    readOnly
                                    type="text"
                                    value={selectedBatch}
                                    className="w-full border border-gray-300 rounded-md px-2 py-2.5 focus:outline-none"
                                />
                            </label>
                            <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                                Date
                                <input
                                    required
                                    type="date"
                                    value={date}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        setIsInputChanged(true);
                                    }}
                                    className="w-full border border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </label>
                            <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                                Time
                                <input
                                    required
                                    type="time"
                                    value={time}
                                    onChange={(e) => {
                                        setTime(e.target.value);
                                        setIsInputChanged(true);
                                    }}
                                    className="w-full border border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </label>
                            <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                                Venue
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter venue"
                                    value={venue}
                                    onChange={(e) => {
                                        setVenue(e.target.value);
                                        setIsInputChanged(true);
                                    }}
                                    className="w-full border border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </label>

                            {/* <SendEmailButton
                                isFullWidth={true}
                                isEmailSent={isEmailSent}
                                isLoading={isLoading}
                                onSendSchedule={() => {
                                    if (isEmailSentToAll) {
                                        setIsFormModalOpen(true);
                                    } else {
                                        handleSendSchedule();
                                    }
                                }}
                            /> */}
                        </div>
                    </div>
                </InputModal>
            </div>

            <ConfirmationModal
                isOpen={isFormModalOpen}
                onClose={setIsFormModalOpen}
                isLoading={isLoading}
                label={"Confirmation"}
                message={
                    "The schedule has already been sent. Do you want to send it again?"
                }
                onClick={() => {
                    handleSendSchedule();
                    setIsFormModalOpen(false);
                }}
                removeBackground={true}
            />
        </>
    );
}
