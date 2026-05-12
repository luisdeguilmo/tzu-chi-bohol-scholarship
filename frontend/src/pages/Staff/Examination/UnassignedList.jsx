import { Eye } from "lucide-react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { usePdfActions } from "../../../hooks/usePdfActions";
import { TableButtonAction } from "../../../components/TableButtonAction";

export const UnassignedList = ({
    item,
    index,
    tableHeaders,
    selectedApplicants,
    toggleApplicantSelection,
}) => {
    const { fetchApplicantData } = useApplicantData();
    const { viewPdf } = usePdfActions("new", fetchApplicantData);

    return (
        <div className="relative p-4 border rounded-md bg-gray-50">
            <div className="absolute top-4 right-4 text-left whitespace-nowrap text-gray-500">
                <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-green-600 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    checked={selectedApplicants.includes(item.application_id)}
                    onChange={() =>
                        toggleApplicantSelection(item.application_id)
                    }
                />
            </div>
            <div className="mb-2 font-normal text-gray-600">
                <div className="w-[max-content] flex items-center text-left gap-2">
                    <img
                        src={item[0].profile}
                        alt="Profile"
                        className="w-10 h-10 object-cover rounded-full mx-auto"
                    />
                    <div>
                        <p className="font-bold text-xs">
                            {item.first_name + " " + item.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{item.email}</p>
                    </div>
                </div>
            </div>
            <div key={index} className="flex gap-6 ">
                <div className="space-y-2">
                    {tableHeaders
                        .filter((item) => item.name !== "Applicant")
                        .map((header, index) => (
                            <p
                                key={index}
                                className="text-xs font-bold text-gray-800"
                            >
                                {header.name}
                            </p>
                        ))}
                </div>
                <div className="text-xs space-y-2">
                    <p className="font-normal text-gray-600">
                        {item.application_id}
                    </p>
                    <p className="font-normal text-gray-600">
                        {item.batch || "Unassigned"}
                    </p>
                    <p className="font-normal text-gray-600">
                        {formatDateTime(item.created_at)}
                    </p>
                    <p className="font-normal text-gray-600">
                        {formatDateTime(item.approved_at) || "--"}
                    </p>

                    <TableButtonAction
                        onClick={() =>
                            viewPdf({
                                applicationId: item.application_id,
                                scholarId: null,
                            })
                        }
                        button={{
                            title: "View PDF",
                            icon: <Eye className="w-4 h-4" />,
                            color: "blue",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
