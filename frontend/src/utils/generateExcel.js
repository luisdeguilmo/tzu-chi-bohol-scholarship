import { saveAs } from "file-saver";
// import ExcelJS from "exceljs";
import BASE_URL from "../config";
import axios from "axios";
import { date } from "./getDateAndTime";
import { useAuditLogs } from "../hooks/useAuditLogs";
import { useEffect, useState } from "react";
import { useSchoolYearContext } from "../context/SchoolYearContext";

export const generateExcel = () => {
    const { createAudit } = useAuditLogs();

    const { activeSchoolYear } = useSchoolYearContext();

    const uploadExcelToDatabase = async (workbook, fileName, total) => {
        try {
            // Generate Excel buffer
            const buffer = await workbook.xlsx.writeBuffer();

            // Create a Blob from the buffer
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Create FormData to send file
            const formData = new FormData();
            formData.append("file", blob, `${fileName}.xlsx`);
            formData.append("file_name", `${fileName}.xlsx`);
            formData.append("grand_total", total); // Add the grand total value

            // Upload to server
            const response = await axios.post(
                `${BASE_URL}app/api/allowance-cycle-excel.php`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            return response.data;
        } catch (error) {
            console.error("Error uploading Excel to database:", error);
            throw error;
        }
    };

    const exportAllowancesToExcel = async (data, fileName, type = null) => {
        const ExcelJS = (await import("exceljs")).default;
        const workbook = new ExcelJS.Workbook();

        const populateWorksheet = async (worksheet, schoolsData) => {
            const headers = [
                "No.",
                "Yr. Level",
                "Last Name",
                "First Name",
                "Allowance",
                "Internet Allowance",
                "Transportation Allowance",
                "TOTAL",
                "Signature/Date",
            ];

            const tableRows = [];

            const header1Row = worksheet.addRow(["MONTHLY ALLOWANCE OF"]);
            const header2Row = worksheet.addRow(["BOHOL COLLEGE STUDENTS"]);
            const header3Row = worksheet.addRow(["S.Y. " + activeSchoolYear]);

            [header1Row, header2Row, header3Row].forEach((row) => {
                row.getCell(1).font = {
                    name: "Arial Narrow",
                    bold: true,
                    size: 12,
                };
                worksheet.mergeCells(row.number, 1, row.number, 9);
                row.getCell(1).alignment = {
                    horizontal: "center",
                    vertical: "middle",
                };
            });

            worksheet.addRow([]);

            const subHeader = worksheet.addRow([
                `Scholars Allowance, Transportation Refund & Internet Allowance For the of ${date.getCurrentMonthFormatted()} ${date.getCurrentYear()}`,
            ]);
            subHeader.getCell(1).font = {
                name: "Arial Narrow",
                size: 12,
                italic: true,
            };
            worksheet.mergeCells(subHeader.number, 1, subHeader.number, 9);
            subHeader.getCell(1).alignment = {
                horizontal: "center",
                vertical: "middle",
            };

            let index = 0;
            const schoolTotalRows = [];
            let allowanceTotal = 0;
            let internetTotal = 0;
            let transportTotal = 0;

            // ✅ Uses schoolsData parameter, NOT outer data
            const schoolsWithScholars =
                schoolsData?.filter((school) => school.Scholar?.length > 0) ||
                [];

            schoolsWithScholars.forEach((school, schoolIndex) => {
                const schoolRow = worksheet.addRow([school.School]);
                schoolRow.getCell(1).font = {
                    name: "Arial Narrow",
                    bold: true,
                    size: 12,
                    underline: true,
                };
                worksheet.mergeCells(schoolRow.number, 1, schoolRow.number, 9);

                const headerRow = worksheet.addRow(headers);
                headerRow.eachCell((cell, colNumber) => {
                    let fontName;
                    if (colNumber >= 1 && colNumber <= 4) fontName = "Aharoni";
                    else if (colNumber >= 5 && colNumber <= 8)
                        fontName = "Arial Narrow";
                    else if (colNumber === 9) fontName = "Aharoni";

                    cell.font = {
                        name: fontName,
                        bold: true,
                        size: colNumber === 7 ? 8 : 10,
                    };
                    cell.alignment = {
                        horizontal: "center",
                        vertical: "middle",
                        wrapText: [2, 6, 7].includes(colNumber),
                    };
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFFF00" },
                    };
                });

                tableRows.push(headerRow.number);

                const firstDataRow = headerRow.number + 1;
                let lastDataRow = firstDataRow;

                school.Scholar?.forEach((scholar) => {
                    const total =
                        (scholar["Allowance"] || 0) +
                        (scholar["Internet Allowance"] || 0) +
                        (scholar["Transportation Allowance"] || 0);
                    ++index;

                    allowanceTotal += scholar["Allowance"] || 0;
                    internetTotal += scholar["Internet Allowance"] || 0;
                    transportTotal += scholar["Transportation Allowance"] || 0;

                    const dataRow = worksheet.addRow([
                        index,
                        "C" + scholar["YR. Level"],
                        scholar["Last Name"],
                        scholar["First Name"],
                        scholar["Allowance"],
                        scholar["Internet Allowance"],
                        scholar["Transportation Allowance"],
                        total,
                        "",
                    ]);

                    lastDataRow = dataRow.number;

                    for (let col = 1; col <= 8; col++) {
                        const cell = dataRow.getCell(col);
                        if (col >= 2 && col <= 4) {
                            cell.alignment = { horizontal: "left" };
                        } else {
                            cell.alignment = { horizontal: "center" };
                        }
                        if (col === 1) {
                            cell.font = { name: "Arial Narrow", size: 11 };
                        } else if (col >= 2 && col <= 4) {
                            cell.font = { name: "Arial", size: 9 };
                        }
                    }

                    tableRows.push(dataRow.number);
                });

                const totalRow = worksheet.addRow([
                    "",
                    "",
                    "",
                    "TOTAL",
                    { formula: `SUM(E${firstDataRow}:E${lastDataRow})` },
                    { formula: `SUM(F${firstDataRow}:F${lastDataRow})` },
                    { formula: `SUM(G${firstDataRow}:G${lastDataRow})` },
                    { formula: `SUM(H${firstDataRow}:H${lastDataRow})` },
                    "",
                ]);

                schoolTotalRows.push(totalRow.number);

                totalRow.getCell(4).font = {
                    name: "Arial Narrow",
                    size: 11,
                    bold: true,
                };
                totalRow.getCell(4).alignment = { horizontal: "left" };
                for (let col = 5; col <= 8; col++) {
                    const cell = totalRow.getCell(col);
                    cell.font = { name: "Arial Narrow", size: 11, bold: true };
                    cell.alignment = { horizontal: "center" };
                }

                if (schoolIndex < schoolsWithScholars.length - 1) {
                    worksheet.addRow([]);
                }
            });

            const grandTotalValue =
                allowanceTotal + internetTotal + transportTotal;

            if (schoolTotalRows.length > 0) {
                worksheet.addRow([]);

                const grandTotalRow = worksheet.addRow([
                    "",
                    "",
                    "GRAND TOTAL",
                    "",
                    { formula: `SUM(E${schoolTotalRows.join(",E")})` },
                    { formula: `SUM(F${schoolTotalRows.join(",F")})` },
                    { formula: `SUM(G${schoolTotalRows.join(",G")})` },
                    "",
                    "",
                ]);

                grandTotalRow.getCell(9).value = {
                    formula: `E${grandTotalRow.number}+F${grandTotalRow.number}+G${grandTotalRow.number}`,
                };

                worksheet.mergeCells(
                    grandTotalRow.number,
                    3,
                    grandTotalRow.number,
                    4,
                );

                grandTotalRow.getCell(3).font = {
                    name: "Arial Narrow",
                    size: 12,
                    bold: true,
                };
                grandTotalRow.getCell(3).alignment = {
                    horizontal: "center",
                    vertical: "middle",
                };

                for (let col = 5; col <= 7; col++) {
                    const cell = grandTotalRow.getCell(col);
                    cell.font = { name: "Arial Narrow", size: 12, bold: true };
                    cell.alignment = {
                        horizontal: "center",
                        vertical: "middle",
                    };
                }

                grandTotalRow.getCell(9).font = {
                    name: "Arial Narrow",
                    size: 12,
                    bold: true,
                };
                grandTotalRow.getCell(9).alignment = {
                    horizontal: "center",
                    vertical: "middle",
                };
            }

            worksheet.columns = [
                { width: 6 },
                { width: 7 },
                { width: 10 },
                { width: 14 },
                { width: 10 },
                { width: 10 },
                { width: 10 },
                { width: 10 },
                { width: 15 },
            ];

            worksheet.eachRow((row, rowNumber) => {
                if (tableRows.includes(rowNumber)) {
                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: "thin" },
                            left: { style: "thin" },
                            bottom: { style: "thin" },
                            right: { style: "thin" },
                        };
                    });
                }
            });

            return grandTotalValue;
        };

        // ✅ Split using correct key "Type" matching PHP response
        const publicSchools =
            data?.filter((school) => school.Type?.toLowerCase() === "public") ||
            [];
        const privateSchools =
            data?.filter(
                (school) => school.Type?.toLowerCase() === "private",
            ) || [];

        const privateWorksheet = workbook.addWorksheet(
            `${date.getCurrentMonthFormatted().toUpperCase()} ${date.getCurrentYear()} Private`,
        );

        const publicWorksheet = workbook.addWorksheet(
            `${date.getCurrentMonthFormatted().toUpperCase()} ${date.getCurrentYear()} Public`,
        );

        const publicGrandTotal = await populateWorksheet(
            publicWorksheet,
            publicSchools,
        );
        const privateGrandTotal = await populateWorksheet(
            privateWorksheet,
            privateSchools,
        );

        const overallGrandTotal = privateGrandTotal + publicGrandTotal;

        if (type === "process_final_allowance") {
            await uploadExcelToDatabase(workbook, fileName, overallGrandTotal);
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${fileName}.xlsx`);
        return true;
    };

    const exportScholarInformationToExcel = async (dataArray, fileName) => {
        const ExcelJS = (await import("exceljs")).default;
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            console.error("No valid data found to export");
            return false;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const headers = Object.keys(dataArray[0]);
        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true };

        dataArray.forEach((rowObj) => {
            worksheet.addRow(headers.map((key) => rowObj[key]));
        });

        worksheet.columns = [{ width: 30 }, { width: 15 }];

        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.alignment = { horizontal: "center", vertical: "middle" };
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${fileName}.xlsx`);

        return true;
    };

    const exportActiveScholars = async (data, fileName) => {
        const ExcelJS = (await import("exceljs")).default;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Allowances");

        // Define table headers
        const headers = [
            "No.",
            "Yr. Level",
            "Last Name",
            "First Name",
            "Course",
        ];

        // Track rows that should have borders (table headers and data rows)
        const tableRows = [];
        const header1Row = worksheet.addRow(["SCHOLARS LIST"]);
        const header2Row = worksheet.addRow([
            "BY SCHOOL / COURSE / YEAR LEVEL",
        ]);
        const header3Row = worksheet.addRow(["S.Y. " + activeSchoolYear]);

        header1Row.getCell(1).font = {
            name: "Arial Narrow",
            bold: true,
            size: 12,
        };
        header2Row.getCell(1).font = {
            name: "Arial Narrow",
            bold: true,
            size: 12,
        };
        header3Row.getCell(1).font = {
            name: "Arial Narrow",
            bold: true,
            size: 12,
        };

        worksheet.mergeCells(header1Row.number, 1, header1Row.number, 5);
        worksheet.mergeCells(header2Row.number, 1, header2Row.number, 5);
        worksheet.mergeCells(header3Row.number, 1, header3Row.number, 5);

        header1Row.getCell(1).alignment = {
            horizontal: "center",
            vertical: "middle",
        };
        header2Row.getCell(1).alignment = {
            horizontal: "center",
            vertical: "middle",
        };
        header3Row.getCell(1).alignment = {
            horizontal: "center",
            vertical: "middle",
        };

        worksheet.addRow([]);

        let index = 0;

        // Filter out schools with no scholars - FIXED: Changed Scholar to Scholars
        const schoolsWithScholars =
            data?.filter((school) => school.Scholars?.length > 0) || [];

        // Process each school
        schoolsWithScholars.forEach((school, schoolIndex) => {
            // Add school name as header using addRow
            const schoolRow = worksheet.addRow([school.School]);
            schoolRow.getCell(1).font = {
                name: "Arial Narrow",
                bold: true,
                size: 12,
                underline: true,
            };
            worksheet.mergeCells(schoolRow.number, 1, schoolRow.number, 5);

            // Add column headers
            const headerRow = worksheet.addRow(headers);
            headerRow.eachCell((cell, colNumber) => {
                // Set font - all headers use Aharoni
                cell.font = {
                    name: "Aharoni",
                    bold: true,
                    size: 10,
                };
                cell.alignment = {
                    horizontal: "center",
                    vertical: "middle",
                    wrapText: colNumber === 2, // Wrap text for Yr. Level
                };
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFF00" }, // Yellow
                };
            });

            // Mark header row for borders
            tableRows.push(headerRow.number);

            // Add scholars data - FIXED: Changed Scholar to Scholars
            school.Scholars?.forEach((scholar) => {
                ++index;

                const dataRow = worksheet.addRow([
                    index,
                    "C" + scholar["YR. Level"],
                    scholar["Last Name"],
                    scholar["First Name"],
                    scholar["Course"],
                ]);

                // Set alignment and fonts for data cells
                for (let col = 1; col <= 5; col++) {
                    const cell = dataRow.getCell(col);

                    // Set alignment based on column
                    if (col >= 2 && col <= 5) {
                        // Yr. Level, Last Name, First Name, Course: left align
                        cell.alignment = {
                            horizontal: "left",
                        };
                    } else {
                        // No. column: center align
                        cell.alignment = {
                            horizontal: "center",
                        };
                    }

                    // Set font based on column
                    if (col === 1) {
                        // No. column: Arial Narrow, size 11
                        cell.font = { name: "Arial Narrow", size: 11 };
                    } else if (col >= 2 && col <= 5) {
                        // Yr. Level, Last Name, First Name, Course: Arial, size 9
                        cell.font = { name: "Arial", size: 9 };
                    }
                }

                // Mark data row for borders
                tableRows.push(dataRow.number);
            });

            // Add blank row between schools (except after the last school)
            if (schoolIndex < schoolsWithScholars.length - 1) {
                worksheet.addRow([]);
            }
        });

        // Set column widths
        worksheet.columns = [
            { width: 6 }, // No.
            { width: 7 }, // Yr. Level
            { width: 10 }, // Last Name
            { width: 14 }, // First Name
            { width: 40 }, // Course
        ];

        // Add borders only to table rows (header + data rows for each school)
        worksheet.eachRow((row, rowNumber) => {
            if (tableRows.includes(rowNumber)) {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };
                });
            }
        });

        // Generate and download Excel file (no database upload since no grand total)
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${fileName}.xlsx`);
        await createAudit(
            "EXPORT",
            "scholar",
            null,
            "exported active scholars list",
            null,
            null,
        );
        return true;
    };

    const exportGraduatedScholars = async (data, fileName, schoolYear) => {
        const ExcelJS = (await import("exceljs")).default;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Allowances");

        // Define table headers
        const headers = [
            "No.",
            "Yr. Level",
            "Last Name",
            "First Name",
            "Course",
        ];

        // Track rows that should have borders (table headers and data rows)
        const tableRows = [];

        const header1Row = worksheet.addRow(["GRADUATED SCHOLARS LIST"]);
        const header2Row = worksheet.addRow([
            "BY SCHOOL / COURSE / YEAR GRADUATED",
        ]);
        // lw
        // if (schoolYear === "all_years") {

        // }
        const header3Row = worksheet.addRow([
            "S.Y. " + schoolYear === "all_years" ? "All" : schoolYear,
        ]);

        header1Row.getCell(1).font = {
            name: "Arial Narrow",
            bold: true,
            size: 12,
        };
        header2Row.getCell(1).font = {
            name: "Arial Narrow",
            bold: true,
            size: 12,
        };
        header3Row.getCell(1).font = {
            name: "Arial Narrow",
            bold: true,
            size: 12,
        };

        worksheet.mergeCells(header1Row.number, 1, header1Row.number, 5);
        worksheet.mergeCells(header2Row.number, 1, header2Row.number, 5);
        worksheet.mergeCells(header3Row.number, 1, header3Row.number, 5);

        header1Row.getCell(1).alignment = {
            horizontal: "center",
            vertical: "middle",
        };
        header2Row.getCell(1).alignment = {
            horizontal: "center",
            vertical: "middle",
        };
        header3Row.getCell(1).alignment = {
            horizontal: "center",
            vertical: "middle",
        };

        worksheet.addRow([]);

        let index = 0;

        // Filter out schools with no scholars - FIXED: Changed Scholar to Scholars
        const schoolsWithScholars =
            data?.filter((school) => school.Scholars?.length > 0) || [];

        // Process each school
        schoolsWithScholars.forEach((school, schoolIndex) => {
            // Add school name as header using addRow
            const schoolRow = worksheet.addRow([school.School]);
            schoolRow.getCell(1).font = {
                name: "Arial Narrow",
                bold: true,
                size: 12,
                underline: true,
            };
            worksheet.mergeCells(schoolRow.number, 1, schoolRow.number, 5);

            // Add column headers
            const headerRow = worksheet.addRow(headers);
            headerRow.eachCell((cell, colNumber) => {
                // Set font - all headers use Aharoni
                cell.font = {
                    name: "Aharoni",
                    bold: true,
                    size: 10,
                };
                cell.alignment = {
                    horizontal: "center",
                    vertical: "middle",
                    wrapText: colNumber === 2, // Wrap text for Yr. Level
                };
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFF00" }, // Yellow
                };
            });

            // Mark header row for borders
            tableRows.push(headerRow.number);

            // Add scholars data - FIXED: Changed Scholar to Scholars
            school.Scholars?.forEach((scholar) => {
                ++index;

                const dataRow = worksheet.addRow([
                    index,
                    "C" + scholar["YR. Level"],
                    scholar["Last Name"],
                    scholar["First Name"],
                    scholar["Course"],
                ]);

                // Set alignment and fonts for data cells
                for (let col = 1; col <= 5; col++) {
                    const cell = dataRow.getCell(col);

                    // Set alignment based on column
                    if (col >= 2 && col <= 5) {
                        // Yr. Level, Last Name, First Name, Course: left align
                        cell.alignment = {
                            horizontal: "left",
                        };
                    } else {
                        // No. column: center align
                        cell.alignment = {
                            horizontal: "center",
                        };
                    }

                    // Set font based on column
                    if (col === 1) {
                        // No. column: Arial Narrow, size 11
                        cell.font = { name: "Arial Narrow", size: 11 };
                    } else if (col >= 2 && col <= 5) {
                        // Yr. Level, Last Name, First Name, Course: Arial, size 9
                        cell.font = { name: "Arial", size: 9 };
                    }
                }

                // Mark data row for borders
                tableRows.push(dataRow.number);
            });

            // Add blank row between schools (except after the last school)
            if (schoolIndex < schoolsWithScholars.length - 1) {
                worksheet.addRow([]);
            }
        });

        // Set column widths
        worksheet.columns = [
            { width: 6 }, // No.
            { width: 7 }, // Yr. Level
            { width: 10 }, // Last Name
            { width: 14 }, // First Name
            { width: 40 }, // Course
        ];

        // Add borders only to table rows (header + data rows for each school)
        worksheet.eachRow((row, rowNumber) => {
            if (tableRows.includes(rowNumber)) {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };
                });
            }
        });

        // Generate and download Excel file (no database upload since no grand total)
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${fileName}.xlsx`);
        await createAudit(
            "EXPORT",
            "scholar",
            null,
            "exported graduated scholars list",
            null,
            null,
        );
        return true;
    };

    return {
        exportAllowancesToExcel,
        exportActiveScholars,
        exportGraduatedScholars,
        exportScholarInformationToExcel,
    };
};
