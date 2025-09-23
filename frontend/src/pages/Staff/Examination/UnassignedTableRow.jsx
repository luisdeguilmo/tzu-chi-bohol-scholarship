import ApplicationFormPDF from "../../../components/ApplicationFormPDF";
import TableRow from "../../../components/TableRow";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { usePdfActions } from "../../../hooks/usePdfActions";
import { formatDateTime } from "../../../utils/formatDateTime";

const UnassignedTableRow = ({
    currentItems,
    selectedApplicants,
    toggleApplicantSelection,
    profilePics,
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
                    <td className="py-2 pl-3 text-left whitespace-nowrap text-gray-500">
                        <input
                            type="checkbox"
                            className="h-3.5 w-3.5 accent-green-600 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            checked={selectedApplicants.includes(
                                info.application_id
                            )}
                            onChange={() =>
                                toggleApplicantSelection(info.application_id)
                            }
                        />
                    </td>
                    <td className="py-2 whitespace-nowrap text-gray-500">
                        {info.application_id}
                    </td>
                    <td className="py-2 flex whitespace-nowrap text-sm text-gray-700">
                        <div className="w-[25%]"></div>
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
                    <td className="py-2 whitespace-nowrap text-gray-500">
                        {info.batch || "Unassigned"}
                    </td>
                    <td className="py-2 whitespace-nowrap text-gray-500">
                        {formatDateTime(info.created_at)}
                    </td>
                    <td className="py-2 whitespace-nowrap text-gray-500">
                        {formatDateTime(info.approved_at)}
                    </td>
                    <td className="py-2 whitespace-nowrap font-medium">
                        <button
                            onClick={() => viewPdf(info.application_id)}
                            className="inline-flex items-center text-green-600 hover:text-green-900 mr-3"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </button>
                    </td>
                </TableRow>
            ))}
        </>
    );
};

export default UnassignedTableRow;
