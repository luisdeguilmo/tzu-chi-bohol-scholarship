import { useEffect, useState } from "react";
import InputModal from "./InputModal";
import { useEmailMessages } from "../hooks/useEmailMessages";

const EmailMessageFormModal = ({
    isOpen,
    onClose,
    onRefresh,
    stage,
    firstLabel,
    secondLabel,
}) => {
    const { isLoading, emailMessages, updateMessage, fetchEmailMessages } =
        useEmailMessages(stage);
    const [passedMessage, setPassedMessage] = useState("");
    const [failedMessage, setFailedMessage] = useState("");

    useEffect(() => {
        if (emailMessages) {
            setPassedMessage(emailMessages.passedMessage || "");
            setFailedMessage(emailMessages.failedMessage || "");
        }
    }, [emailMessages]);

    // Placeholder for saving function
    const handleSubmit = async () => {
        await updateMessage(stage, passedMessage, failedMessage);
        onRefresh?.();
        onClose(false);
    };

    const handleCancel = () => {
        onClose(false);
    };

    return (
        <InputModal
            label={"Application Message"}
            isOpen={isOpen}
            onClose={onClose}
            expandable={true}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            buttonLabel={"Save Changes"}
            isLoading={isLoading}
        >
            {/* Content */}
            <div className="px-4 pt-3.5 pb-3.5 space-y-4">
                <label className="flex flex-col text-xs text-gray-500">
                    <span className="mb-1 font-medium">{firstLabel}</span>
                    <textarea
                        rows={6}
                        placeholder="Enter the approval email content here..."
                        value={passedMessage}
                        onChange={(e) => setPassedMessage(e.target.value)}
                        className="resize-none w-full border border-gray-300 rounded-md p-2 font-mono text-justify text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                </label>

                <label className="flex flex-col text-xs text-gray-500">
                    <span className="mb-1 font-medium">{secondLabel}</span>
                    <textarea
                        rows={6}
                        placeholder="Enter the rejection email content here..."
                        value={failedMessage}
                        onChange={(e) => setFailedMessage(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 font-mono text-justify text-xs text-gray-800 resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                </label>
            </div>
        </InputModal>
    );
};

export default EmailMessageFormModal;
