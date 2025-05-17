import { useState } from "react";
import useScholarshipCriteriaSubmit from "../../../hooks/useScholarshipCriteriaSubmit";
import scholarshipCriteriaInputFields from "../../../constant/staff/scholarshipCriteriaInputFields";

function FormModal({ isOpen, setIsOpen, onSuccess, label, fields }) {
    const [text, setText] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [submit, setSubmit] = useState("");

    const {
        handleStrandSubmit,
        handleCourseSubmit,
        handleProcedureSubmit,
        handleQualificationSubmit,
        handleRequirementSubmit,
        handleInstructionSubmit,
        isLoading,
    } = useScholarshipCriteriaSubmit(onSuccess);

    const handleSubmit = (e) => {
        switch (label) {
            case "Strand":
                handleStrandSubmit(e, text, setText, setIsOpen);
                break;

            case "Course":
                handleCourseSubmit(e, text, setText, setIsOpen);
                break;

            case "Procedure":
                handleProcedureSubmit(e, text, setText, setIsOpen);
                break;

            case "Qualification":
                handleQualificationSubmit(e, text, setText, setIsOpen);
                break;

            case "Instruction":
                handleInstructionSubmit(e, text, setText, setIsOpen);
                break;

            case "Requirement":
                handleRequirementSubmit(
                    e,
                    quantity,
                    setQuantity,
                    description,
                    setDescription,
                    submit,
                    setSubmit,
                    setIsOpen
                );
                break;

            default:
                console.error("Unknown label type:", label);
        }
    };

    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        setIsOpen(false);
    };

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
                Add {label}
            </button>

            {isOpen && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-[80%] md:w-[50%] lg:w-[30%] bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-green-500 px-6 py-2 flex justify-between items-center">
                            <h2 className="text-md text-white">
                                Add New {label}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="text-white text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-4">
                            {/* Form Inputs */}
                            <div>
                                {fields.map((field, index) =>
                                    field.type === "text" ? (
                                        <label key={index} className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
                                            {field.name}
                                            <input
                                                type="text"
                                                placeholder={field.placeholder}
                                                value={
                                                    label === "Requirement"
                                                        ? index === 0
                                                            ? quantity
                                                            : index === 1
                                                            ? description
                                                            : submit
                                                        : text
                                                }
                                                onChange={(e) => {
                                                    if (
                                                        label === "Requirement"
                                                    ) {
                                                        if (index === 0) {
                                                            setQuantity(
                                                                e.target.value
                                                            );
                                                        } else if (
                                                            index === 1
                                                        ) {
                                                            setDescription(
                                                                e.target.value
                                                            );
                                                        } else {
                                                            setSubmit(
                                                                e.target.value
                                                            );
                                                        }
                                                    } else {
                                                        setText(e.target.value);
                                                    }
                                                }}
                                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                        </label>
                                    ) : null
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className={`w-full py-2 px-4 rounded-sm shadow-sm focus:outline-none bg-gray-200 text-gray-500`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`w-full py-2 px-4 rounded-sm shadow-sm focus:outline-none bg-green-500 text-white hover:bg-green-600`}
                                >
                                    {/* Add {label} */}{" "}
                                    {isLoading ? "Submitting" : `Add ${label}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FormModal;
