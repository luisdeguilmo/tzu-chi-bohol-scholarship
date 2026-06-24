import { Check, PenLine, Trash, Trash2, X } from "lucide-react";
import InputModal from "../../../components/InputModal";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import BASE_URL from "../../../config";

function EditFormModal({
    isLoadingForCourse,
    isOpen,
    setIsOpen,
    label,
    selectedId,
    setSelectedId,
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
    const [type, setType] = useState("");
    const [newCourseName, setNewCourseName] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        setNewCollegeUniversity(collegeUniversity.name || "");
        setType(collegeUniversity.type || "")
    }, [collegeUniversity]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // setIsLoading(true);
                const response = await axios.get(
                    `${BASE_URL}app/api/course-visibility.php`,
                );

                if (response.data) {
                    setCourses(response.data.data || []);
                    // setIsLoading(false);
                }

                // setIsLoading(false);
            } catch (error) {
                // setIsLoading(false);
                console.log("Error: ", error);
            }
        };

        fetchCourses();
    }, []);

    const handleCreate = () => {
        onSuccess();
        setIsOpen(false);
        resetFields();
    };

    const handleAddCourse = async () => {
        const success = await onAddCourse(selectedId, selected.value);

        if (success) {
            onRefreshCourse();
            setCourseName("");
        }
    };

    const handleUpdateCourse = async () => {
        const success = await onUpdateCourse(
            selectedCourseId,
            selectedId,
            newCourseName,
        );

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
            newCollegeUniversity,
            type,
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
        setSelectedId(null);
        resetFields();
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
                            className="mt-1 w-full border border-gray-300 text-gray-900 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </label>
                </div>

                <div className="block mt-1 mb-2">
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

                <div>
                    <p className="mt-4 mb-1 text-gray-600 text-xs">Courses: </p>
                    <div className="flex gap-3">
                        {/* <input
                            type="text"
                            placeholder={"Course name"}
                            value={courseName}
                            onChange={(e) => {
                                setCourseName(e.target.value);
                            }}
                            className="w-[80%] border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        /> */}

                        <Select
                            options={courses.map((course) => ({
                                value: course.course.replaceAll("*", "").trim(),
                                label: course.course.replaceAll("*", "").trim(),
                            }))}
                            value={selected}
                            className="w-full"
                            onChange={setSelected}
                            placeholder="Search courses..."
                            isSearchable
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={{
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                    fontSize: "12px",
                                }),

                                control: (base, state) => ({
                                    ...base,
                                    borderColor: state.isFocused
                                        ? "#22c55e"
                                        : base.borderColor, // green-600
                                    boxShadow: state.isFocused
                                        ? "0 0 0 1px #22c55e"
                                        : base.boxShadow,
                                    "&:hover": {
                                        borderColor: "#22c55e",
                                    },
                                    minHeight: "36px",
                                    fontSize: "12px",
                                }),

                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isSelected
                                        ? "#16a34a" // selected = green-600
                                        : state.isFocused
                                          ? "#dcfce7" // hover = green-100
                                          : "white",
                                    color: state.isSelected
                                        ? "white"
                                        : "#374151",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                }),

                                singleValue: (base) => ({
                                    ...base,
                                    color: "#374151",
                                    fontSize: "12px",
                                }),

                                placeholder: (base) => ({
                                    ...base,
                                    fontSize: "12px",
                                    color: "#9ca3af",
                                }),
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleAddCourse}
                            className={`w-[20%] text-xs rounded-lg ${
                                selected === null ||
                                coursesAccepted.some(
                                    (course) =>
                                        course.course === selected?.value,
                                )
                                    ? "bg-gray-200 text-gray-400"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                            disabled={
                                selected === null ||
                                coursesAccepted.some(
                                    (course) =>
                                        course.course === selected?.value,
                                )
                            }
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

                                <div className="space-x-3 invisible group-hover:visible">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteCourse(course.id)
                                        }
                                        className="text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
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
