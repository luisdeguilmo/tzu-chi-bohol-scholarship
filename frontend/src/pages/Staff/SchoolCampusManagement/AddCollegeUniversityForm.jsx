import { X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../../../config";

const AddCollegeUniversityForm = React.memo(
    ({ isOpen, onClose, onSuccess, onAddItem, onRefresh, disabled }) => {
        const [collegeUniversity, setCollegeUniversity] = useState("");

        const handleSubmit = async (e) => {
            e.preventDefault();

            const success = await onAddItem(collegeUniversity);

            if (success) {
                setCollegeUniversity("");
                onRefresh();
                onClose(false);
            }
        };

        const handleCancel = (e) => {
            e.preventDefault(); // Prevent form submission
            setCollegeUniversity("");
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
                            Add New College or University
                        </h2>
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="absolute top-3 right-4 p-2 text-slate-700 rounded-full hover:bg-gray-100 active:ring-1 active:ring-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="block mb-2 relative">
                            <label className="block mb-1 text-gray-600 text-xs">
                                College/University
                            </label>
                            <input
                                type="text"
                                value={collegeUniversity}
                                onChange={(e) =>
                                    setCollegeUniversity(e.target.value)
                                }
                                placeholder="Enter college or university"
                                className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                                disabled={disabled}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 text-sm">
                            <button
                                type="button" // Explicitly set type to prevent form submission
                                onClick={handleCancel}
                                className="w-full py-2 px-4 rounded-lg shadow-sm focus:outline-none bg-gray-200 text-gray-500"
                                disabled={disabled}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`w-full py-2 px-4 rounded-lg shadow-sm focus:outline-none ${
                                    disabled
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-green-600 text-white hover:bg-green-700"
                                } transition-all`}
                                disabled={disabled}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
);

export default AddCollegeUniversityForm;
