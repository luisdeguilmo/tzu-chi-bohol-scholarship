import useScholarshipCriteriaSubmit from "../../../hooks/useScholarshipCriteriaSubmit";
import InputModal from "../../../components/InputModal";
import { useCriteria } from "../../../context/CriteriaContext";
import { useEffect, useState } from "react";

function FormModal({
    isOpen,
    isEditing,
    setIsEditing,
    setIsOpen,
    onSuccess,
    onEdit,
    label,
    fields,
    updateItem,
    endpoint,
}) {
    const {
        id,
        text,
        quantity,
        description,
        submit,
        setId,
        setText,
        setQuantity,
        setDescription,
        setSubmit,
    } = useCriteria();

    useEffect(() => {
        if (!isEditing) {
            resetFields();
        }
    }, []);

    const {
        createStrand,
        createCourse,
        createQualification,
        createRequirement,
        createProcedure,
        createInstruction,
        isLoading,
    } = useScholarshipCriteriaSubmit(onSuccess);

    const [isValueChanged, setIsValueChanged] = useState(false);

    const handleCreate = () => {
        switch (label) {
            case "Strand":
                createStrand(text, description);
                break;

            case "Course":
                createCourse(text);
                break;

            case "Procedure":
                createProcedure(text);
                break;

            case "Qualification":
                createQualification(text);
                break;

            case "Instruction":
                createInstruction(text);
                break;

            case "Requirement":
                createRequirement(quantity, description, submit);
                break;

            default:
                console.error("Unknown label type:", label);
        }

        onSuccess();
        setIsOpen(false);
        resetFields();
    };

    const handleEdit = async () => {
        let data = {};

        if (endpoint === "strand") {
            data.strand = text;
            data.description = description;
        } else if (endpoint === "requirement") {
            data.quantity = quantity;
            data.description = description;
            data.submit = submit;
        } else {
            data[endpoint] = text;
        }

        const success = await updateItem(id, endpoint, data);
        if (success) data = null;
    };

    const handleSubmit = () => {
        if (isEditing) handleEdit();
        else handleCreate();
        setIsValueChanged(false);
        setIsEditing(false);
        setIsOpen(false);
    };

    const resetFields = () => {
        setId("");
        setText("");
        setQuantity("");
        setDescription("");
        setSubmit("");
        setIsValueChanged(false);
        setIsEditing(false);
    };

    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        setIsOpen(false);
        resetFields();
        if (isEditing) {
            onEdit(false);
        }
    };

    return (
        <InputModal
            label={label}
            isOpen={isOpen}
            isEditing={isEditing}
            onEdit={onEdit}
            resetFields={resetFields}
            onClose={setIsOpen}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            buttonLabel={isEditing ? "Save Changes" : "Save"}
            isLoading={isLoading}
        >
            <div className="pt-4 pb-6 px-6">
                {/* Form Inputs */}
                <div>
                    {fields.map((field, index) =>
                        field.type === "text" ? (
                            <label
                                key={index}
                                className="py-2 flex flex-col gap-[1px] text-gray-600 text-xs"
                            >
                                {field.name}
                                <input
                                    type="text"
                                    placeholder={field.placeholder}
                                    value={
                                        label === "Requirement"
                                            ? index === 0
                                                ? quantity
                                                : submit
                                            : text
                                    }
                                    required
                                    onChange={(e) => {
                                        if (label === "Requirement") {
                                            if (index === 0) {
                                                setQuantity(e.target.value);
                                            } else {
                                                setSubmit(e.target.value);
                                            }
                                        } else {
                                            setText(e.target.value);
                                        }
                                        setIsValueChanged(true);
                                    }}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </label>
                        ) : field.type === "textarea" ? (
                            <label
                                key={index}
                                className="py-2 flex flex-col gap-[1px] text-gray-600 text-xs"
                            >
                                {field.name}
                                <textarea
                                    name=""
                                    id=""
                                    rows={4}
                                    value={description}
                                    required
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                        setIsValueChanged(true);
                                    }}
                                    placeholder={field.placeholder}
                                    className="w-full resize-none border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                                ></textarea>
                            </label>
                        ) : null
                    )}
                </div>

                {/* Action Buttons */}
            </div>
        </InputModal>
    );
}

export default FormModal;
