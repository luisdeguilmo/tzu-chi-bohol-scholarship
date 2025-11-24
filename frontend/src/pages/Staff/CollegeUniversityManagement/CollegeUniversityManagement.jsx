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

export default function CollegeUniversityManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isOpenFormModal, setIsOpenFormModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedCollegeUniversity, setSelectedCollegeUniversity] =
        useState("");
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);

    const [selectedItem, setSelectedItem] = useState(null);
    const [year, setYear] = useState("2025");
    const [status, setStatus] = useState("all");

    const {
        isLoading,
        collegesAndUniversities,
        addCollegeOrUniversity,
        deleteCollegeOrUniversity,
        updateCollegeOrUniversity,
        fetchCollegesAndUniversities,
    } = useCollegesUniversities();

    const {
        isLoading: isLoadingForCourse,
        coursesAccepted,
        addCourse,
        updateCourse,
        deleteCourse,
        fetchCoursesAccepted,
    } = useCoursesAccepted(selectedId);

    useEffect(() => {
        fetchCollegesAndUniversities();
        fetchCoursesAccepted();
    }, [selectedId]);

    // Filter data based on search term
    const filteredEvents = collegesAndUniversities.filter((event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedApplications = [...filteredEvents].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.date) - new Date(a.date);
            case "oldest":
                return new Date(a.date) - new Date(b.date);
            case "name":
                return a.first_name.localeCompare(b.first_name);
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

    const handleRefresh = () => {
        fetchCollegesAndUniversities();
        // setSelectedItems([]);
    };

    return (
        <DataListView>
            <TableToolbar
                items={collegesAndUniversities}
                label={"College & University Management"}
                buttonLabel={"College or University"}
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
            ></TableToolbar>

            {/* Table */}
            <div className="overflow-x-auto rounded-[4px]">
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

                            <td className="py-3 text-center whitespace-nowrap font-medium">
                                <button
                                    onClick={() => {
                                        setIsFormModalOpen(true);
                                        setSelectedId(item.id);
                                        setSelectedCollegeUniversity(item.name);
                                    }}
                                    className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
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
                            </td>
                        </tr>
                    ))}
                </Table>

                {/* Empty state */}
                {currentItems.length === 0 && (
                    <EmptyState message="No events found." />
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
