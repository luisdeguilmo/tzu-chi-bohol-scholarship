import { useState } from "react";
import InputModal from "./InputModal";

function ConfirmationModal({
    isOpen,
    onClose,
    isLoading,
    label,
    message,
    applicant,
    action = "",
    onClick,
    removeBackground = false,
    onSuccess,
    feedback,
    setFeedback,
    deactivationReason,
    setDeactivationReason,
}) {
    const resetFields = () => {
        if (action === "reject") {
            setFeedback("");
        }
    };

    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        onClose(false);
    };

    return (
        <InputModal
            label={label}
            isOpen={isOpen}
            resetFields={resetFields}
            onClose={onClose}
            removeBackground={removeBackground}
            buttonLabel={"Confirm"}
            onCancel={handleCancel}
            onSubmit={onClick}
            isLoading={isLoading}
        >
            <div className={`p-4`}>
                <div>
                    <p className="py-2.5 text-justify text-sm text-gray-600">
                        {message}
                    </p>
                    {action === "reject" && (
                        <label className="py-2 flex flex-col gap-[1px] text-gray-500 text-xs">
                            Reason for rejection (optional):
                            <textarea
                                rows={4}
                                value={feedback}
                                required
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder={
                                    "Please provide feedback for the applicant..."
                                }
                                className="w-full resize-none border border-gray-300 text-xs text-gray-700 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                            ></textarea>
                        </label>
                    )}
                    {action === "deactivate" && (
                        <div className="mt-2 block w-full relative">
                            <label className="block mb-1 text-gray-600 text-xs">
                                Reason for Deactivation
                            </label>
                            <select
                                name="deactivation_reason"
                                value={deactivationReason} // <-- controlled value
                                onChange={(e) =>
                                    setDeactivationReason(e.target.value)
                                } // <-- change handler
                                className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                            >
                                <option value="" disabled>
                                    Select
                                </option>
                                {/* <option value="pending">Pending</option> */}
                                <option value="graduated">Graduated</option>
                                <option value="terminated">Terminated</option>
                                <option value="terminated">Other</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </InputModal>
    );
}

export default ConfirmationModal;
