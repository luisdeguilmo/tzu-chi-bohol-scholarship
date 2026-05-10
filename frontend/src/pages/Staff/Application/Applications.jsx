import { useEffect, useMemo, useState } from "react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { manageApplication } from "../../../services/emailService";
import { useApplications } from "../../../hooks/useApplications";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";
import EmptyState from "../../../components/EmptyState";
import { useApplicantData } from "../../../hooks/useApplicantData";
import { usePdfActions } from "../../../hooks/usePdfActions";
import {
    applicationTableHeaders,
    renewalTableHeaders,
} from "../../../constant/tableHeaders";
import { applicationButtons } from "../../../constant/tableToolbarButtons";
import TableToolbar from "../../../components/TableToolbar";
import Table from "../../../components/Table";
import {
    CheckCircle,
    DownloadIcon,
    Eye,
    Pencil,
    PencilLine,
    Plus,
    XCircle,
} from "lucide-react";
import ConfirmationModal from "../../../components/ConfirmationModal";
import EmailMessageFormModal from "../../../components/EmailMessageFormModal";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { TableButtonAction } from "../../../components/TableButtonAction";

export default function Applications() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("new");
    const [sortBy, setSortBy] = useState("newest");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [action, setAction] = useState("");
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [tableHeaders, setTableHeaders] = useState([]);

    const { loading, error, applications, fetchApplications } =
        useApplications(activeTab);
    const { fetchApplicantData } = useApplicantData();
    const { viewPdf, downloadPdf } = usePdfActions(
        activeTab,
        fetchApplicantData,
    );
    const size = useWindowSize();
    const isMobile = size.width < 768;

    const {
        isLoading,
        approveApplication,
        approveRenewApplication,
        rejectApplication,
        rejectRenewApplication,
    } = manageApplication();

    useEffect(() => {
        fetchApplications();
    }, [activeTab]);

    const handleApproveApplication = async () => {
        if (activeTab === "new") {
            const success = await approveApplication(selectedApplicant);

            if (success) {
                await fetchApplications();
                setIsFormModalOpen(false);
            }
        } else if (activeTab === "old") {
            const success = await approveRenewApplication(selectedApplicant);

            if (success) {
                await fetchApplications();
                setIsFormModalOpen(false);
            }
        }
    };

    const handleRejectApplication = async () => {
        if (activeTab === "new") {
            const success = await rejectApplication(
                selectedApplicant,
                feedback,
            );

            if (success) {
                await fetchApplications();
                setIsFormModalOpen(false);
            }
        } else if (activeTab === "old") {
            const success = await rejectRenewApplication(
                selectedApplicant,
                feedback,
            );

            if (success) {
                await fetchApplications();
                setIsFormModalOpen(false);
            }
        }
    };

    // Filter data based on search term
    const filteredApplications = applications.filter(
        (applicant) =>
            applicant.last_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant.middle_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant.first_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            applicant.created_at.includes(searchTerm),
    );

    // Sort applications
    const sortedApplications = [...filteredApplications].sort((a, b) => {
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
    });

    const {
        currentItems,
        currentPage,
        setCurrentPage,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        goToPreviousPage,
        goToNextPage,
        numberOfItemsPerPage,
    } = usePagination(sortedApplications, itemsPerPage);

    const handleChangeTab = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleOpenApproveModal = (applicant) => {
        setIsFormModalOpen(true);
        setSelectedApplicant(applicant);
        setAction("approve");
    };

    const handleOpenRejectModal = (applicant) => {
        setIsFormModalOpen(true);
        setSelectedApplicant(applicant);
        setAction("reject");
    };

    const handleRefresh = async () => {
        fetchApplications();
    };

    useMemo(() => {
        setTableHeaders(
            activeTab === "new" ? applicationTableHeaders : renewalTableHeaders,
        );
    }, [activeTab]);

    return (
        <div className="lg:p-6">
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                {/* Header */}
                <TableToolbar
                    items={applications}
                    label={"Applications Submitted"}
                    placeholder={"applications"}
                    tab={activeTab}
                    buttons={applicationButtons}
                    searchTerm={searchTerm}
                    itemsPerPage={itemsPerPage}
                    sortBy={sortBy}
                    sortedItems={sortedApplications}
                    onRefresh={handleRefresh}
                    onSort={setSortBy}
                    onSearchChange={setSearchTerm}
                    onChangeTab={handleChangeTab}
                    onChangeItemsPerPage={setItemsPerPage}
                    onChangeCurrentPage={setCurrentPage}
                    firstIndex={indexOfFirstItem}
                    lastIndex={indexOfLastItem}
                    addButton={activeTab === "new"}
                    button={{
                        icon: <Pencil className="w-4 h-4 text-white" />,
                        label: "Set Message",
                    }}
                    onOpen={setIsOpenModal}
                />

                <div
                    className={`${isMobile && "flex flex-col gap-2"} overflow-x-auto rounded-[4px]`}
                >
                    {isMobile ? (
                        currentItems.map((item, index) => (
                            <div className="p-4 border rounded-md bg-gray-50">
                                <p className="mb-2 font-normal text-gray-600">
                                    <div className="w-[max-content] flex items-center text-left gap-2">
                                        <img
                                            src={info[0].profile}
                                            alt="Profile"
                                            className="w-10 h-10 object-cover rounded-full mx-auto"
                                        />
                                        <div>
                                            <p className="font-bold text-xs">
                                                {item.first_name +
                                                    " " +
                                                    item.last_name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.email}
                                            </p>
                                        </div>
                                    </div>
                                </p>
                                <div key={index} className="flex gap-6 ">
                                    <div className="space-y-2">
                                        {tableHeaders
                                            .filter(
                                                (item) =>
                                                    item.name !== "Applicant" &&
                                                    item.name !== "Scholar",
                                            )
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
                                        {activeTab === "old" && (
                                            <p className="text-gray-600">
                                                {item.scholar_id}
                                            </p>
                                        )}
                                        <p className="font-normal text-gray-600">
                                            {formatDateTime(item.created_at)}
                                        </p>

                                        <TableButtonAction
                                            onClick={() =>
                                                viewPdf({
                                                    applicationId:
                                                        item.application_id,
                                                    scholarId: item.scholar_id,
                                                })
                                            }
                                            button={{
                                                title: "View PDF",
                                                icon: (
                                                    <Eye className="w-4 h-4" />
                                                ),
                                                color: "blue",
                                            }}
                                        />
                                        <TableButtonAction
                                            onClick={() =>
                                                downloadPdf({
                                                    applicationId:
                                                        item.application_id,
                                                    scholarId: item.scholar_id,
                                                })
                                            }
                                            button={{
                                                title: "Download PDF",
                                                icon: (
                                                    <DownloadIcon className="w-4 h-4" />
                                                ),
                                                color: "red",
                                            }}
                                        />
                                        <TableButtonAction
                                            onClick={() =>
                                                handleOpenApproveModal(item)
                                            }
                                            button={{
                                                title: "Approve Application",
                                                icon: (
                                                    <CheckCircle className="w-4 h-4" />
                                                ),
                                                color: "blue",
                                            }}
                                        />
                                        <TableButtonAction
                                            onClick={() =>
                                                handleOpenRejectModal(item)
                                            }
                                            button={{
                                                title: "Reject Application",
                                                icon: (
                                                    <XCircle className="w-4 h-4" />
                                                ),
                                                color: "red",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <Table
                            // hasNumberColumn={true}
                            tableHeaders={
                                activeTab === "new"
                                    ? applicationTableHeaders
                                    : renewalTableHeaders
                            }
                        >
                            {currentItems.map((info, index) => (
                                <tr
                                    key={info.application_id}
                                    className={`border-b border-gray-100 transition-colors text-center hover:bg-gray-50 `}
                                >
                                    <td className="py-2 whitespace-nowrap text-gray-600">
                                        {info.application_id}
                                    </td>
                                    {activeTab === "old" && (
                                        <td className="py-2 whitespace-nowrap text-gray-600 font-bold">
                                            {info.scholar_id}
                                        </td>
                                    )}
                                    <td className="py-2 flex justify-start whitespace-nowrap text-sm text-gray-700">
                                        <div className="w-[30%]"></div>
                                        <div className="w-[max-content] flex items-center text-left gap-2">
                                            <img
                                                src={info[0].profile}
                                                alt="Profile"
                                                className="w-10 h-10 object-cover rounded-full mx-auto"
                                            />
                                            <div>
                                                <p className="font-bold text-xs">
                                                    {info.first_name +
                                                        " " +
                                                        info.last_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {info.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 whitespace-nowrap text-gray-500">
                                        {formatDateTime(info.created_at)}
                                    </td>
                                    <td className="py-2 whitespace-nowrap text-right font-medium">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() =>
                                                    viewPdf({
                                                        applicationId:
                                                            info.application_id,
                                                        scholarId:
                                                            info.scholar_id,
                                                    })
                                                }
                                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                title="View PDF"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    downloadPdf({
                                                        applicationId:
                                                            info.application_id,
                                                        scholarId:
                                                            info.scholar_id,
                                                    })
                                                }
                                                className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                                title="Download PDF"
                                            >
                                                <DownloadIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleOpenApproveModal(info)
                                                }
                                                className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                                disabled={loading}
                                                title="Approve"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleOpenRejectModal(info)
                                                }
                                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                disabled={loading}
                                                title="Reject"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    )}

                    {/* Empty state */}
                    {currentItems.length === 0 && (
                        <EmptyState message="No applications found." />
                    )}
                </div>

                {/* Pagination */}
                {sortedApplications.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrevious={goToPreviousPage}
                            onNext={goToNextPage}
                            indexOfFirstItem={indexOfFirstItem}
                            indexOfLastItem={indexOfLastItem}
                            totalItems={sortedApplications.length}
                            itemLabel={"applications"}
                        />
                    </div>
                )}

                <ConfirmationModal
                    isOpen={isFormModalOpen}
                    onClose={setIsFormModalOpen}
                    isLoading={isLoading}
                    label={"Confirmation"}
                    action={action === "reject" ? "reject" : ""}
                    feedback={action === "reject" ? feedback : null}
                    setFeedback={action === "reject" ? setFeedback : null}
                    message={
                        action === "approve"
                            ? "Are you sure you want to approve this application? This action cannot be undone."
                            : "Are you sure you want to reject this application? This action cannot be undone."
                    }
                    onClick={
                        action === "approve"
                            ? handleApproveApplication
                            : handleRejectApplication
                    }
                />

                <EmailMessageFormModal
                    stage={"application"}
                    isOpen={isOpenModal}
                    onClose={setIsOpenModal}
                    onRefresh={fetchApplications}
                    firstLabel={"Application Approved Message"}
                    secondLabel={"Application Rejected Message"}
                />
            </div>
        </div>
    );
}
