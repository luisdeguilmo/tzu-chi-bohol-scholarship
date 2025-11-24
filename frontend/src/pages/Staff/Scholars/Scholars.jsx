import { useEffect, useState } from "react";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import { useProfilePicture } from "../../../hooks/useProfilePicture";
import { scholarButtons } from "../../../constant/tableToolbarButtons";
import { useScholars } from "../../../hooks/useScholars";
import { scholarTableHeaders } from "../../../constant/tableHeaders";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import { Eye, FileText, Loader2 } from "lucide-react";
import { getCurrentSchoolYear } from "../../../utils/getCurrentSchoolYear";
import ScholarProfileModal from "../../../components/UserProfileModal";
import { date } from "../../../utils/getDateAndTime";
import { generateExcel } from "../../../utils/generateExcel";
import { useScholarInformation } from "../../../hooks/useScholarInformation";
import { useCollegesUniversities } from "../../../hooks/useCollegesUniversities";
import { useScholarshipCriteria } from "../../../hooks/useScholarshipCriteria";
import CoaGradesModal from "./CoaGradesModal";
import { DataListView } from "../../../components/DataListView";
import { FilterDropdown } from "../../../components/FilterDropdown";

export default function Scholars() {
    const [searchTerm, setSearchTerm] = useState("");
    const [scholarId, setScholarId] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCoeGradeModalOpen, setIsCoeGradeModalOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [activeTab, setActiveTab] = useState("active");
    const [school, setSchool] = useState("all");
    const [course, setCourse] = useState("all");
    const [yearLevel, setYearLevel] = useState("all");
    const [status, setStatus] = useState("all");
    const [schoolYear, setSchoolYear] = useState(getCurrentSchoolYear());
    const [sortBy, setSortBy] = useState("newest");

    const { loading, scholars, fetchScholars } = useScholars(
        activeTab,
        status,
        schoolYear,
        school,
        course,
        yearLevel,
        sortBy
    );

    const { collegesAndUniversities } = useCollegesUniversities();
    const { items: courses } = useScholarshipCriteria("courses", "Courses");

    const { scholarsInformation, fetchScholarsInformation } =
        useScholarInformation(
            activeTab,
            status,
            schoolYear,
            school,
            course,
            yearLevel,
            sortBy
        );

    const { exportActiveScholars, exportGraduatedScholars } = generateExcel();

    const { profilePics } = useProfilePicture(scholars, "profile-picture");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchScholars();
        fetchScholarsInformation();
    }, [activeTab, status, schoolYear, school, course, yearLevel, sortBy]);

    const handleExport = async () => {
        setIsLoading(true);
        const fileName = `Scholar_Information_${date.getCurrentMonthFormatted()}_${date.getCurrentYear()}`;

        // Step 1: Export to Excel

        if (activeTab === "active") {
            const success = await exportActiveScholars(
                scholarsInformation,
                fileName
            );

            if (success) {
                setIsLoading(false);
            }
        } else {
            const success = await exportGraduatedScholars(
                scholarsInformation,
                fileName,
                schoolYear
            );

            if (success) {
                setIsLoading(false);
            }
        }
    };

    // Filter data based on search term
    const filteredScholars = scholars.filter(
        (applicant) =>
            applicant?.last_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant?.first_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant?.created_at?.includes(searchTerm)
    );

    const {
        currentItems,
        currentPage,
        setCurrentPage,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        goToPreviousPage,
        goToNextPage,
    } = usePagination(filteredScholars, itemsPerPage);

    const handleChangeTab = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
        setSelectedItems([]);
    };

    const handleRefresh = () => {
        fetchScholars(activeTab, status, schoolYear, school, course, sortBy);
        setSelectedItems([]);
    };

    return (
        <DataListView>
            <TableToolbar
                items={scholars}
                label={"Scholars"}
                placeholder={"scholars"}
                tab={activeTab}
                buttons={scholarButtons}
                searchTerm={searchTerm}
                itemsPerPage={itemsPerPage}
                sortBy={sortBy}
                sortedItems={filteredScholars}
                onRefresh={handleRefresh}
                onSort={setSortBy}
                onSearchChange={setSearchTerm}
                onChangeTab={handleChangeTab}
                onChangeItemsPerPage={setItemsPerPage}
                onChangeCurrentPage={setCurrentPage}
                firstIndex={indexOfFirstItem}
                lastIndex={indexOfLastItem}
                buttonExport={true}
                onExport={handleExport}
                exportLoading={isLoading}
                disabledButtonExport={scholars.length === 0}
            >
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-700">School:</span>
                    <select
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        className="w-[100px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                        <option value="all">All</option>
                        {collegesAndUniversities.map((item, index) => (
                            <option key={index} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
                {/* <FilterDropdown
                    label={"School"}
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    options={collegesAndUniversities}
                /> */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Course:</span>
                    <select
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-[100px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                        <option value="all">All</option>
                        {courses.map((item, index) => (
                            <option
                                key={index}
                                value={item.course.replaceAll("*", "").trim()}
                            >
                                {item.course.replaceAll("*", "").trim()}
                            </option>
                        ))}
                    </select>
                </div>

                {/* <FilterDropdown
                    label={"Course"}
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    options={courses}
                /> */}

                {activeTab === "active" && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">
                            Year Level:
                        </span>
                        <select
                            value={yearLevel}
                            onChange={(e) => setYearLevel(e.target.value)}
                            className="w-[100px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="all">All</option>
                            <option value={1}>1st Year</option>
                            <option value={2}>2nd Year</option>
                            <option value={3}>3rd Year</option>
                            <option value={4}>4th Year</option>
                            <option value={5}>5th Year</option>
                        </select>
                    </div>
                )}

                {/* <FilterDropdown
                    label={"Year Level"}
                    value={yearLevel}
                    onChange={(e) => setYearLevel(e.target.value)}
                    options={[
                        { name: "1st Year", value: 1 },
                        { name: "2nd Year", value: 2 },
                        { name: "3rd Year", value: 3 },
                        { name: "4th Year", value: 4 },
                        { name: "5th Year", value: 5 },
                    ]}
                /> */}

                {activeTab !== "graduated" && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Status:</span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-[100px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="all">All</option>
                            <option value="new">New Scholars</option>
                            <option value="old">Old Scholars</option>
                        </select>
                    </div>
                )}

                {/* <FilterDropdown
                    label={"Type"}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={[
                        { name: "New Scholars", value: "new" },
                        { name: "Old Scholars", value: "old" },
                    ]}
                /> */}

                {activeTab !== "active" && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">
                            School Year:
                        </span>
                        <select
                            value={schoolYear}
                            onChange={(e) => setSchoolYear(e.target.value)}
                            className="px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="all_years">All Years</option>
                            <option value="2025-2026">2025-2026</option>
                            <option value="2024-2025">2024-2025</option>
                        </select>
                    </div>
                )}

                {/* <FilterDropdown
                    label={"Type"}
                    value={schoolYear}
                    onChange={(e) => setSchoolYear(e.target.value)}
                    options={[
                        { name: "2025-2026", value: "2025-2026" },
                        { name: "2024-2025", value: "2024-2025" },
                    ]}
                /> */}
            </TableToolbar>

            <div className="overflow-x-auto rounded-[4px]">
                <Table tableHeaders={scholarTableHeaders}>
                    {loading && (
                        <tr>
                            <td colSpan={6} className="p-6">
                                <div className="flex pt-4 items-center justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                                    <span className="ml-2 text-[16px] text-gray-600">
                                        Loading...
                                    </span>
                                </div>
                            </td>
                        </tr>
                    )}

                    {!loading &&
                        currentItems.map((scholar, index) => (
                            <tr
                                key={index}
                                className={`border-b border-gray-100 transition-colors text-center hover:bg-gray-50 ${
                                    selectedItems.includes(scholar.account_id)
                                        ? "bg-blue-50"
                                        : ""
                                }`}
                            >
                                <td className="py-2 text-xs whitespace-nowrap text-center text-gray-600 font-bold">
                                    {scholar.account_id}
                                </td>
                                <td className="py-2 text-center flex justify-start whitespace-nowrap text-sm text-gray-700">
                                    <div className="w-[20%]"></div>
                                    <div className="w-[max-content] flex text-left gap-2">
                                        <img
                                            src={
                                                profilePics[scholar.account_id]
                                            }
                                            alt="Profile"
                                            className="w-10 h-10 object-cover rounded-full mx-auto"
                                        />
                                        <div className="flex justify-center flex-col">
                                            <p className="font-bold text-gray-700 text-xs">
                                                {scholar.first_name +
                                                    " " +
                                                    scholar.last_name}
                                            </p>
                                            <p className="text-[11px] text-gray-500/90">
                                                {scholar.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2 text-center whitespace-nowrap text-gray-500">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg font-medium`}
                                    >
                                        {scholar.year_level === 1
                                            ? "1st Year"
                                            : scholar.year_level === 2
                                              ? "2nd Year"
                                              : scholar.year_level === 3
                                                ? "3rd Year"
                                                : scholar.year_level === 4
                                                  ? "4th Year"
                                                  : "5th Year"}
                                    </span>
                                </td>
                                <td className="py-2 text-center whitespace-nowrap text-gray-500">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg font-medium`}
                                    >
                                        {scholar.present_school}
                                    </span>
                                </td>
                                <td className="py-2 whitespace-nowrap text-slate-600 text-center font-medium">
                                    {scholar.present_course1}
                                </td>
                                <td className="py-2 whitespace-nowrap font-medium">
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={() => {
                                                setIsModalOpen(true);
                                                setScholarId(
                                                    scholar.account_id
                                                );
                                            }}
                                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                            title="View Profile"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsCoeGradeModalOpen(true);
                                                setScholarId(
                                                    scholar.account_id
                                                );
                                            }}
                                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                            title="COE and Grades"
                                        >
                                            <FileText className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </Table>

                {/* Empty state */}
                {currentItems.length === 0 && !loading && (
                    <EmptyState message="No scholars found." />
                )}
            </div>

            {/* Pagination */}
            {filteredScholars.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Show:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrevious={goToPreviousPage}
                        onNext={goToNextPage}
                        indexOfFirstItem={indexOfFirstItem}
                        indexOfLastItem={indexOfLastItem}
                        totalItems={filteredScholars.length}
                        itemLabel={"applications"}
                    />
                </div>
            )}

            <ScholarProfileModal
                userId={scholarId}
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                isScholar={true}
            />

            <CoaGradesModal
                scholarId={scholarId}
                isOpen={isCoeGradeModalOpen}
                onClose={setIsCoeGradeModalOpen}
            />
        </DataListView>
    );
}
