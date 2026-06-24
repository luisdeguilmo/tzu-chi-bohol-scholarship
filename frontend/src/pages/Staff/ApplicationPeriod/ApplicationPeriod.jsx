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
import { date } from "../../../utils/getDateAndTime";
import BASE_URL from "../../../config";
import axios from "axios";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { toast } from "react-toastify";
import { useSchoolYearContext } from "../../../context/SchoolYearContext";

const ApplicationPeriod = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedApplicationPeriod, setSelectedApplicationPeriod] =
        useState("");
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const size = useWindowSize();
    const isMobile = size.width < 768;

    const {
        isModalOpen,
        setId,
        setStartDate,
        setEndDate,
        setSchoolYear,
        setAnnouncementMessage,
        setStatus,
        setIsModalOpen,
        setIsEditing,
    } = usePeriod();

    const {
        loading,
        applicationPeriods,
        hasActiveNewApplicationPeriod,
        hasActiveRenewalApplicationPeriod,
        getSchoolYear,
        fetchApplicationPeriods,
        deleteApplicationPeriod,
    } = useApplicationPeriods();

    const { schoolYears, activeSchoolYear } = useSchoolYearContext();

    useEffect(() => {
        fetchApplicationPeriods();
    }, []);

    const handleDelete = async (item) => {
        if (item.status === "Active") {
            toast.error("Cannot delete active application period.");
            setIsConfirmationModalOpen(false);
            return;
        }

        if (item.school_year === activeSchoolYear) {
            toast.error(
                "Cannot delete current school year's application period.",
            );
            setIsConfirmationModalOpen(false);
            return;
        }

        const success = await deleteApplicationPeriod(item.id);
        if (success) {
            await fetchApplicationPeriods();
            setIsConfirmationModalOpen(false);
        }
    };

    // Filter data based on search term
    const filteredApplicationPeriods = applicationPeriods.filter(
        (application) =>
            application.status.toLowerCase().includes(searchTerm.toLowerCase()),
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
        },
    );

    const handlePeriodToEdit = (applicationPeriod) => {
        setIsEditing(true);
        setIsModalOpen(true);
        setId(applicationPeriod.id);
        setStartDate(applicationPeriod.start_date);
        setEndDate(applicationPeriod.end_date);
        setSchoolYear(applicationPeriod.school_year);
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
                                                            header.name.length,
                                                        )
                                                        .toLowerCase(),
                                                )}
                                        </p>
                                    ),
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
                                        setSelectedApplicationPeriod(item);
                                        handlePeriodToEdit(item);
                                    }}
                                    button={{
                                        title: "Edit",
                                        icon: <PenLine className="w-4 h-4" />,
                                        color: "blue",
                                    }}
                                />
                                <TableButtonAction
                                    onClick={() => {
                                        setIsConfirmationModalOpen(true);
                                        setSelectedItem(item);
                                    }}
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
                                    ),
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white text-xs">
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
                                currentItems.map((applicationPeriod) => (
                                    <tr
                                        key={applicationPeriod.id}
                                        className="hover:bg-gray-50 border-b border-gray-100 transition-colors text-center text-xs"
                                    >
                                        <td className="py-3 whitespace-nowrap text-gray-500">
                                            {formatDateTime(
                                                applicationPeriod.start_date,
                                            )}
                                        </td>
                                        <td className="py-3 whitespace-nowrap text-gray-500">
                                            {formatDateTime(
                                                applicationPeriod.end_date,
                                            )}
                                        </td>
                                        <td className="py-3 whitespace-nowrap text-gray-500">
                                            {applicationPeriod.school_year}
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

                                        <td className="py-3 w-[40%] text-justify text-gray-500">
                                            {
                                                applicationPeriod.announcement_message
                                            }
                                        </td>
                                        <td className="py-3 whitespace-nowrap flex items-center justify-center font-medium">
                                            <TableButtonAction
                                                onClick={() => {
                                                    setSelectedApplicationPeriod(
                                                        applicationPeriod,
                                                    );
                                                    handlePeriodToEdit(
                                                        applicationPeriod,
                                                    );
                                                }}
                                                button={{
                                                    title: "Edit",
                                                    disabled:
                                                        applicationPeriod.created_at?.substring(
                                                            0,
                                                            4,
                                                        ) !==
                                                        date
                                                            .getCurrentYear()
                                                            .toString(),
                                                    icon: (
                                                        <PenLine className="w-4 h-4" />
                                                    ),
                                                    color: "blue",
                                                }}
                                            />
                                            <TableButtonAction
                                                onClick={() => {
                                                    setIsConfirmationModalOpen(
                                                        true,
                                                    );
                                                    setSelectedItem(
                                                        applicationPeriod,
                                                    );
                                                }}
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
                {currentItems.length === 0 && !loading && (
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

            {isModalOpen && (
                <ApplicationPeriodFormModal
                    isOpen={isModalOpen}
                    onClose={setIsModalOpen}
                    onRefresh={fetchApplicationPeriods}
                    selectedApplicationPeriod={selectedApplicationPeriod}
                    disabledNew={hasActiveNewApplicationPeriod}
                    disabledRenewal={hasActiveRenewalApplicationPeriod}
                />
            )}

            {isConfirmationModalOpen && (
                <ConfirmationModal
                    isOpen={isConfirmationModalOpen}
                    onClose={setIsConfirmationModalOpen}
                    isLoading={loading}
                    label={"Confirmation"}
                    message={"Are you sure you want to delete this item?"}
                    onClick={() => handleDelete(selectedItem)}
                />
            )}
        </DataListView>
    );
};

export default ApplicationPeriod;
