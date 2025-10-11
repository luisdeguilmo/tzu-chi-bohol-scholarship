import InputModal from "../../../components/InputModal";
import { useState } from "react";

function EditFormModal({ isOpen, setIsOpen, onSuccess, label }) {
    // useEffect(() => {
    //     if (!isEditing) {
    //         resetFields();
    //     }
    // }, []);

    const [collegeUniversity, setCollegeUniversity] = useState("");
    const [isValueChanged, setIsValueChanged] = useState(false);

    const handleCreate = () => {
        onSuccess();
        setIsOpen(false);
        resetFields();
    };

    const handleEdit = async () => {};

    const handleSubmit = (e) => {
        e.preventDefault();
        // if (isEditing) handleEdit();
        // else handleCreate();
        setIsValueChanged(false);
        // setIsEditing(false);
        setIsOpen(false);
    };

    const resetFields = () => {};

    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        setIsOpen(false);
        resetFields();
        // if (isEditing) {
        //     onEdit(false);
        // }
    };

    return (
        <InputModal
            label={label}
            isOpen={isOpen}
            resetFields={resetFields}
            onClose={setIsOpen}
        >
            <form onSubmit={handleSubmit} className="pt-4 pb-6 px-6">
                {/* Form Inputs */}
                <div>
                    <label className="py-2 flex flex-col gap-[1px] text-gray-600 text-xs">
                        College/University
                        <input
                            type="text"
                            placeholder={"College or University"}
                            required
                            onChange={(e) => {
                                setCollegeUniversity(e.target.value);
                                setIsValueChanged(true);
                            }}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </label>
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
                        type="submit"
                        className={`w-full py-2 px-3 rounded-lg shadow-sm focus:outline-none bg-green-600 text-white hover:bg-green-700`}
                    >
                        {/* Add {label} */}{" "}
                        {/* {isLoading ? "Submitting" : `Add ${label}`} */}
                        {/* {isEditing
                            ? isLoading
                                ? "Saving..."
                                : isValueChanged
                                  ? "Save Changes"
                                  : `Edit ${label}`
                            : isLoading
                              ? "Submitting..."
                              : `Add ${label}`} */}
                    </button>
                </div>
            </form>
        </InputModal>
    );
}

export default EditFormModal;
