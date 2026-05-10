import { useState } from "react";
import UserAccount from "./UserAccountPage";
import { X } from "lucide-react";
import StaffAccount from "./StaffAccountPage";

function UserProfileModal({
    isOpen,
    setIsOpen,
    userId,
    isScholar = false,
    isStaff = false,
}) {
    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-[rgba(0,0,0,.3)] bg-opacity-50">
                    <div className="h-[600px] w-[80%] lg:w-[60%] bg-white rounded-sm shadow-md flex flex-col">
                        <div className="py-7 bg-gray-50 relative flex justify-between rounded-sm items-center flex-shrink-0">
                            <h2 className="absolute left-[50%] translate-x-[-50%] text-center text-sm text-gray-600">
                                User Profile
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="absolute top-3 right-4 p-2 text-slate-700 rounded-full hover:bg-gray-100 active:ring-1 active:ring-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                aria-label="Close modal"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 rounded-bl-sm overflow-y-scroll">
                            {isScholar ? (
                                <UserAccount
                                    scholarId={userId}
                                    isModal={true}
                                />
                            ) : (
                                <StaffAccount staffId={userId} isModal={true} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserProfileModal;
