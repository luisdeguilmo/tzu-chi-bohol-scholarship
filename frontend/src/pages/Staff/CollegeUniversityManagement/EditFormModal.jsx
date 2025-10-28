import { Check, PenLine, Trash, Trash2, X } from "lucide-react";
import InputModal from "../../../components/InputModal";
import { useEffect, useState } from "react";

function EditFormModal({
    isLoadingForCourse,
    isOpen,
    setIsOpen,
    label,
    selectedId,
    collegeUniversity,
    coursesAccepted,
    onAddCourse,
    onUpdateCourse,
    onDeleteCourse,
    onUpdateCollegeUniversity,
    onRefresh,
    onRefreshCourse,
    isLoading,
}) {
    const [newCollegeUniversity, setNewCollegeUniversity] = useState("");
    const [isValueChanged, setIsValueChanged] = useState(false);
    const [courseName, setCourseName] = useState("");
    const [newCourseName, setNewCourseName] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setNewCollegeUniversity(collegeUniversity);
    }, [collegeUniversity]);

    const handleCreate = () => {
        onSuccess();
        setIsOpen(false);
        resetFields();
    };

    const handleAddCourse = async () => {
        const success = await onAddCourse(selectedId, courseName);

        if (success) {
            onRefreshCourse();
            setCourseName("");
        }
    };

    const handleUpdateCourse = async () => {
        const success = await onUpdateCourse(selectedCourseId, newCourseName);

        if (success) {
            onRefreshCourse();
            setIsEditing(false);
            // setNewCourseName("");
        }
    };

    const handleDeleteCourse = async (courseId) => {
        const success = await onDeleteCourse(courseId);

        if (success) {
            onRefreshCourse();
        }
    };

    const handleSubmit = async () => {
        const success = await onUpdateCollegeUniversity(
            selectedId,
            newCollegeUniversity
        );

        if (success) {
            setIsValueChanged(false);
            setIsOpen(false);
            onRefresh();
        }
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
            expandable={true}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            buttonLabel={"Save Changes"}
            isLoading={isLoading}
        >
            <div className="p-4">
                {/* Form Inputs */}
                <div>
                    <label className="py-2 mb-1 flex flex-col gap-[1px] text-gray-600 text-xs">
                        College/University
                        <input
                            type="text"
                            placeholder={"College or University"}
                            required
                            value={newCollegeUniversity}
                            onChange={(e) => {
                                setNewCollegeUniversity(e.target.value);
                                setIsValueChanged(true);
                            }}
                            className="w-full border border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </label>
                </div>

                <div>
                    <p className="mb-1 text-gray-600 text-xs">Courses: </p>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder={"Course name"}
                            value={courseName}
                            onChange={(e) => {
                                setCourseName(e.target.value);
                            }}
                            className="w-[80%] border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddCourse}
                            className={`w-[20%] text-sm text-white rounded-lg ${courseName === "" ? "bg-green-300" : "bg-green-600 hover:bg-green-700"}`}
                            disabled={courseName === ""}
                        >
                            {isLoadingForCourse
                                ? "Processing..."
                                : "Add Course"}
                        </button>
                    </div>
                    <ul className="my-4 space-y-1">
                        {coursesAccepted.map((course, index) => (
                            <li
                                key={index}
                                className="group box-border p-3 flex justify-between items-center text-xs text-gray-600 bg-gray-50 hover:bg-gray-100/80 rounded-lg"
                            >
                                {selectedCourseId === course.id && isEditing ? (
                                    <input
                                        type="text"
                                        placeholder={"Course name"}
                                        value={newCourseName || course.course}
                                        onChange={(e) => {
                                            setNewCourseName(e.target.value);
                                        }}
                                        className={`w-[80%] border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500`}
                                    />
                                ) : (
                                    <span>{course.course}</span>
                                )}

                                <div className="space-x-3 hidden group-hover:block">
                                    {selectedCourseId === course.id &&
                                    isEditing ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleUpdateCourse}
                                                className="text-blue-700"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsEditing(false)
                                                }
                                                className="text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedCourseId(
                                                        course.id
                                                    );
                                                    setNewCourseName(
                                                        course.course
                                                    );
                                                    setIsEditing(true);
                                                }}
                                                className="text-blue-700"
                                            >
                                                <PenLine className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteCourse(
                                                        course.id
                                                    )
                                                }
                                                className="text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Action Buttons */}
            </div>
        </InputModal>
    );
}

export default EditFormModal;
