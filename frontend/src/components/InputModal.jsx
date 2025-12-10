// import { X } from "lucide-react";
// import React from "react";

// const InputModal = React.memo(
//     ({
//         label,
//         isOpen,
//         isEditing = false,
//         onClose,
//         onEdit,
//         resetFields,
//         children,
//         expandable = false,
//         removeBackground = false,
//         onCancel,
//         onSubmit,
//         buttonLabel,
//         isLoading,
//     }) => {
//         const handleClose = () => {
//             if (isEditing) {
//                 onEdit(false);
//             }

//             if (resetFields) {
//                 resetFields();
//             }
//             onClose(false);
//         };

//         const handleSubmit = (e) => {
//             e.preventDefault();
//             onSubmit();
//         };

//         return (
//             <div
//                 className={`fixed z-50 inset-0 shadow-[0_0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center bg-black ${removeBackground ? "bg-opacity-0" : "bg-opacity-60"} p-4 animate-in fade-in duration-200 ${
//                     isOpen ? "block" : "hidden"
//                 }`}
//                 // onKeyDown={handleKeyDown}
//                 // onClick={handleBackdropClick}
//                 role="dialog"
//                 aria-modal="true"
//                 aria-labelledby="modal-title"
//             >
//                 <form
//                     onSubmit={handleSubmit}
//                     className={`relative w-[90%] ${
//                         expandable
//                             ? "sm:w-[70%] md:w-[80%] lg:w-[60%]"
//                             : "sm:w-[60%] md:[45%] lg:w-[40%] xl:w-[30%]"
//                     } ${removeBackground ? "shadow-[0_0_10px_2px_rgba(0,0,0,0.4)]" : ""} bg-white rounded-lg shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200`}
//                 >
//                     {/* Header */}
//                     <div className="relative px-4 py-4 bg-gray-100 border-b border-gray-300">
//                         <h2
//                             id="modal-title"
//                             className="text-sm text-slate-700 pr-10 leading-tight"
//                         >
//                             {label}
//                         </h2>
//                         <button
//                             type="button"
//                             onClick={() => handleClose()}
//                             className="absolute top-2 right-4 p-2 text-slate-700 rounded-full hover:bg-gray-100 active:ring-1 active:ring-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
//                             aria-label="Close modal"
//                         >
//                             <X size={18} />
//                         </button>
//                     </div>

//                     {children}

//                     <div className="flex justify-end gap-2 p-3.5 border-t border-gray-300">
//                         <button
//                             onClick={onCancel}
//                             type="button"
//                             className="ml-auto bg-gray-200 text-gray-500 text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
//                         >
//                             {isLoading
//                                 ? buttonLabel === "Save"
//                                     ? "Saving..."
//                                     : buttonLabel === "Confirm"
//                                       ? "Confirming..."
//                                       : buttonLabel === "Submit"
//                                         ? "Submitting..."
//                                         : buttonLabel === "Resubmit"
//                                           ? "Resubmitting..."
//                                           : buttonLabel === "Upload"
//                                             ? "Uploading..."
//                                             : "Saving Changes..."
//                                 : buttonLabel}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         );
//     }
// );

// export default InputModal;

import { X } from "lucide-react";
import React, { useState } from "react";

const InputModal = React.memo(
    ({
        label,
        isOpen,
        isEditing = false,
        onClose,
        onEdit,
        resetFields,
        children,
        isScholar = false,
        removeBackground = false,
        onCancel,
        onSubmit = false,
        buttonLabel,
        isLoading,
        disabledButton = false,
        disabledButtonSave = false,
        isSubmitting,
    }) => {
        const handleClose = () => {
            if (isEditing) onEdit(false);
            if (resetFields) resetFields();
            onClose(false);
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (onSubmit) {
                onSubmit();
            }
        };

        return (
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-all duration-200
                    ${removeBackground ? "bg-opacity-30" : "bg-opacity-70"}
                    ${isOpen ? "visible opacity-100" : "invisible opacity-0"}
                `}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Modal Container */}
                <form
                    onSubmit={handleSubmit}
                    className={`
                        max-h-[600px] relative bg-white shadow-2xl rounded-sm w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] transition-transform duration-300 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"} absolute bottom-0 sm:relative sm:bottom-auto flex flex-col ${isScholar ? "h-[90vh]" : "h-auto"}
                    `}
                >
                    {/* Header */}
                    <div className="relative px-4 py-4 rounded-t-sm bg-gray-50 border-b border-gray-300 flex-shrink-0">
                        <h2
                            id="modal-title"
                            className="text-sm font-medium text-slate-700 pr-10 leading-tight"
                        >
                            {label}
                        </h2>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="absolute top-2 right-4 p-2 text-slate-700 rounded-full hover:bg-gray-200 active:ring-1 active:ring-gray-300 transition"
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="flex-1 overflow-y-auto">{children}</div>

                    {/* Footer */}
                    {!disabledButton && (
                        <div className="flex rounded-b-sm justify-end gap-2 p-3.5 border-t border-gray-300 bg-gray-50 flex-shrink-0">
                            <button
                                onClick={handleClose}
                                type="button"
                                className="ml-auto bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                            >
                                {disabledButtonSave ? "Close" : "Cancel"}
                            </button>
                            {!disabledButtonSave && (
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
                                >
                                    {isLoading
                                        ? buttonLabel === "Save"
                                            ? "Saving..."
                                            : buttonLabel === "Confirm"
                                              ? "Confirming..."
                                              : buttonLabel === "Submit"
                                                ? "Submitting..."
                                                : buttonLabel === "Resubmit"
                                                  ? "Resubmitting..."
                                                  : buttonLabel === "Upload"
                                                    ? "Uploading..."
                                                    : "Saving Changes..."
                                        : buttonLabel}
                                </button>
                            )}
                        </div>
                    )}
                </form>
            </div>
        );
    }
);

export default InputModal;
