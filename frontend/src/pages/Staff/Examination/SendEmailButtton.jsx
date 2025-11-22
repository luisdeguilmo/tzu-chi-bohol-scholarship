// import { Check, Mail } from "lucide-react";

// const SendEmailButton = ({ isFullWidth = false, isEmailSent, isLoading, onSendSchedule }) => {
//     return (
//         <button
//             onClick={onSendSchedule}
//             type="button"
//             className={`${isFullWidth ? "w-full" : "w-[max-content]"} py-2 px-3 rounded-lg text-white flex justify-center items-center gap-1 ${
//                 isEmailSent ? "bg-gray-400" : "bg-gray-400 hover:bg-gray-500"
//             }`}
//             disabled={isEmailSent}
//         >
//             {isEmailSent && !isLoading ? (
//                 <>
//                     <Check className="w-4 h-4" />
//                     <span className="text-sm">Sent Successfully!</span>
//                 </>
//             ) : !isEmailSent && isLoading ? (
//                 <>
//                     <svg
//                         className="animate-spin mr-1 h-5 w-5 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                     >
//                         <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                         ></circle>
//                         <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                     </svg>
//                     <span className="text-sm">Send via Email</span>
//                 </>
//             ) : (
//                 <>
//                     <Mail className="w-4 h-4" />
//                     <span className="text-sm">Send via Email</span>
//                 </>
//             )}
//         </button>
//     );
// };

// export default SendEmailButton;

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
