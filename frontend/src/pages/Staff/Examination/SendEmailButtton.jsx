import { Check, Mail, Send } from "lucide-react";

const SendEmailButton = ({
    isFullWidth = false,
    isEmailSent,
    isLoading,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            type="button"
            className={`${isFullWidth ? "w-full" : "w-[max-content]"} text-xs py-2.5 px-3 rounded-lg text-white flex justify-center items-center gap-1 ${
                isEmailSent ? "bg-gray-400" : "bg-gray-400 hover:bg-gray-500"
            }`}
            disabled={isEmailSent}
        >
            <Send className="w-4 h-4" />
            Send Results Notifications
        </button>
    );
};

export default SendEmailButton;
