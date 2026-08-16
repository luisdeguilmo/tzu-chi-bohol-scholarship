import { useState } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { ClipboardEdit, PenLine, Upload } from "lucide-react";

const AwardingTableRow = ({
    loading,
    currentItems,
    onSelectScholarId,
    onSelectScholar,
    onOpenModal,
}) => {
    const [edit, setEdit] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [score, setScore] = useState(0);

    const handleButtonState = (id, value) => {
        setEdit(true);
        setEditingId(id);
        setScore(value || ""); // Set initial value
    };

    const handleChange = (value) => {
        setScore(value);
    };

    return (
        <>
            {loading && (
                <tr>
                    <td colSpan={6} className="p-6">
                        <div className="mt-4 flex flex-col items-center gap-4">
                            <div className="flex items-end gap-1 h-10">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-2 bg-emerald-500 rounded-full animate-bounce"
                                        style={{
                                            height: "10px",
                                            animationDelay: `${i * 100}ms`,
                                        }}
                                    />
                                ))}
                            </div>

                            <p className="text-sm text-slate-500">
                                Loading data...
                            </p>
                        </div>
                    </td>
                </tr>
            )}

            {!loading &&
                currentItems.map((info, index) => (
                    <tr
                        key={index}
                        className="transition-colors border-b border-gray-100 hover:bg-gray-50 text-center"
                    >
                        <td className="py-2.5 whitespace-nowrap font-bold text-gray-700">
                            {info.application_id}
                        </td>
                        <td className="py-2.5 flex whitespace-nowrap text-sm text-gray-700">
                            <div className="w-[30%]"></div>
                            <div className="w-[max-content] flex  items-center text-left gap-2">
                                <img
                                    src={info[0].profile}
                                    alt="Profile"
                                    className="w-10 h-10 object-cover rounded-full mx-auto"
                                />
                                <div>
                                    <p className="font-bold text-xs">
                                        {info.last_name +
                                            ", " +
                                            info.first_name}{" "}
                                        {info.middle_name
                                            ? info.middle_name[0] + "."
                                            : ""}
                                    </p>
                                    <p className="text-[11px] text-gray-500">
                                        {info.email}
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td className="py-2.5 whitespace-nowrap text-gray-500">
                            <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-lg font-medium ${
                                    info.is_attended_awarding
                                        ? "bg-green-100 text-green-800"
                                        : info.is_not_attended_awarding
                                          ? "bg-red-100 text-red-800"
                                          : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                                {info.is_attended_awarding
                                    ? "Attended"
                                    : info.is_not_attended_awarding
                                      ? "Not Attended"
                                      : "Pending"}
                            </span>
                        </td>
                        <td className="py-2.5 text-center whitespace-nowrap font-medium">
                            <button
                                onClick={() => {
                                    onSelectScholarId(info.application_id);
                                    onSelectScholar(info);
                                    onOpenModal(true);
                                }}
                                title={"Change Status"}
                                className={`inline-flex items-center ${
                                    info.score != null
                                        ? "text-blue-600 hover:text-blue-900"
                                        : "text-green-600 hover:text-green-900"
                                }`}
                            >
                                <PenLine className="w-4 h-4 mr-1" />
                            </button>
                        </td>
                    </tr>
                ))}
        </>
    );
};

export default AwardingTableRow;
