import { GraduationCap, BookOpen } from "lucide-react";
import { useArchive } from "../../../hooks/useArchive";
import { formatDate } from "../../../utils/formatDate";

const CoeGradesCard = ({
    userId,
    submission,
    index,
    handleOpenDetails,
    handleOpenDotMenu,
    handleSelectSubmission,
    isDotMenuOpen,
    itemIndex,
    setIsDotMenuOpen,
    setItemIndex,
    setIsEditFormModalOpen,
    activeTab,
    onRefresh,
    isArchived = false,
}) => {
    const { archiveActivity, unArchiveActivity } = useArchive(
        activeTab,
        userId
    );

    console.log(submission.files[0]?.uploaded_at);

    const handleArchiveToggle = async (e) => {
        e.stopPropagation();
        setIsDotMenuOpen(false);
        setItemIndex(-1);

        try {
            if (isArchived) {
                await unArchiveActivity(userId, submission.id, "coe_grades");
            } else {
                await archiveActivity(userId, submission.id, "coe_grades");
            }

            if (onRefresh) {
                await onRefresh(activeTab, userId);
            }
        } catch (error) {
            console.error("Error archiving/unarchiving submission:", error);
        }
    };

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                handleOpenDetails(submission);
            }}
            className={`group relative p-6 rounded-lg shadow-sm border transition-all duration-300 cursor-pointer ${
                isArchived
                    ? "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 shadow-inner"
                    : "bg-white border-gray-200 hover:shadow-md hover:border-blue-200"
            }`}
        >
            {/* Modern Accent Border */}
            <div
                className={`absolute left-0 top-6 bottom-6 w-1 rounded-full transition-all duration-300 ${
                    isArchived
                        ? "bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600 opacity-0 group-hover:opacity-100"
                        : "bg-gradient-to-b from-green-500 via-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100"
                }`}
            ></div>

            <div className="relative">
                <h3
                    className={`font-bold text-lg leading-tight mb-4 pr-8 overflow-ellipsis overflow-hidden whitespace-nowrap ${
                        isArchived
                            ? "italic text-slate-400 decoration-slate-400"
                            : "text-slate-700"
                    }`}
                >
                    {submission.year_level === 1
                        ? "1st Year"
                        : submission.year_level === 2
                          ? "2nd Year"
                          : submission.year_level === 3
                            ? "3rd Year"
                            : submission.year_level === 4
                              ? "4th Year"
                              : "5th Year"}{" "}
                    - {submission.semester}
                </h3>

                <div className="space-y-2">
                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-500" : "text-slate-600"
                        }`}
                    >
                        <GraduationCap
                            className={`w-4 h-4 mr-3 flex-shrink-0 ${
                                isArchived ? "text-slate-400" : "text-slate-600"
                            }`}
                        />
                        <span
                            className={`text-xs ${isArchived ? "italic" : ""}`}
                        >
                            Year Level:{" "}
                            {submission.year_level === 1
                                ? "1st Year"
                                : submission.year_level === 2
                                  ? "2nd Year"
                                  : submission.year_level === 3
                                    ? "3rd Year"
                                    : submission.year_level === 4
                                      ? "4th Year"
                                      : "5th Year"}
                        </span>
                    </div>

                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-500" : "text-slate-600"
                        }`}
                    >
                        <BookOpen
                            className={`w-4 h-4 mr-3 flex-shrink-0 ${
                                isArchived ? "text-slate-400" : "text-slate-600"
                            }`}
                        />
                        <span
                            className={`text-xs ${isArchived ? "italic" : ""}`}
                        >
                            Semester: {submission.semester}
                        </span>
                    </div>

                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-500" : "text-slate-600"
                        }`}
                    >
                        {/* {submission.submission_status === "Pending" ? (
                            <AlertCircle
                                className={`w-4 h-4 mr-3 flex-shrink-0 ${
                                    isArchived
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}
                            />
                        ) : (
                            <CheckCircle
                                className={`w-4 h-4 mr-3 flex-shrink-0 ${
                                    isArchived
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}
                            />
                        )} */}
                        {/* <span
                            className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                submission.submission_status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : submission.submission_status ===
                                        "Recorded"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                            } ${isArchived ? "italic text-slate-400" : ""}`}
                        >
                            {submission.submission_status === "Pending"
                                ? "Pending"
                                : submission.submission_status === "Recorded"
                                  ? "Recorded"
                                  : "Not Recorded"}
                        </span> */}
                    </div>
                    <div
                        className={`flex items-center text-sm ${
                            isArchived ? "text-slate-500" : "text-slate-600"
                        }`}
                    >
                        <span
                            className={`text-[10px] ${isArchived ? "italic" : ""}`}
                        >
                            Date Submitted:{" "}
                            {formatDate(submission.files[0]?.uploaded_at)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Dropdown Menu Button */}
            <button
                onClick={(e) => handleOpenDotMenu(e, index)}
                className={`absolute top-4 right-4 p-2 rounded-xl transition-all duration-200 ${
                    isArchived
                        ? "text-slate-500 hover:text-slate-700 hover:bg-slate-300"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5.25a.75.75 0 110 1.5.75.75 0 010-1.5zm0 6a.75.75 0 110 1.5.75.75 0 010-1.5zm0 6a.75.75 0 110 1.5.75.75 0 010-1.5z"
                    />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isDotMenuOpen && index === itemIndex && (
                <div className="dropdown-menu absolute top-12 right-4 bg-white rounded-xl shadow-lg border border-slate-200 z-50 min-w-[120px] p-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditFormModalOpen(true);
                            handleSelectSubmission(submission);
                        }}
                        className="w-full text-left rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                    >
                        Edit
                    </button>

                    <button
                        onClick={handleArchiveToggle}
                        className={`${
                            submission.submission_status === "Pending"
                                ? "hidden"
                                : "block"
                        } w-full text-left rounded-lg px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150`}
                    >
                        {isArchived ? "Restore" : "Archive"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CoeGradesCard;
