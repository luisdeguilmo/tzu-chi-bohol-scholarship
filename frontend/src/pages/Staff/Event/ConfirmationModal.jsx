import { X } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";
import { useRecordHours } from "../../../hooks/useRecordHours";

const ConfirmationModal = React.memo(
    ({
        isOpen,
        onClose,
        event,
        participants,
        selectedScholars,
        renderedHours,
        eventId,
        onRecordSuccess,
    }) => {
        const filteredParticipants = participants?.filter((participant) =>
            selectedScholars.includes(participant.scholar_id)
        );

        const { recordEventHours } = useRecordHours();

        const handleRecordHours = async () => {
            const success = await recordEventHours(
                event,
                renderedHours,
                selectedScholars
            );
            if (success) {
                toast.success("Recorded Successfully");
                // Call the success callback to refresh the parent modal
                if (onRecordSuccess) {
                    onRecordSuccess();
                }
            }
        };

        return (
            <div
                className={`fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30 animate-in fade-in duration-200 ${
                    isOpen ? "block" : "hidden"
                }`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div
                    className={`relative w-full
                        sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[35%]
                        transition-transform duration-300 bg-white shadow-2xl overflow-hidden transform animate-in zoom-in-95 bottom-0 sm:relative sm:bottom-auto flex flex-col`}
                >
                    {/* Header */}
                    <div className="relative px-4 py-4 bg-gray-100 border-b border-gray-300 flex-shrink-0">
                        <h2
                            id="modal-title"
                            className="text-sm font-medium text-slate-700 pr-10 leading-tight"
                        >
                            Confirm
                        </h2>
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="absolute top-2 right-4 p-2 text-slate-700 rounded-full hover:bg-gray-200 active:ring-1 active:ring-gray-300 transition"
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="max-h-[400px] overflow-y-auto scroll-smooth p-6">
                        <div>
                            <h3 className="text-xs text-gray-700">
                                Selected Scholars:
                            </h3>
                            <ul
                                className={`mt-2 gap-1 grid ${
                                    filteredParticipants?.length >= 15
                                        ? "grid-cols-2"
                                        : "grid-cols-1"
                                } p-3 border rounded-md bg-gray-50/50 border-gray-200`}
                            >
                                {filteredParticipants?.map(
                                    (participant, index) => (
                                        <li
                                            key={index}
                                            className="w-[max-content]"
                                        >
                                            <p className="flex gap-2 items-center text-slate-600 text-xs">
                                                <span>
                                                    {
                                                        participant.participant_name
                                                    }
                                                </span>
                                            </p>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div className="pt-2">
                            <span className="text-xs text-gray-700">
                                Rendered Hours:
                                <p className="rounded-lg mt-1 border px-3 py-2.5 text-xs text-slate-700">
                                    {renderedHours}{" "}
                                    {renderedHours > 1 ? "hours" : "hour"}
                                </p>
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 p-3.5 border-t border-gray-300 bg-gray-50 flex-shrink-0">
                        <button
                            onClick={() => onClose(false)}
                            type="button"
                            className="bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleRecordHours}
                            type="button"
                            className="text-sm text-white bg-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
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
