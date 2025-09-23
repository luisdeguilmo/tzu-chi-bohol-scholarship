import { ArrowRight, DownloadIcon, Eye, XCircle } from "lucide-react";
import ApplicationFormPDF from "../../../components/ApplicationFormPDF";
import TableRow from "../../../components/TableRow";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { usePdfActions } from "../../../hooks/usePdfActions";
import { formatDateTime } from "../../../utils/formatDateTime";
import { manageApplication } from "../../../services/emailService";

const ApplicantsTableRow = ({
    currentItems,
    onApprove,
    onReject,
    selectedApplicants,
    profilePics,
    onSuccess,
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
                    <td className="py-2 whitespace-nowrap text-center font-medium">
                        <div className="flex items-center justify-center">
                            <button
                                onClick={() => viewPdf(info.application_id)}
                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="View PDF"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => downloadPdf(info.application_id)}
                                className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                title="Download PDF"
                            >
                                <DownloadIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onApprove(info)}
                                className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                // disabled={loading}
                                title="Next Stage"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onReject(info)}
                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                // disabled={loading}
                                title="Reject"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                </TableRow>
            ))}
        </>
    );
};

export default ApplicantsTableRow;
