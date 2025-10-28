import { X } from "lucide-react";
import React, { useState } from "react";
import InputModal from "../../../components/InputModal";

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

        const handleSubmit = async () => {
            const success = await onAddItem(collegeUniversity);

            if (success) {
                setCollegeUniversity("");
                onRefresh();
                onClose(false);
            }
        };

        const handleCancel = (e) => {
            e.preventDefault();
            onClose(false);
            setCollegeUniversity("");
        };

        return (
            <InputModal
                label={"Add New College or University"}
                isOpen={isOpen}
                // resetFields={resetFields}
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
                            className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                            required
                            disabled={disabled}
                        />
                    </div>
                </div>
            </InputModal>
        );
    }
);

export default AddCollegeUniversityForm;
