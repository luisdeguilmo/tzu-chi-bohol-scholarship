import { useEffect, useState } from "react";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import { scholarButtons } from "../../../constant/tableToolbarButtons";
import { useScholars } from "../../../hooks/useScholars";
import { scholarTableHeaders } from "../../../constant/tableHeaders";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import { Eye, FileText, Loader2 } from "lucide-react";
import ScholarProfileModal from "../../../components/UserProfileModal";
import { date } from "../../../utils/getDateAndTime";
import { generateExcel } from "../../../utils/generateExcel";
import { useScholarInformation } from "../../../hooks/useScholarInformation";
import { useCollegesUniversities } from "../../../hooks/useCollegesUniversities";
import { useScholarshipCriteria } from "../../../hooks/useScholarshipCriteria";
import CoaGradesModal from "./CoaGradesModal";
import { DataListView } from "../../../components/DataListView";
import { FilterDropdown } from "../../../components/FilterDropdown";
import { useSubmissions } from "../../../hooks/useSubmissions";
import { useSchoolYearContext } from "../../../context/SchoolYearContext";

export default function Scholars() {
    const [searchTerm, setSearchTerm] = useState("");
    const [scholarId, setScholarId] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedScholar, setSelectedScholar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCoeGradeModalOpen, setIsCoeGradeModalOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [activeTab, setActiveTab] = useState("active");
    const [school, setSchool] = useState("all");
    const [course, setCourse] = useState("all");
    const [yearLevel, setYearLevel] = useState("all");
    const [status, setStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const { schoolYears, activeSchoolYear } = useSchoolYearContext();
    const [schoolYear, setSchoolYear] = useState(activeSchoolYear);

    const { loading, scholars, fetchScholars } = useScholars(
        activeTab,
        status,
        schoolYear,
        school,
        course,
        yearLevel,
        sortBy,
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
            sortBy,
        );

    const { exportActiveScholars, exportGraduatedScholars } = generateExcel();

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
                fileName,
            );

            if (success) {
                setIsLoading(false);
            }
        } else {
            const success = await exportGraduatedScholars(
                scholarsInformation,
                fileName,
                schoolYear,
            );

            if (success) {
                setIsLoading(false);
            }
        }
    };

    // Filter data based on search term
    const filteredScholars = scholars.filter(
        (applicant) =>
            applicant?.account_id?.toString().includes(searchTerm.toString()) ||
            applicant?.last_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant?.first_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant?.created_at?.includes(searchTerm),
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
                sortedItems={filteredScholars}
                onRefresh={handleRefresh}
                onSort={setSortBy}
                onSearchChange={setSearchTerm}
                onChangeTab={handleChangeTab}
                onChangeItemsPerPage={setItemsPerPage}
                onChangeCurrentPage={setCurrentPage}
                firstIndex={indexOfFirstItem}
                lastIndex={indexOfLastItem}
                buttonExport={
                    activeTab === "active" || activeTab === "graduated"
                }
                onExport={handleExport}
                exportLoading={isLoading}
                disabledButtonExport={scholars.length === 0}
            >
                <div className="flex justify-between items-center gap-2">
                    <span className="w-[60px] md:w-[max-content] text-xs text-gray-700">
                        School:
                    </span>
                    <select
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
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
                <div className="flex justify-between items-center gap-2">
                    <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                        Course:
                    </span>
                    <select
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
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

                {activeTab === "active" && (
                    <div className="flex justify-between items-center gap-2">
                        <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                            Year Level:
                        </span>
                        <select
                            value={yearLevel}
                            onChange={(e) => setYearLevel(e.target.value)}
                            className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
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

                {activeTab !== "graduated" && (
                    <div className="flex justify-between items-center gap-2">
                        <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                            Status:
                        </span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="all">All</option>
                            <option value="new">New</option>
                            <option value="old">Old</option>
                        </select>
                    </div>
                )}

                {activeTab !== "active" && (
                    <div className="flex justify-between items-center gap-2">
                        <span className="w-[60px] md:w-[max-content] text-xs text-gray-600">
                            School Year:
                        </span>
                        <select
                            value={schoolYear}
                            onChange={(e) => setSchoolYear(e.target.value)}
                            className="w-[150px] px-3 py-1 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="all_years">All Years</option>
                            {schoolYears.map((schoolYear) => (
                                <option
                                    key={schoolYear.id}
                                    value={schoolYear.school_year}
                                >
                                    {schoolYear.school_year}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </TableToolbar>

            <div className="overflow-x-auto rounded-[4px]">
                <Table tableHeaders={scholarTableHeaders}>
                    {loading && (
                        <tr>
                            <td colSpan={6} className="p-6">
                                <div className=" flex flex-col items-center gap-4">
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
                        currentItems.map((scholar, index) => (
                            <tr
                                key={index}
                                className={`border-b border-gray-100 transition-colors text-center hover:bg-gray-50 ${
                                    selectedItems.includes(scholar.account_id)
                                        ? "bg-blue-50"
                                        : ""
                                }`}
                            >
                                <td className="py-2.5 text-xs whitespace-nowrap text-center text-gray-600 font-bold">
                                    {scholar.account_id}
                                </td>
                                <td className="py-2.5 text-center flex justify-start whitespace-nowrap text-sm text-gray-700">
                                    <div className="w-[20%]"></div>
                                    <div className="w-[max-content] flex text-left gap-2">
                                        <img
                                            src={scholar[1].profile}
                                            alt="Profile"
                                            className="w-10 h-10 object-cover rounded-full mx-auto"
                                        />
                                        <div className="flex justify-center flex-col">
                                            <p className="font-bold text-gray-700 text-xs">
                                                {scholar.last_name +
                                                    ", " +
                                                    scholar.first_name}{" "}
                                                {scholar.middle_name
                                                    ? scholar.middle_name[0] +
                                                      "."
                                                    : ""}
                                            </p>
                                            <p className="text-[11px] text-gray-500/90">
                                                {scholar.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2.5 text-center whitespace-nowrap text-gray-500">
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
                                                    scholar.account_id,
                                                );
                                                setSelectedScholar([
                                                    scholar[0],
                                                    scholar[1],
                                                    scholar.account_id,
                                                ]);
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
                                                    scholar.account_id,
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

            {isModalOpen && (
                <ScholarProfileModal
                    info={selectedScholar}
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    isScholar={true}
                />
            )}

            {isCoeGradeModalOpen && (
                <CoaGradesModal
                    scholarId={scholarId}
                    isOpen={isCoeGradeModalOpen}
                    onClose={setIsCoeGradeModalOpen}
                />
            )}
        </DataListView>
    );
}
