import { useState } from "react";
import InputModal from "../../../components/InputModal";
import { toast } from "react-toastify";
import { useStaffAccounts } from "../../../hooks/useStaffAccounts";
import { numbersOnly } from "../../../utils/inputValidations";
import {
    AddExistingScholarSection,
    ApplicationSection,
    RenewalApplicationSection,
} from "../../Home/ApplicationSection";
import { X } from "lucide-react";

const AddScholarModal = ({ label, isOpen, onClose }) => {
    return (
        <div
            className={`fixed top-0 left-0 w-full h-full inset-0 z-50 flex items-center justify-center bg-black transition-all duration-200
                    bg-opacity-70
                    ${isOpen ? "visible opacity-100" : "invisible opacity-0"}
                `}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Modal Container */}
            <div
                // onSubmit={handleSubmit}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-white shadow-2xl rounded-sm w-full sm:w-[90%] md:w-[70%] lg:w-[80%] xl:w-[90%] flex flex-col`}
            >
                {/* Header */}
                <div className="relative px-4 py-4 rounded-t-sm border-b flex-shrink-0">
                    <h2
                        id="modal-title"
                        className="text-sm font-medium text-slate-700 pr-10 leading-tight"
                    >
                        {label}
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
                <div
                    // onSubmit={(e) => {
                    //     e.preventDefault();
                    //     handleSubmit();
                    // }}
                    className="overflow-y-scroll h-[80vh]"
                >
                    <AddExistingScholarSection onClose={onClose} />
                </div>
            </div>
        </div>
    );
};

export default AddScholarModal;
