import { CalendarCog, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSchedule } from "../../../hooks/useSchedule";

export default function SetScheduleForm({
    isOpen,
    setIsOpen,
    batches,
    selectedBatch,
    onSuccess,
}) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [editing, setEditing] = useState(false);
    const { createSchedule } = useSchedule();

    // Use useEffect to set the initial schedule value when component mounts or selectedBatch changes
    useEffect(() => {
        if (selectedBatch && batches) {
            const batch = batches.find(
                (batch) => batch.batch_name === selectedBatch
            );
            if (batch && batch.schedule) {
                const dateAndTime = batch.schedule.split(" ");
                setDate(dateAndTime[0]);
                setTime(dateAndTime[1]);
                setEditing(true);
            } else {
                setDate("");
                setTime("");
                setEditing(false);
            }
        }
    }, [selectedBatch, batches]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const batchToSet = batches.find(
            (batch) => batch.batch_name === selectedBatch
        );

        await createSchedule(
            date,
            time,
            setDate,
            setTime,
            batchToSet,
            onSuccess,
            setIsOpen
        );
    };

    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        setIsOpen(false);
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
        <div>
            <button
                onClick={() => setIsOpen(true)}
                title={hasSchedule() ? "Edit Schedule" : "Set Schedule"}
                className="text-green-600 text-xs rounded-lg hover:underline transition-colors flex items-center"
            >
                <CalendarCog className="w-4 h-4 mr-1" />
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
                            onClick={() => setIsOpen(false)}
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
                            <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
                                Batch
                                <input
                                    readOnly
                                    type="text"
                                    value={selectedBatch}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
                                />
                            </label>
                            <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
                                Date
                                <input
                                    required
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </label>
                            <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
                                Time
                                <input
                                    required
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 text-sm">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className={`w-full py-2 px-4 rounded-lg shadow-sm focus:outline-none bg-gray-200 text-gray-500`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`w-full py-2 px-4 rounded-lg shadow-sm focus:outline-none bg-green-600 text-white hover:bg-green-700`}
                            >
                                {editing ? "Update" : "Set"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
