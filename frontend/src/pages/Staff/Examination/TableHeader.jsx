import {
    batchesTableHeaders,
    resultTableHeaders,
    unassignedTableHeaders,
} from "../../../constant/tableHeaders";

const TableHeader = ({
    activeTab,
    currentItems,
    selectedApplicants,
    selectAllVisible,
}) => {
    return (
        <tr className="border-b border-gray-50">
            {activeTab !== "Result" && currentItems.length !== 0 && (
                <th className="pl-1 py-3 flex justify-center gap-2 text-center text-xs uppercase tracking-wider">
                    <input
                        type="checkbox"
                        className="h-3.5 w-3.5 accent-green-600 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        checked={
                            currentItems.length > 0 &&
                            selectedApplicants.length === currentItems.length
                        }
                        onChange={selectAllVisible}
                    />
                </th>
            )}
            {activeTab === "Applicants" ? (
                <>
                    {unassignedTableHeaders.map((header) => (
                        <th
                            className={`${header.style} py-3 text-center text-xs uppercase tracking-wider`}
                        >
                            {header.name}
                        </th>
                    ))}
                </>
            ) : activeTab === "Batches" ? (
                <>
                    {batchesTableHeaders.map((header) => (
                        <th
                            className={`${header.style} py-3 text-xs uppercase tracking-wider`}
                        >
                            {header.name}
                        </th>
                    ))}
                </>
            ) : (
                <>
                    {resultTableHeaders.map((header) => (
                        <th
                            className={`${header.style} py-3 text-xs uppercase tracking-wider`}
                        >
                            {header.name}
                        </th>
                    ))}
                </>
            )}
        </tr>
    );
};

export default TableHeader;
