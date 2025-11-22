import * as XLSX from "xlsx";
import { formatMonth } from "./formatMonth";

export const exportStaffDashboardWorkbook = (
    applicationData,
    scholars,
    monthlyAllowanceDistributionData,
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

    // Sheet 1 – Funnel
    const funnelRows = [
        ["Stage", "Count"],
        ["Application", applicationData.application],
        ["Entrance Examination", applicationData.exam],
        ["Initial Interview", applicationData.interview],
        ["Home Visitation", applicationData.home_visit],
        ["Final Interview", applicationData.final_interview],
        ["Orientation", applicationData.orientation],
        ["Awarding", applicationData.awarding],
    ];
    const funnelSheet = createSheetWithStyle(funnelRows, [25, 15]);
    XLSX.utils.book_append_sheet(workbook, funnelSheet, "Funnel Data");

    // Sheet 2 – Duty Hours
    const dutyRows = [
        ["Scholar", "Rendered Hours"],
        ...scholars.map((s) => [s.first_name, s.rendered_hours]),
    ];
    const dutySheet = createSheetWithStyle(dutyRows, [30, 15]);
    XLSX.utils.book_append_sheet(workbook, dutySheet, "Duty Hours");

    // Sheet 3 – Monthly Allowance
    const allowanceRows = [
        ["Month", "Amount (₱)"],
        ...monthlyAllowanceDistributionData.map((item) => [
            formatMonth(item.allowance_month.slice(0, 7)),
            item.amount,
        ]),
    ];
    const allowanceSheet = createSheetWithStyle(allowanceRows, [15, 20]);
    XLSX.utils.book_append_sheet(workbook, allowanceSheet, "Allowance");

    // Sheet 4 – Scholar Engagement
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
    XLSX.writeFile(workbook, "staff_dashboard_report.xlsx");
};