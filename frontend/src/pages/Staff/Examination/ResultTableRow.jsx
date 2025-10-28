import { useState } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { Upload } from "lucide-react";
import { useApplicationFiles } from "../../../hooks/useApplicationFiles";

const ResultTableRow = ({ currentItems, profilePics, onOpenModal }) => {
    
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
                        {info.batch}
                    </td>
                    <td className="py-2 whitespace-nowrap text-gray-500">
                        {formatDateTime(info.schedule) || "Not Set"}
                    </td>
                    <td className="py-2 text-center whitespace-nowrap text-gray-500">
                        {edit && editingId === info.application_id ? (
                            <input
                                className="p-1 w-16 text-center border-[1px] outline-green-500"
                                type="text"
                                onChange={(e) => handleChange(e.target.value)}
                                value={score}
                            />
                        ) : (
                            <span>{info.score}</span>
                        )}
                    </td>
                    <td className="py-2 whitespace-nowrap font-medium">
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-lg font-medium
                     ${
                         info.is_examination_passed
                             ? "bg-green-100 text-green-800"
                             : info.is_examination_failed
                               ? "bg-red-100 text-red-800"
                               : "bg-yellow-100 text-yellow-800"
                     }`}
                        >
                            {/* {info.score >= 50 && info.score !== null
                                ? "Passed"
                                : info.score < 50 && info.score !== null
                                ? "Failed"
                                : "Pending"} */}
                            {info.is_examination_passed
                                ? "Passed"
                                : info.is_examination_failed
                                  ? "Failed"
                                  : "Pending"}
                        </span>
                    </td>
                    <td className="py-3 text-center whitespace-nowrap font-medium">
                        <button
                            title="Upload Document"
                            onClick={() => onOpenModal(info.application_id)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
                        >
                            <Upload className="w-4 h-4" />
                        </button>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default ResultTableRow;
