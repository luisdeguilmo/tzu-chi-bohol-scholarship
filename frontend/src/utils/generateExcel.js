import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import BASE_URL from "../config";
import axios from "axios";
import { getCurrentSchoolYear } from "./getCurrentSchoolYear";

export const generateExcel = () => {
    // const uploadExcelToDatabase = async (workbook, fileName, total) => {
    //     try {
    //         // Generate Excel buffer
    //         const buffer = await workbook.xlsx.writeBuffer();

    //         // Create a Blob from the buffer
    //         const blob = new Blob([buffer], {
    //             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //         });

    //         // Create FormData to send file
    //         const formData = new FormData();
    //         formData.append("file", blob, `${fileName}.xlsx`);
    //         formData.append("file_name", `${fileName}.xlsx`);

    //         // Upload to server
    //         const response = await axios.post(
    //             `${BASE_URL}app/views/allowance-cycle-excel.php`,
    //             formData,
    //             {
    //                 headers: {
    //                     "Content-Type": "multipart/form-data",
    //                 },
    //             }
    //         );

    //         return response.data;
    //     } catch (error) {
    //         console.error("Error uploading Excel to database:", error);
    //         throw error;
    //     }
    // };

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
                `${BASE_URL}app/views/allowance-cycle-excel.php`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log(total);

            return response.data;
        } catch (error) {
            console.error("Error uploading Excel to database:", error);
            throw error;
        }
    };

    // const exportAllowancesToExcel = async (data, fileName) => {
    //     const workbook = new ExcelJS.Workbook();
    //     const worksheet = workbook.addWorksheet("Allowances");
    //     console.log(data);

    //     // Define table headers
    //     const headers = [
    //         "No.",
    //         "Yr. Level",
    //         "Last Name",
    //         "First Name",
    //         "Allowance",
    //         "Internet Allowance",
    //         "Transportation Allowance",
    //         "TOTAL",
    //         "Signature/Date",
    //     ];

    //     // Track rows that should have borders (table headers and data rows)
    //     const tableRows = [];

    //     const header1Row = worksheet.addRow(["MONTHLY ALLOWANCE OF"]);
    //     const header2Row = worksheet.addRow(["BOHOL COLLEGE STUDENTS"]);
    //     const header3Row = worksheet.addRow(["S.Y. " + getCurrentSchoolYear()]);

    //     header1Row.getCell(1).font = {
    //         name: "Arial Narrow",
    //         bold: true,
    //         size: 12,
    //     };
    //     header2Row.getCell(1).font = {
    //         name: "Arial Narrow",
    //         bold: true,
    //         size: 12,
    //     };
    //     header3Row.getCell(1).font = {
    //         name: "Arial Narrow",
    //         bold: true,
    //         size: 12,
    //     };

    //     worksheet.mergeCells(header1Row.number, 1, header1Row.number, 9);
    //     worksheet.mergeCells(header2Row.number, 1, header2Row.number, 9);
    //     worksheet.mergeCells(header3Row.number, 1, header3Row.number, 9);

    //     header1Row.getCell(1).alignment = {
    //         horizontal: "center",
    //         vertical: "middle",
    //     };
    //     header2Row.getCell(1).alignment = {
    //         horizontal: "center",
    //         vertical: "middle",
    //     };
    //     header3Row.getCell(1).alignment = {
    //         horizontal: "center",
    //         vertical: "middle",
    //     };

    //     worksheet.addRow([]);

    //     const subHeader = worksheet.addRow([
    //         "Scholars Allowance, Transportation Refund & Internet Allowance For the of November 2025",
    //     ]);

    //     subHeader.getCell(1).font = {
    //         name: "Arial Narrow",
    //         size: 12,
    //         italic: true,
    //     };
    //     worksheet.mergeCells(subHeader.number, 1, subHeader.number, 9);
    //     subHeader.getCell(1).alignment = {
    //         horizontal: "center",
    //         vertical: "middle",
    //     };

    //     let index = 0;

    //     // Track all allowance rows for grand total calculation
    //     const allAllowanceRows = [];
    //     // Track all school TOTAL rows for grand total calculation
    //     const schoolTotalRows = [];

    //     // Process each school
    //     data?.forEach((school, schoolIndex) => {
    //         // Add school name as header using addRow
    //         const schoolRow = worksheet.addRow([school.School]);
    //         schoolRow.getCell(1).font = {
    //             name: "Arial Narrow",
    //             bold: true,
    //             size: 12,
    //             underline: true,
    //         };
    //         worksheet.mergeCells(schoolRow.number, 1, schoolRow.number, 9);

    //         // Add column headers
    //         const headerRow = worksheet.addRow(headers);
    //         headerRow.eachCell((cell, colNumber) => {
    //             // Set font based on column
    //             let fontName;
    //             if (colNumber >= 1 && colNumber <= 4) {
    //                 // No. to First Name: Aharoni
    //                 fontName = "Aharoni";
    //             } else if (colNumber >= 5 && colNumber <= 8) {
    //                 // Allowance to TOTAL: Arial Narrow
    //                 fontName = "Arial Narrow";
    //             } else if (colNumber === 9) {
    //                 // Signature/Date: Aharoni
    //                 fontName = "Aharoni";
    //             }

    //             cell.font = {
    //                 name: fontName,
    //                 bold: true,
    //                 size: colNumber === 7 ? 8 : 10, // Font size 8 for Transportation Allowance, 10 for others
    //             };
    //             cell.alignment = {
    //                 horizontal: "center",
    //                 vertical: "middle",
    //                 wrapText: [2, 6, 7].includes(colNumber), // Wrap text for Yr. Level, Internet Allowance, Transportation Allowance
    //             };
    //             cell.fill = {
    //                 type: "pattern",
    //                 pattern: "solid",
    //                 fgColor: { argb: "FFFF00" }, // Yellow
    //             };
    //         });

    //         // Mark header row for borders
    //         tableRows.push(headerRow.number);

    //         // Track the first data row for this school (for SUM formula)
    //         const firstDataRow = headerRow.number + 1;
    //         let lastDataRow = firstDataRow;

    //         // Add scholars data
    //         if (school.Scholar?.length === 0) {
    //             // Add empty row for schools with no scholars
    //             const emptyRow = worksheet.addRow(["No scholars"]);
    //             worksheet.mergeCells(emptyRow.number, 1, emptyRow.number, 9);
    //             tableRows.push(emptyRow.number);
    //         } else {
    //             school.Scholar?.forEach((scholar) => {
    //                 const total =
    //                     (scholar["Allowance"] || 0) +
    //                     (scholar["Internet Allowance"] || 0) +
    //                     (scholar["Transportation Allowance"] || 0);
    //                 ++index;

    //                 const dataRow = worksheet.addRow([
    //                     index,
    //                     "C" + scholar["YR. Level"],
    //                     scholar["Last Name"],
    //                     scholar["First Name"],
    //                     scholar["Allowance"],
    //                     scholar["Internet Allowance"],
    //                     scholar["Transportation Allowance"],
    //                     total,
    //                     "", // Signature/Date
    //                 ]);

    //                 lastDataRow = dataRow.number;
    //                 allAllowanceRows.push(dataRow.number);

    //                 // Center align and set fonts for data cells
    //                 for (let col = 1; col <= 8; col++) {
    //                     const cell = dataRow.getCell(col);

    //                     // Set alignment based on column
    //                     if (col >= 2 && col <= 4) {
    //                         // Yr. Level, Last Name, First Name: left align
    //                         cell.alignment = {
    //                             horizontal: "left",
    //                         };
    //                     } else {
    //                         // Other columns: center align
    //                         cell.alignment = {
    //                             horizontal: "center",
    //                         };
    //                     }

    //                     // Set font based on column
    //                     if (col === 1) {
    //                         // No. column: Arial Narrow, size 11
    //                         cell.font = { name: "Arial Narrow", size: 11 };
    //                     } else if (col >= 2 && col <= 4) {
    //                         // Yr. Level to TOTAL: Arial, size 9
    //                         cell.font = { name: "Arial", size: 9 };
    //                     } else if (col >= 2 && col <= 4) {
    //                         // Yr. Level to TOTAL: Arial, size 11
    //                         cell.font = { name: "Arial Narrow", size: 11 };
    //                     }
    //                 }

    //                 // Mark data row for borders
    //                 tableRows.push(dataRow.number);
    //             });
    //         }

    //         // Add TOTAL row at the end of each school's table (outside the table, no borders)
    //         if (school.Scholar?.length > 0) {
    //             const totalRow = worksheet.addRow([
    //                 "", // No.
    //                 "", // Yr. Level
    //                 "", // Last Name
    //                 "TOTAL", // First Name
    //                 { formula: `SUM(E${firstDataRow}:E${lastDataRow})` }, // Allowance
    //                 { formula: `SUM(F${firstDataRow}:F${lastDataRow})` }, // Internet Allowance
    //                 { formula: `SUM(G${firstDataRow}:G${lastDataRow})` }, // Transportation Allowance
    //                 { formula: `SUM(H${firstDataRow}:H${lastDataRow})` }, // TOTAL
    //                 "", // Signature/Date
    //             ]);

    //             // Track this TOTAL row for grand total calculation
    //             schoolTotalRows.push(totalRow.number);

    //             // Style the TOTAL row
    //             totalRow.getCell(4).font = {
    //                 name: "Arial Narrow",
    //                 size: 11,
    //                 bold: true,
    //             };
    //             totalRow.getCell(4).alignment = { horizontal: "left" };

    //             for (let col = 5; col <= 8; col++) {
    //                 const cell = totalRow.getCell(col);
    //                 cell.font = { name: "Arial Narrow", size: 11, bold: true };
    //                 cell.alignment = { horizontal: "center" };
    //             }

    //             // NOTE: TOTAL row is NOT added to tableRows, so it won't have borders
    //         }

    //         // Add blank row between schools (except after the last school)
    //         if (schoolIndex < data.length - 1) {
    //             worksheet.addRow([]);
    //         }
    //     });

    //     // Add GRAND TOTAL row at the very end
    //     if (schoolTotalRows.length > 0) {
    //         worksheet.addRow([]); // Blank row before grand total

    //         const grandTotalRow = worksheet.addRow([
    //             "", // No.
    //             "", // Yr. Level
    //             "GRAND TOTAL", // Last Name
    //             "", // First Name (merged with Last Name)
    //             { formula: `SUM(E${schoolTotalRows.join(",E")})` }, // Allowance - sum of all school totals
    //             { formula: `SUM(F${schoolTotalRows.join(",F")})` }, // Internet Allowance - sum of all school totals
    //             { formula: `SUM(G${schoolTotalRows.join(",G")})` }, // Transportation Allowance - sum of all school totals
    //             "", // TOTAL (empty)
    //             "", // Placeholder for overall total
    //         ]);

    //         // Now set the formula for the overall total using the row number
    //         grandTotalRow.getCell(9).value = {
    //             formula: `E${grandTotalRow.number}+F${grandTotalRow.number}+G${grandTotalRow.number}`,
    //         };

    //         // Merge Last Name and First Name cells for "GRAND TOTAL"
    //         worksheet.mergeCells(
    //             grandTotalRow.number,
    //             3,
    //             grandTotalRow.number,
    //             4
    //         );

    //         // Style the GRAND TOTAL row
    //         grandTotalRow.getCell(3).font = {
    //             name: "Arial Narrow",
    //             size: 12,
    //             bold: true,
    //         };
    //         grandTotalRow.getCell(3).alignment = {
    //             horizontal: "center",
    //             vertical: "middle",
    //         };

    //         for (let col = 5; col <= 7; col++) {
    //             const cell = grandTotalRow.getCell(col);
    //             cell.font = { name: "Arial Narrow", size: 12, bold: true };
    //             cell.alignment = { horizontal: "center", vertical: "middle" };
    //         }

    //         // Style the overall total in Signature/Date column
    //         grandTotalRow.getCell(9).font = {
    //             name: "Arial Narrow",
    //             size: 12,
    //             bold: true,
    //         };
    //         grandTotalRow.getCell(9).alignment = {
    //             horizontal: "center",
    //             vertical: "middle",
    //         };
    //     }

    //     // Set column widths
    //     worksheet.columns = [
    //         { width: 6 }, // No.
    //         { width: 7 }, // Yr. Level
    //         { width: 10 }, // Last Name
    //         { width: 14 }, // First Name
    //         { width: 10 }, // Allowance
    //         { width: 10 }, // Internet Allowance
    //         { width: 10 }, // Transportation Allowance
    //         { width: 10 }, // TOTAL
    //         { width: 15 }, // Signature/Date
    //     ];

    //     // Add borders only to table rows (header + data rows for each school)
    //     worksheet.eachRow((row, rowNumber) => {
    //         if (tableRows.includes(rowNumber)) {
    //             row.eachCell((cell) => {
    //                 cell.border = {
    //                     top: { style: "thin" },
    //                     left: { style: "thin" },
    //                     bottom: { style: "thin" },
    //                     right: { style: "thin" },
    //                 };
    //             });
    //         }
    //     });

    //     await uploadExcelToDatabase(
    //         workbook,
    //         fileName,
    //         grandTotalRow.getCell(9)
    //     );

    //     // Generate and download Excel file
    //     const buffer = await workbook.xlsx.writeBuffer();
    //     const blob = new Blob([buffer], {
    //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //     });
    //     saveAs(blob, `${fileName}.xlsx`);
    //     return true;
    // };

    const exportAllowancesToExcel = async (data, fileName) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Allowances");
        console.log(data);

        // Define table headers
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

        // Track rows that should have borders (table headers and data rows)
        const tableRows = [];

        const header1Row = worksheet.addRow(["MONTHLY ALLOWANCE OF"]);
        const header2Row = worksheet.addRow(["BOHOL COLLEGE STUDENTS"]);
        const header3Row = worksheet.addRow(["S.Y. " + getCurrentSchoolYear()]);

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

        worksheet.mergeCells(header1Row.number, 1, header1Row.number, 9);
        worksheet.mergeCells(header2Row.number, 1, header2Row.number, 9);
        worksheet.mergeCells(header3Row.number, 1, header3Row.number, 9);

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

        const subHeader = worksheet.addRow([
            "Scholars Allowance, Transportation Refund & Internet Allowance For the of November 2025",
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

        // Track all allowance rows for grand total calculation
        const allAllowanceRows = [];
        // Track all school TOTAL rows for grand total calculation
        const schoolTotalRows = [];

        // Variables to calculate grand total from source data
        let allowanceTotal = 0;
        let internetTotal = 0;
        let transportTotal = 0;

        // Process each school
        data?.forEach((school, schoolIndex) => {
            // Add school name as header using addRow
            const schoolRow = worksheet.addRow([school.School]);
            schoolRow.getCell(1).font = {
                name: "Arial Narrow",
                bold: true,
                size: 12,
                underline: true,
            };
            worksheet.mergeCells(schoolRow.number, 1, schoolRow.number, 9);

            // Add column headers
            const headerRow = worksheet.addRow(headers);
            headerRow.eachCell((cell, colNumber) => {
                // Set font based on column
                let fontName;
                if (colNumber >= 1 && colNumber <= 4) {
                    // No. to First Name: Aharoni
                    fontName = "Aharoni";
                } else if (colNumber >= 5 && colNumber <= 8) {
                    // Allowance to TOTAL: Arial Narrow
                    fontName = "Arial Narrow";
                } else if (colNumber === 9) {
                    // Signature/Date: Aharoni
                    fontName = "Aharoni";
                }

                cell.font = {
                    name: fontName,
                    bold: true,
                    size: colNumber === 7 ? 8 : 10, // Font size 8 for Transportation Allowance, 10 for others
                };
                cell.alignment = {
                    horizontal: "center",
                    vertical: "middle",
                    wrapText: [2, 6, 7].includes(colNumber), // Wrap text for Yr. Level, Internet Allowance, Transportation Allowance
                };
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFF00" }, // Yellow
                };
            });

            // Mark header row for borders
            tableRows.push(headerRow.number);

            // Track the first data row for this school (for SUM formula)
            const firstDataRow = headerRow.number + 1;
            let lastDataRow = firstDataRow;

            // Add scholars data
            if (school.Scholar?.length === 0) {
                // Add empty row for schools with no scholars
                const emptyRow = worksheet.addRow(["No scholars"]);
                worksheet.mergeCells(emptyRow.number, 1, emptyRow.number, 9);
                tableRows.push(emptyRow.number);
            } else {
                school.Scholar?.forEach((scholar) => {
                    const total =
                        (scholar["Allowance"] || 0) +
                        (scholar["Internet Allowance"] || 0) +
                        (scholar["Transportation Allowance"] || 0);
                    ++index;

                    // Accumulate totals for grand total calculation
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
                        "", // Signature/Date
                    ]);

                    lastDataRow = dataRow.number;
                    allAllowanceRows.push(dataRow.number);

                    // Center align and set fonts for data cells
                    for (let col = 1; col <= 8; col++) {
                        const cell = dataRow.getCell(col);

                        // Set alignment based on column
                        if (col >= 2 && col <= 4) {
                            // Yr. Level, Last Name, First Name: left align
                            cell.alignment = {
                                horizontal: "left",
                            };
                        } else {
                            // Other columns: center align
                            cell.alignment = {
                                horizontal: "center",
                            };
                        }

                        // Set font based on column
                        if (col === 1) {
                            // No. column: Arial Narrow, size 11
                            cell.font = { name: "Arial Narrow", size: 11 };
                        } else if (col >= 2 && col <= 4) {
                            // Yr. Level to TOTAL: Arial, size 9
                            cell.font = { name: "Arial", size: 9 };
                        } else if (col >= 2 && col <= 4) {
                            // Yr. Level to TOTAL: Arial, size 11
                            cell.font = { name: "Arial Narrow", size: 11 };
                        }
                    }

                    // Mark data row for borders
                    tableRows.push(dataRow.number);
                });
            }

            // Add TOTAL row at the end of each school's table (outside the table, no borders)
            if (school.Scholar?.length > 0) {
                const totalRow = worksheet.addRow([
                    "", // No.
                    "", // Yr. Level
                    "", // Last Name
                    "TOTAL", // First Name
                    { formula: `SUM(E${firstDataRow}:E${lastDataRow})` }, // Allowance
                    { formula: `SUM(F${firstDataRow}:F${lastDataRow})` }, // Internet Allowance
                    { formula: `SUM(G${firstDataRow}:G${lastDataRow})` }, // Transportation Allowance
                    { formula: `SUM(H${firstDataRow}:H${lastDataRow})` }, // TOTAL
                    "", // Signature/Date
                ]);

                // Track this TOTAL row for grand total calculation
                schoolTotalRows.push(totalRow.number);

                // Style the TOTAL row
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

                // NOTE: TOTAL row is NOT added to tableRows, so it won't have borders
            }

            // Add blank row between schools (except after the last school)
            if (schoolIndex < data.length - 1) {
                worksheet.addRow([]);
            }
        });

        // Calculate the grand total value from source data
        const grandTotalValue = allowanceTotal + internetTotal + transportTotal;

        // Add GRAND TOTAL row at the very end
        if (schoolTotalRows.length > 0) {
            worksheet.addRow([]); // Blank row before grand total

            const grandTotalRow = worksheet.addRow([
                "", // No.
                "", // Yr. Level
                "GRAND TOTAL", // Last Name
                "", // First Name (merged with Last Name)
                { formula: `SUM(E${schoolTotalRows.join(",E")})` }, // Allowance - sum of all school totals
                { formula: `SUM(F${schoolTotalRows.join(",F")})` }, // Internet Allowance - sum of all school totals
                { formula: `SUM(G${schoolTotalRows.join(",G")})` }, // Transportation Allowance - sum of all school totals
                "", // TOTAL (empty)
                "", // Placeholder for overall total
            ]);

            // Now set the formula for the overall total using the row number
            grandTotalRow.getCell(9).value = {
                formula: `E${grandTotalRow.number}+F${grandTotalRow.number}+G${grandTotalRow.number}`,
            };

            // Merge Last Name and First Name cells for "GRAND TOTAL"
            worksheet.mergeCells(
                grandTotalRow.number,
                3,
                grandTotalRow.number,
                4
            );

            // Style the GRAND TOTAL row
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
                cell.alignment = { horizontal: "center", vertical: "middle" };
            }

            // Style the overall total in Signature/Date column
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

        // Set column widths
        worksheet.columns = [
            { width: 6 }, // No.
            { width: 7 }, // Yr. Level
            { width: 10 }, // Last Name
            { width: 14 }, // First Name
            { width: 10 }, // Allowance
            { width: 10 }, // Internet Allowance
            { width: 10 }, // Transportation Allowance
            { width: 10 }, // TOTAL
            { width: 15 }, // Signature/Date
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

        // Pass the calculated grand total value to the database
        await uploadExcelToDatabase(workbook, fileName, grandTotalValue);

        // Generate and download Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${fileName}.xlsx`);
        return true;
    };

    const exportScholarInformationToExcel = async (dataArray, fileName) => {
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

    return { exportAllowancesToExcel, exportScholarInformationToExcel };
};
