import { X } from "lucide-react";
import React from "react";

const InputModal = React.memo(
    ({
        label,
        isOpen,
        isEditing = false,
        onClose,
        onEdit,
        resetFields,
        children,
    }) => {
        const handleClose = () => {
            if (isEditing) {
                onEdit(false);
            }
            resetFields();
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
                            {label}
                        </h2>
                        <button
                            type="button"
                            onClick={() => handleClose()}
                            className="absolute top-3 right-4 p-2 text-slate-700 rounded-full hover:bg-gray-100 active:ring-1 active:ring-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {children}
                </div>
            </div>
        );
    }
);

export default InputModal;
