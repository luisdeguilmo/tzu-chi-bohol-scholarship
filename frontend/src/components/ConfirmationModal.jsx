import { X } from "lucide-react";
import React from "react";
import { useRecordHours } from "../hooks/useRecordHours";
import { toast } from "react-toastify";

const ConfirmationModal = React.memo(
    ({
        isOpen,
        onClose,
        participants,
        selectedScholars,
        renderedHours,
        eventId,
    }) => {
        const filteredParticipants = participants?.filter((participant) =>
            selectedScholars.includes(participant.scholar_id)
        );

        const { recordEventHours } = useRecordHours();

        const handleRecordHours = async () => {
            const success = await recordEventHours(
                eventId,
                renderedHours,
                selectedScholars
            );
            console.log(success);
            if (success) {
                toast.success("Recorded Successfully");
                await onClose(false);
            }
        };

        return (
            <div
                className={`fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4 animate-in fade-in duration-200 ${
                    isOpen ? "block" : "hidden"
                }`}
                // onKeyDown={handleKeyDown}
                // onClick={handleBackdropClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="relative w-full scroll-smooth sm:w-[60%] md:[45%] lg:w-[40%] xl:w-[30%] bg-white rounded-xl shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="relative px-6 py-4 border-b border-slate-200">
                        <h2
                            id="modal-title"
                            className="text-lg text-slate-700 pr-10 leading-tight"
                        >
                            Confirmation
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
                    <div className="max-h-[400px] overflow-y-auto scroll-smooth p-6">
                        <div>
                            <h3 className="text-xs text-gray-700 font-bold">
                                Selected Scholars:
                            </h3>
                            <ul
                                className={`mt-4 grid gap-1 ${
                                    filteredParticipants?.length >= 15
                                        ? "grid-cols-2"
                                        : "grid-cols-1"
                                }`}
                            >
                                {filteredParticipants?.map(
                                    (participant, index) => (
                                        <li
                                            key={index}
                                            className="w-[max-content]"
                                        >
                                            <label className="flex gap-2 items-center text-slate-600 text-xs">
                                                <span>
                                                    {
                                                        participant.participant_name
                                                    }
                                                </span>
                                            </label>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div className="pt-4">
                            <span className="text-xs text-gray-700 font-bold">
                                Rendered Hours:
                            </span>
                            <span className="ml-2 text-xs text-slate-700">
                                {renderedHours}{" "}
                                {renderedHours > 1 ? "hours" : "hour"}
                            </span>
                        </div>

                        {/* Action Buttons */}
                    </div>
                    <div className="p-4 flex flex-col sm:flex-row gap-3 border-t border-slate-200">
                        <button
                            onClick={() => onClose(false)}
                            type="button"
                            className="flex-1 text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors duration-200"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleRecordHours}
                            type="button"
                            className="flex-1 text-sm text-white bg-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
    }
);

export default ConfirmationModal;
