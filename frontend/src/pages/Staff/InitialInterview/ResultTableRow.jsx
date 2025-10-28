import { Upload } from "lucide-react";
import TableRow from "../../../components/TableRow";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { usePdfActions } from "../../../hooks/usePdfActions";
import { formatDateTime } from "../../../utils/formatDateTime";

const ResultTableRow = ({
    currentItems,
    selectedApplicants,
    profilePics,
    onOpenModal,
}) => {
    const { fetchApplicantData } = useApplicantData();
    const { viewPdf } = usePdfActions(fetchApplicantData);

    return (
        <>
            {currentItems.map((info, index) => (
                <TableRow
                    key={index}
                    selectedItems={selectedApplicants}
                    id={info.application_id}
                >
                    <td className="py-2 whitespace-nowrap text-center text-gray-900 font-bold">
                        {info.application_id}
                    </td>
                    {/* {activeTab === "old" && (
                        <td className="py-3 whitespace-nowrap text-gray-900 font-bold">
                            {info.scholar_id}
                        </td>
                    )} */}
                    <td className="py-2 flex justify-start text-center whitespace-nowrap text-sm text-gray-700">
                        <div className="w-[30%]"></div>
                        <div className="w-[max-content] flex items-center text-left gap-2">
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
                    <td className="py-2 whitespace-nowrap text-center text-gray-500">
                        {formatDateTime(info.created_at)}
                    </td>
                    <td className="py-3 whitespace-nowrap font-medium">
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-lg font-medium
                    ${
                        info.is_initial_interview_passed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                        >
                            {info.is_initial_interview_passed
                                ? "Passed"
                                : "Failed"}
                        </span>
                    </td>
                    <td className="py-3 text-center whitespace-nowrap font-medium">
                        <button
                            title="Upload File(s)"
                            onClick={() => onOpenModal(info.application_id)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
                        >
                            <Upload className="w-4 h-4" />
                        </button>
                    </td>
                </TableRow>
            ))}
        </>
    );
};

export default ResultTableRow;
