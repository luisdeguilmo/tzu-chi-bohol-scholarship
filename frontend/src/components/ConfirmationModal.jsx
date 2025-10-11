import { useState } from "react";
import { User } from "lucide-react";
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
}) {
    const [feedback, setFeedback] = useState("");

    const resetFields = () => {
        setFeedback("");
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
        >
            <div className={`pt-4 pb-6 px-6 `}>
                <div>
                    <p className="py-2.5 text-justify text-sm text-gray-600">
                        {message}
                    </p>
                    {action === "reject" && (
                        <label className="py-2 flex flex-col gap-[1px] text-gray-600 text-xs">
                            Feedback
                            <textarea
                                rows={4}
                                value={feedback}
                                required
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder={"Enter feedback"}
                                className="w-full resize-none border border-gray-300 text-sm rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                            ></textarea>
                        </label>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 text-sm mt-2">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className={`w-full py-2 px-3 rounded-lg shadow-sm focus:outline-none bg-gray-200 text-gray-500`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClick}
                        type="button"
                        className={`w-full py-2 px-3 rounded-lg shadow-sm focus:outline-none bg-green-600 text-white hover:bg-green-700`}
                    >
                        {/* Add {label} */}{" "}
                        {/* {isLoading ? "Submitting" : `Add ${label}`} */}
                        {isLoading ? "Processing..." : "Confirm"}
                    </button>
                </div>
            </div>
        </InputModal>
    );
}

export default ConfirmationModal;
