import { useState } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { ClipboardEdit, PenLine, Upload } from "lucide-react";

const AwardingTableRow = ({
    currentItems,
    profilePics,
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
            {currentItems.map((info, index) => (
                <tr
                    key={index}
                    className="transition-colors border-b border-gray-100 hover:bg-gray-50 text-center"
                >
                    <td className="py-2 whitespace-nowrap text-gray-500">
                        {info.application_id}
                    </td>
                    <td className="py-2 flex whitespace-nowrap text-sm text-gray-700">
                        <div className="w-[30%]"></div>
                        <div className="w-[max-content] flex  items-center text-left gap-2">
                            <img
                                src={profilePics[info.application_id]}
                                alt="Profile"
                                className="w-10 h-10 object-cover rounded-full mx-auto"
                            />
                            <div>
                                <p className="font-bold text-xs">
                                    {info.first_name + " " + info.last_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {info.email}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td className="py-2 whitespace-nowrap text-gray-500">
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
                    <td className="py-3 text-center whitespace-nowrap font-medium">
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
