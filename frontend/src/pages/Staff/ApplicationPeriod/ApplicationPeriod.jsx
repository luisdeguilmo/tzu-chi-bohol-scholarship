import { useEffect, useState } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import { useApplicationPeriods } from "../../../hooks/useApplicationPeriods";
import { applicationPeriodTableHeaders } from "../../../constant/tableHeaders";
import { Pen, PenLine, Plus, Trash, Trash2 } from "lucide-react";
import ApplicationPeriodFormModal from "./ApplicationPeriodFormModal";
import { usePeriod } from "../../../context/PeriodContext";
import { DataListView } from "../../../components/DataListView";
import TableToolbar from "../../../components/TableToolbar";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { TableButtonAction } from "../../../components/TableButtonAction";

const ApplicationPeriod = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedApplicationPeriod, setSelectedApplicationPeriod] =
        useState("");
    const { deleteApplicationPeriod } = useApplicationPeriods();
    const size = useWindowSize();
    const isMobile = size.width < 768;

    const {
        isModalOpen,
        setId,
        setStartDate,
        setEndDate,
        setAnnouncementMessage,
        setStatus,
        setIsModalOpen,
        setIsEditing,
    } = usePeriod();

    const {
        applicationPeriods,
        hasActiveNewApplicationPeriod,
        hasActiveRenewalApplicationPeriod,
        fetchApplicationPeriods,
    } = useApplicationPeriods();

    useEffect(() => {
        fetchApplicationPeriods();
    }, []);

    const handleDelete = async (id) => {
        await deleteApplicationPeriod(id);
        await fetchApplicationPeriods();
    };

    // Filter data based on search term
    const filteredApplicationPeriods = applicationPeriods.filter(
        (application) =>
            application.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort applications
    const sortedApplicationPeriods = [...filteredApplicationPeriods].sort(
        (a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.created_at) - new Date(a.created_at);
                case "oldest":
                    return new Date(a.created_at) - new Date(b.created_at);
                case "name":
                    return a.first_name.localeCompare(b.first_name);
                default:
                    return 0;
            }
        }
    );

    const handlePeriodToEdit = (applicationPeriod) => {
        setIsEditing(true);
        setIsModalOpen(true);
        setId(applicationPeriod.id);
        setStartDate(applicationPeriod.start_date);
        setEndDate(applicationPeriod.end_date);
        setAnnouncementMessage(applicationPeriod.announcement_message);
        setStatus(applicationPeriod.status);
    };

    const {
        currentItems,
        currentPage,
        setCurrentPage,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        goToPreviousPage,
        goToNextPage,
        setNumberOfItemsPerPage,
    } = usePagination(sortedApplicationPeriods, itemsPerPage);

    const handleRefresh = () => {
        fetchApplicationPeriods();
    };

    return (
        <DataListView>
            {/* Header */}
            <TableToolbar
                items={currentItems}
                label={"Application Periods"}
                placeholder={"application periods"}
                searchTerm={searchTerm}
                itemsPerPage={itemsPerPage}
                sortBy={sortBy}
                onRefresh={handleRefresh}
                onSort={setSortBy}
                sortedItems={sortedApplicationPeriods}
                onSearchChange={setSearchTerm}
                onChangeItemsPerPage={setItemsPerPage}
                onChangeCurrentPage={setCurrentPage}
                onChangeNumberOfItemsPerPage={setNumberOfItemsPerPage}
                firstIndex={indexOfFirstItem}
                lastIndex={indexOfLastItem}
                onOpen={setIsModalOpen}
                addButton={true}
                button={{
                    icon: <Plus className="w-4 h-4 text-white" />,
                    label: "Add Application Period",
                }}
            />

            <div
                className={`${isMobile && "flex flex-col gap-2"} overflow-x-auto rounded-[4px]`}
            >
                {isMobile ? (
                    currentItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex gap-6 p-4 border rounded-md bg-gray-50"
                        >
                            <div className="space-y-2">
                                {applicationPeriodTableHeaders.map(
                                    (header, index) => (
                                        <p
                                            key={index}
                                            className="text-xs font-bold text-gray-800"
                                        >
                                            {header.name[0]
                                                .toUpperCase()
                                                .concat(
                                                    header.name
                                                        .substring(
                                                            1,
                                                            header.name.length
                                                        )
                                                        .toLowerCase()
                                                )}
                                        </p>
                                    )
                                )}
                            </div>
                            <div className="text-xs space-y-2">
                                <p className="font-normal text-gray-600">
                                    {formatDateTime(item.start_date)}
                                </p>
                                <p className="font-normal text-gray-600">
                                    {formatDateTime(item.end_date)}
                                </p>
                                <p className="font-normal text-gray-600">
                                    {item.type === "new" ? "New" : "Renewal"}
                                </p>
                                <p className="font-normal text-gray-600">
                                    <span
                                        className={`inline-flex px-2 text-xs rounded-full ${
                                            item.status === "Active"
                                                ? "bg-green-100 text-green-800"
                                                : item.status === "Pending"
                                                  ? "bg-yellow-100 text-yellow-800"
                                                  : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {item.status}
                                    </span>
                                </p>

                                <p className="font-normal text-gray-600">
                                    {item.announcement_message}
                                </p>

                                <TableButtonAction
                                    onClick={() => {
                                        setSelectedApplicationPeriod(item.type);
                                        handlePeriodToEdit(item);
                                    }}
                                    button={{
                                        title: "Edit",
                                        icon: <PenLine className="w-4 h-4" />,
                                        color: "blue",
                                    }}
                                />
                                <TableButtonAction
                                    onClick={() => handleDelete(item.id)}
                                    button={{
                                        title: "Delete",
                                        icon: <Trash2 className="w-4 h-4" />,
                                        color: "red",
                                    }}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <table className="lg:w-[100%] min-w-[1000px] relative">
                        <thead className="bg-gray-50 text-gray-700 font-bold">
                            <tr className="border-y border-gray-100">
                                {applicationPeriodTableHeaders.map(
                                    (header, index) => (
                                        <th
                                            key={index}
                                            scope="col"
                                            className={`${header.style} py-3 text-xs uppercase tracking-wider`}
                                        >
                                            {header.name}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white text-xs">
                            {currentItems.map((applicationPeriod) => (
                                <tr
                                    key={applicationPeriod.id}
                                    className="hover:bg-gray-50 border-b border-gray-100 transition-colors text-center text-xs"
                                >
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {formatDateTime(
                                            applicationPeriod.start_date
                                        )}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {formatDateTime(
                                            applicationPeriod.end_date
                                        )}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {applicationPeriod.type === "new"
                                            ? "New"
                                            : "Renewal"}
                                    </td>
                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                                applicationPeriod.status ===
                                                "Active"
                                                    ? "bg-green-100 text-green-800"
                                                    : applicationPeriod.status ===
                                                        "Pending"
                                                      ? "bg-yellow-100 text-yellow-800"
                                                      : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {applicationPeriod.status}
                                        </span>
                                    </td>

                                    <td className="py-3 whitespace-nowrap text-gray-500">
                                        {applicationPeriod.announcement_message}
                                    </td>
                                    <td className="py-3 whitespace-nowrap font-medium">
                                        <TableButtonAction
                                            onClick={() => {
                                                setSelectedApplicationPeriod(
                                                    applicationPeriod.type
                                                );
                                                handlePeriodToEdit(
                                                    applicationPeriod
                                                );
                                            }}
                                            button={{
                                                title: "Edit",
                                                icon: (
                                                    <PenLine className="w-4 h-4" />
                                                ),
                                                color: "blue",
                                            }}
                                        />
                                        <TableButtonAction
                                            onClick={() =>
                                                handleDelete(
                                                    applicationPeriod.id
                                                )
                                            }
                                            button={{
                                                title: "Delete",
                                                icon: (
                                                    <Trash2 className="w-4 h-4" />
                                                ),
                                                color: "red",
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Empty state */}
                {currentItems.length === 0 && (
                    <EmptyState message="No application periods found." />
                )}
            </div>

            {/* Pagination */}
            {sortedApplicationPeriods.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrevious={goToPreviousPage}
                        onNext={goToNextPage}
                        indexOfFirstItem={indexOfFirstItem}
                        indexOfLastItem={indexOfLastItem}
                        totalItems={sortedApplicationPeriods.length}
                        itemLabel={"applications"}
                    />
                </div>
            )}

            <ApplicationPeriodFormModal
                isOpen={isModalOpen}
                onClose={setIsModalOpen}
                onRefresh={fetchApplicationPeriods}
                selectedApplicationPeriod={selectedApplicationPeriod}
                disabledNew={hasActiveNewApplicationPeriod}
                disabledRenewal={hasActiveRenewalApplicationPeriod}
            />
        </DataListView>
    );
};

export default ApplicationPeriod;
