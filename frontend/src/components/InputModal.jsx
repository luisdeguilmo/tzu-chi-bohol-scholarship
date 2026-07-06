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
        closeButtonLabel,
        isLoading,
        disabledCloseButton = false,
        disabledButton = false,
        disabledButtonSave = false,
        isLarge = false,
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
            <>
                {isOpen && (
                    <div
                        className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-all duration-200
                    ${removeBackground ? "bg-opacity-30" : "bg-opacity-50"}
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
                        max-h-[600px] relative border bg-white shadow-2xl rounded-lg w-full ${isLarge ? "sm:w-[90%] md:w-[70%] lg:w-[80%] xl:w-[90%]" : "sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%]"} transition-transform duration-300 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"} absolute bottom-0 sm:relative sm:bottom-auto flex flex-col ${isScholar ? "h-[90vh]" : "h-auto"}
                    `}
                        >
                            {/* Header */}
                            <div className="relative px-4 py-4 rounded-t-lg bg-gray-50 border-b flex-shrink-0">
                                <h2
                                    id="modal-title"
                                    className={`${disabledCloseButton ? "text-center" : "text-left"} text-sm font-medium text-slate-700 pr-10 leading-tight`}
                                >
                                    {label}
                                </h2>
                                {!disabledCloseButton && (
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="absolute top-2 right-4 p-2 text-slate-600 rounded-full hover:bg-gray-200 active:ring-1 active:ring-gray-300 transition"
                                        aria-label="Close modal"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto">
                                {children}
                            </div>

                            {/* Footer */}
                            {!disabledButton && (
                                <div className="flex rounded-b-lg justify-end gap-2 bg-gray-50 border-t px-3.5 py-3.5 flex-shrink-0">
                                    <button
                                        onClick={handleClose}
                                        type="button"
                                        className="ml-auto bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                                    >
                                        {disabledButtonSave
                                            ? "Close"
                                            : closeButtonLabel === "No"
                                              ? "No"
                                              : "Cancel"}
                                    </button>
                                    {!disabledButtonSave && (
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`px-4 py-2 ${
                                                isLoading
                                                    ? "bg-green-400"
                                                    : "bg-green-600 hover:bg-green-700"
                                            } text-white text-sm rounded-lg font-medium transition`}
                                        >
                                            {isLoading
                                                ? buttonLabel === "Save"
                                                    ? "Saving..."
                                                    : buttonLabel === "Confirm"
                                                      ? "Confirming..."
                                                      : buttonLabel === "Submit"
                                                        ? "Submitting..."
                                                        : buttonLabel ===
                                                            "Resubmit"
                                                          ? "Resubmitting..."
                                                          : buttonLabel ===
                                                              "Upload"
                                                            ? "Uploading..."
                                                            : "Saving Changes..."
                                                : buttonLabel}
                                        </button>
                                    )}
                                </div>
                            )}
                        </form>
                    </div>
                )}
            </>
        );
    },
);

export default InputModal;
