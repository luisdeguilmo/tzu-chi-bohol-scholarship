import { useState } from "react";
import UserAccount from "../../../components/UserAccountPage";
import { X } from "lucide-react";

function ScholarProfileModal({ isOpen, setIsOpen, scholarId }) {
    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        setIsOpen(false);
    };

    return (
        <div>
            {isOpen && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-[rgba(0,0,0,.3)] bg-opacity-50">
                    <div className="h-[600px] w-[80%] lg:w-[60%] overflow-y-scroll bg-white rounded-lg shadow-md">
                        <div className="py-7 relative flex justify-between items-center">
                            <h2 className="absolute left-[50%] translate-x-[-50%] text-LG text-center font-bold text-gray-600">
                                Scholar Information
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

                        <UserAccount scholarId={scholarId} isMaximize={true} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ScholarProfileModal;
