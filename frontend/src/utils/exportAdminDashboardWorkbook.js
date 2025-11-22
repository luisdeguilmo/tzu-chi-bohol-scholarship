import * as XLSX from "xlsx";
import { formatMonth } from "./formatMonth";

export const exportAdminDashboardWorkbook = (
    scholarsByProgram,
    applicationsSubmittedAndApplicationsApproved,
    approvedAndRejectedByStage,
    eventAttendanceData,
    communityServiceHoursCompletionData
) => {
    const workbook = XLSX.utils.book_new();

    // Helper function to create a sheet with bold header and column widths
    const createSheetWithStyle = (rows, columnWidths = []) => {
        const sheet = XLSX.utils.aoa_to_sheet(rows);

        // Make header bold
        const headerRange = XLSX.utils.decode_range(sheet["!ref"]);
        for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!sheet[cellAddress]) continue;
            sheet[cellAddress].s = {
                font: { bold: true },
            };
        }

        // Set column widths
        if (columnWidths.length > 0) {
            sheet["!cols"] = columnWidths.map((w) => ({ wch: w }));
        }

        return sheet;
    };

    // Sheet 2 – Duty Hours
    const dutyRows = [
        ["Category", "Count"],
        ...scholarsByProgram.map((s) => [s.category, s.total_scholars]),
    ];
    const dutySheet = createSheetWithStyle(dutyRows, [30, 15]);
    XLSX.utils.book_append_sheet(workbook, dutySheet, "Scholars by Program");

    // Sheet 3 – Monthly Allowance
    const allowanceRows = [
        ["Month", "Applications Submitted", "Applications Approved"],
        ...applicationsSubmittedAndApplicationsApproved.map((item) => [
            item.month_name,
            item.applications_submitted,
            item.applications_approved,
        ]),
    ];
    const allowanceSheet = createSheetWithStyle(allowanceRows, [15, 20, 20]);
    XLSX.utils.book_append_sheet(
        workbook,
        allowanceSheet,
        "Application Trends"
    );

    const approvalAndRejectionRows = [
        ["Stage", "Approved", "Rejected"],
        ...approvedAndRejectedByStage.map((item) => [
            item.stage_name,
            item.approved,
            item.rejected,
        ]),
    ];
    const approvalAndRejectionSheet = createSheetWithStyle(
        approvalAndRejectionRows,
        [15, 20, 20]
    );
    XLSX.utils.book_append_sheet(
        workbook,
        approvalAndRejectionSheet,
        "Approval vs Rejection by Stage"
    );

    const engagementRows = [
        ["Month", "Event Attendance %", "Service Hours Completion %"],
        ...eventAttendanceData.map((item, index) => [
            item.month_name,
            Math.round(item.attendance_percent),
            Math.round(
                communityServiceHoursCompletionData[index]
                    ?.completion_percent ?? 0
            ),
        ]),
    ];
    const engagementSheet = createSheetWithStyle(engagementRows, [15, 20, 25]);
    XLSX.utils.book_append_sheet(
        workbook,
        engagementSheet,
        "Scholar Engagement"
    );

    // Export
    XLSX.writeFile(workbook, "admin_dashboard_report.xlsx");
};
