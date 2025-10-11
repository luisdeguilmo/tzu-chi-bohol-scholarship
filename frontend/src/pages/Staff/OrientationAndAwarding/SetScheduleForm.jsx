import { Pencil, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSchedule } from "../../../hooks/useSchedule";
import { manageApplication } from "../../../services/emailService";
import SendEmailButton from "./SendEmailButtton";
import ConfirmationModal from "../../../components/ConfirmationModal";

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
    const { createSchedule } = useSchedule();
    const { isLoading, sendSchedule } = manageApplication();

    console.log("Selected Batch in SetScheduleForm:", selectedBatch);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const batchToSet = batches.find(
            (batch) => batch.batch_name === selectedBatch
        );

        const success = await createSchedule(
            "orientation",
            date,
            time,
            venue,
            setDate,
            setTime,
            batchToSet,
            onSuccess,
            setIsOpen
        );

        if (success) {
            setIsInputChanged(false);
            setIsEmailSent(false);
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
                                {editing ? "Update Schedule" : "Set Schedule"}
                            </h2>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsEmailSent(false);
                                    setIsInputChanged(false);
                                }}
                                className="absolute top-3 right-4 p-2 text-slate-700 rounded-full hover:bg-gray-100 active:ring-1 active:ring-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                aria-label="Close modal"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Start Date Input */}
                            <div>
                                <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                                    Batch
                                    <input
                                        readOnly
                                        type="text"
                                        value={selectedBatch}
                                        className="w-full border border-gray-300 rounded-md py-2.5 px-2 focus:outline-none"
                                    />
                                </label>
                                <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                                    Date *
                                    <input
                                        required
                                        type="date"
                                        value={date}
                                        onChange={(e) => {
                                            setDate(e.target.value);
                                            setIsInputChanged(true);
                                        }}
                                        className="w-full border border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    />
                                </label>
                                <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                                    Time *
                                    <input
                                        required
                                        type="time"
                                        value={time}
                                        onChange={(e) => {
                                            setTime(e.target.value);
                                            setIsInputChanged(true);
                                        }}
                                        className="w-full border border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    />
                                </label>
                                <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                                    Venue *
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter venue"
                                        value={venue}
                                        onChange={(e) => {
                                            setVenue(e.target.value);
                                            setIsInputChanged(true);
                                        }}
                                        className="w-full border border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    />
                                </label>

                                <SendEmailButton
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
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 text-sm">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className={`w-full py-2.5 px-2 rounded-lg shadow-sm focus:outline-none bg-gray-200 text-gray-500`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`w-full py-2.5 px-2 rounded-lg shadow-sm focus:outline-none text-white ${
                                        editing && isInputChanged
                                            ? "bg-green-600 hover:bg-green-700"
                                            : editing && !isInputChanged
                                              ? "bg-green-400"
                                              : "bg-green-600 hover:bg-green-700"
                                    }`}
                                    disabled={editing && !isInputChanged}
                                >
                                    {editing ? "Save Changes" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
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
