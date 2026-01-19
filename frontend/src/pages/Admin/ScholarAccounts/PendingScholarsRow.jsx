import { Check } from "lucide-react";

const PendingScholarsRow = ({
    currentItems,
    selectedScholars,
    toggleScholarSelection,
    profilePics,
    onCreateAccount,
}) => {
    return (
        <>
            {currentItems.map((scholar) => (
                <tr
                    key={scholar.application_id}
                    className={`transition-colors text-center border-b border-gray-200 ${
                        selectedScholars.includes(scholar.application_id)
                            ? "bg-gray-50"
                            : ""
                    } text-xs`}
                >
                    <td className="pl-3 py-2 text-left whitespace-nowrap text-gray-500">
                        <input
                            type="checkbox"
                            className="h-3.5 w-3.5 accent-green-600 focus:ring-green-500 border-gray-300 rounded"
                            checked={selectedScholars.includes(
                                scholar.application_id
                            )}
                            onChange={() =>
                                toggleScholarSelection(scholar.application_id)
                            }
                            // disabled={scholar.application_status !== "pending"}
                        />
                    </td>
                    <td className="py-2 whitespace-nowrap text-gray-500">
                        {scholar.application_id}
                    </td>
                    <td className="py-2 flex justify-start whitespace-nowrap text-sm text-gray-700">
                        <div className="w-[30%]"></div>
                        <div className="w-[max-content] flex items-centerS text-left gap-2">
                            <img
                                src={profilePics[scholar.application_id]}
                                alt="Profile"
                                className="w-8 h-8 object-cover rounded-full mx-auto"
                            />
                            <div>
                                <p className="font-bold text-xs">
                                    {scholar.first_name +
                                        " " +
                                        scholar.last_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {scholar.email}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td className="py-2 whitespace-nowrap text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 rounded-full bg-yellow-100 text-yellow-900">
                            Pending
                        </span>
                    </td>
                    <td>
                        <button
                            onClick={() => {
                                onCreateAccount([scholar.application_id]);
                            }}
                            title="Approve Account"
                            className="p-2 rounded-xl hover:bg-green-50"
                        >
                            <Check className="w-4 h-4 text-green-600 hover:text-green-700" />
                        </button>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default PendingScholarsRow;
