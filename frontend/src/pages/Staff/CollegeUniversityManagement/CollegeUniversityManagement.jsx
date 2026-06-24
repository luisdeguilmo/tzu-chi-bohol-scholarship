import { useEffect, useState } from "react";
import EmptyState from "../../../components/EmptyState";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import { collegesUniversitiesTableHeaders } from "../../../constant/tableHeaders";
import { useCollegesUniversities } from "../../../hooks/useCollegesUniversities";
import AddCollegeUniversityForm from "./AddCollegeUniversityForm";
import ConfirmationModal from "../../../components/ConfirmationModal";
import EditFormModal from "./EditFormModal";
import { useCoursesAccepted } from "../../../hooks/useCoursesAccepted";
import { DataListView } from "../../../components/DataListView";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { Eye, EyeClosed, EyeOff, PenBox, Plus } from "lucide-react";

export default function CollegeUniversityManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isOpenFormModal, setIsOpenFormModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [filter, setFilter] = useState("all");
    const [selectedCollegeUniversity, setSelectedCollegeUniversity] =
        useState("");
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);

    const [selectedItem, setSelectedItem] = useState(null);
    const size = useWindowSize();
    const isMobile = size.width < 768;

    const {
        isLoading,
        collegesAndUniversities,
        addCollegeOrUniversity,
        deleteCollegeOrUniversity,
        updateCollegeOrUniversity,
        updateVisibility,
        fetchCollegesAndUniversities,
    } = useCollegesUniversities(filter);

    const {
        isLoading: isLoadingForCourse,
        coursesAccepted,
        addCourse,
        updateCourse,
        deleteCourse,
        fetchCoursesAccepted,
    } = useCoursesAccepted(selectedId);

    useEffect(() => {
        fetchCollegesAndUniversities(filter);
        fetchCoursesAccepted();
    }, [selectedId, filter]);

    // Filter data based on search term
    const filteredEvents = collegesAndUniversities.filter((event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const sortedApplications = [...filteredEvents].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.created_at) - new Date(a.created_at);
            case "oldest":
                return new Date(a.created_at) - new Date(b.created_at);
            case "name":
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    const {
        currentItems,
        currentPage,
        setCurrentPage,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        numberOfItemsPerPage,
        setNumberOfItemsPerPage,
        goToPreviousPage,
        goToNextPage,
    } = usePagination(sortedApplications, itemsPerPage);

    const handleDelete = async () => {
        const success = await deleteCollegeOrUniversity(selectedItem);
        if (success) {
            setIsConfirmationModalOpen(false);
            fetchCollegesAndUniversities();
        }
    };

    const handleToggleVisibility = async (id, name, is_visible) => {
        const success = await updateVisibility(id, name, is_visible);

        if (success) {
            fetchCollegesAndUniversities();
        }
    };

    const handleRefresh = () => {
        fetchCollegesAndUniversities();
        // setSelectedItems([]);
    };

    return (
        <DataListView>
            <TableToolbar
                items={collegesAndUniversities}
                label={"College & University Management"}
                placeholder={"colleges or universities"}
                searchTerm={searchTerm}
                itemsPerPage={itemsPerPage}
                sortBy={sortBy}
                sortedItems={sortedApplications}
                onOpen={setIsOpenFormModal}
                onRefresh={handleRefresh}
                onSort={setSortBy}
                onSearchChange={setSearchTerm}
                onChangeItemsPerPage={setItemsPerPage}
                onChangeCurrentPage={setCurrentPage}
                onChangeNumberOfItemsPerPage={setNumberOfItemsPerPage}
                firstIndex={indexOfFirstItem}
                lastIndex={indexOfLastItem}
                addButton={true}
                button={{
                    icon: <Plus className="w-4 h-4 text-white" />,
                    label: "Add New School",
                }}
                sortItems={[
                    {
                        label: "Newest First",
                        value: "newest",
                    },
                    {
                        label: "Oldest First",
                        value: "oldest",
                    },
                    {
                        label: "Name (A-Z)",
                        value: "name",
                    },
                ]}
            >
                <div className="flex justify-between items-center gap-2">
                    <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                        Filter:
                    </span>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                        <option value="all">All</option>
                        <option value="visible">Visible</option>
                        <option value="hidden">Hidden</option>
                    </select>
                </div>
            </TableToolbar>

            {/* Table */}
            <div
                className={`${isMobile && "flex flex-col gap-2"} overflow-x-auto rounded-[4px]`}
            >
                {isMobile ? (
                    currentItems.map((item, index) => (
                        <div
                            key={index}
                            className="p-4 border rounded-md bg-gray-50 space-y-2"
                        >
                            <p className="text-xs font-bold text-gray-900">
                                School
                                <span className="ml-4 font-normal text-gray-600">
                                    {item.name}
                                </span>
                            </p>
                            <div className="flex">
                                <p className="text-xs font-bold text-gray-900">
                                    Action
                                </p>
                                <button
                                    onClick={() => {
                                        setIsFormModalOpen(true);
                                        setSelectedId(item.id);
                                        setSelectedCollegeUniversity(item);
                                    }}
                                    className="ml-4 inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsConfirmationModalOpen(true);
                                        setSelectedItem(item.id);
                                    }}
                                    className="inline-flex items-center text-red-600 hover:text-red-900"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <Table
                        tableHeaders={collegesUniversitiesTableHeaders}
                        hasNumberColumn={true}
                    >
                        {currentItems.map((item, index) => (
                            <tr
                                key={item.id}
                                className="transition-colors text-center border-b border-gray-100 hover:bg-gray-50"
                            >
                                <td
                                    className={`pl-1 py-3 whitespace-nowrap text-gray-500`}
                                >
                                    {`${numberOfItemsPerPage + index + 1}.`}
                                </td>
                                <td className="py-3 pl-6 whitespace-nowrap text-gray-700">
                                    <p className="text-left">{item.name}</p>
                                </td>
                                <td className="py-3 pr-60 whitespace-nowrap text-gray-700">
                                    <p className="text-center">
                                        {item.type
                                            .charAt(0)
                                            .toUpperCase()
                                            .concat(item.type.substring(1))}
                                    </p>
                                </td>
                                <td className="py-3 pr-40 text-left whitespace-nowrap text-gray-700">
                                    <span
                                        className={`inline-flex px-2.5 py-0.5 rounded-lg ${
                                            item.is_visible
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-400"
                                        }`}
                                    >
                                        {item.is_visible ? "Visible" : "Hidden"}
                                    </span>
                                </td>

                                <td className="py-3 text-center whitespace-nowrap font-medium">
                                    <button
                                        onClick={() =>
                                            handleToggleVisibility(
                                                item.id,
                                                item.name,
                                                !item.is_visible,
                                            )
                                        }
                                        className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        {item.is_visible ? (
                                            <Eye className="h-4 w-4 mr-1 text-blue-600" />
                                        ) : (
                                            <EyeOff className="h-4 w-4 mr-1 text-blue-600" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsFormModalOpen(true);
                                            setSelectedId(item.id);
                                            setSelectedCollegeUniversity(item);
                                        }}
                                        className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        <PenBox className="h-3.5 w-4 mr-1 text-green-600" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsConfirmationModalOpen(true);
                                            setSelectedItem(item.id);
                                        }}
                                        className="inline-flex items-center text-red-600 hover:text-red-900"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7"
                                            />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}

                {/* Empty state */}
                {currentItems.length === 0 && (
                    <EmptyState message="No college & university found." />
                )}
            </div>

            <div className="flex justify-between items-center mt-6">
                {/* Pagination */}
                {collegesAndUniversities.length > 0 && (
                    <div className="flex justify-end gap-4 items-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrevious={goToPreviousPage}
                            onNext={goToNextPage}
                            indexOfFirstItem={indexOfFirstItem}
                            indexOfLastItem={indexOfLastItem}
                            totalItems={filteredEvents.length}
                            itemLabel={"colleges or universities"}
                        />
                    </div>
                )}
            </div>

            <AddCollegeUniversityForm
                isOpen={isOpenFormModal}
                onClose={setIsOpenFormModal}
                onAddItem={addCollegeOrUniversity}
                onSuccess={fetchCollegesAndUniversities}
                onRefresh={fetchCollegesAndUniversities}
                isLoading={isLoading}
            />

            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={setIsConfirmationModalOpen}
                isLoading={isLoading}
                label={"Confirmation"}
                message={"Are you sure you want to delete this item?"}
                onClick={handleDelete}
            />

            <EditFormModal
                isOpen={isFormModalOpen}
                setIsOpen={setIsFormModalOpen}
                label={"Edit Item"}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                collegeUniversity={selectedCollegeUniversity}
                isLoadingForCourse={isLoadingForCourse}
                coursesAccepted={coursesAccepted}
                onAddCourse={addCourse}
                onUpdateCourse={updateCourse}
                onDeleteCourse={deleteCourse}
                onUpdateCollegeUniversity={updateCollegeOrUniversity}
                onRefresh={handleRefresh}
                onRefreshCourse={fetchCoursesAccepted}
                isLoading={isLoading}
            />
        </DataListView>
    );
}
