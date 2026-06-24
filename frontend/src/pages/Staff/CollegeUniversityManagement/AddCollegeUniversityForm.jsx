import { X } from "lucide-react";
import React, { useState } from "react";
import InputModal from "../../../components/InputModal";
import { useAuth } from "../../../context/AuthContext";

const AddCollegeUniversityForm = React.memo(
    ({
        isOpen,
        onClose,
        onSuccess,
        onAddItem,
        onRefresh,
        isLoading,
        disabled,
    }) => {
        const [collegeUniversity, setCollegeUniversity] = useState("");
        const [type, setType] = useState("");

        const handleSubmit = async () => {
            const success = await onAddItem(collegeUniversity, type);

            if (success) {
                onRefresh();
                resetFields();
                onClose(false);
            }
        };

        const handleCancel = (e) => {
            e.preventDefault();
            resetFields();
            onClose(false);
        };

        const resetFields = () => {
            setCollegeUniversity("");
            setType("");
        };

        return (
            <InputModal
                label={"Add New College or University"}
                isOpen={isOpen}
                resetFields={resetFields}
                onClose={onClose}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                buttonLabel={"Save"}
                isLoading={isLoading}
            >
                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="block mb-2 relative">
                        <label className="block text-gray-600 text-xs">
                            College/University
                        </label>
                        <input
                            type="text"
                            value={collegeUniversity}
                            onChange={(e) =>
                                setCollegeUniversity(e.target.value)
                            }
                            placeholder="Enter college or university"
                            className="w-full mt-1 border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                            required
                            disabled={disabled}
                        />
                    </div>

                    <div className="block mb-2">
                        <label className="text-gray-600 text-xs block mt-[-2px] mb-1">
                            Type
                        </label>
                        <div className="mt-2 flex flex-col gap-2">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="public"
                                    name="type"
                                    value="public"
                                    checked={type === "public"}
                                    onChange={() => setType("public")}
                                    className="h-4 w-4 accent-green-600 focus:ring-green-500 border-gray-300"
                                />
                                <label
                                    htmlFor="public"
                                    className="ml-2 block text-xs text-gray-700"
                                >
                                    Public
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="private"
                                    name="type"
                                    value="private"
                                    checked={type === "private"}
                                    onChange={() => setType("private")}
                                    className="h-4 w-4 accent-green-600 focus:ring-green-500 border-gray-300"
                                />
                                <label
                                    htmlFor="private"
                                    className="ml-2 block text-xs text-gray-700"
                                >
                                    Private
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </InputModal>
        );
    },
);

export default AddCollegeUniversityForm;
