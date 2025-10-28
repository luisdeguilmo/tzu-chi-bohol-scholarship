import React from "react";
import { saveAs } from "file-saver";
import { useScholarAllowances } from "../../../hooks/useScholarAllowances";

import * as XLSX from "xlsx";
import ExcelJS from "exceljs";

const ExportToExcel = ({ data, fileName }) => {
    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        // Add headers with Total column
        const headers = [...Object.keys(data[0]), "Total"];
        const headerRow = worksheet.addRow(headers);
        
        // Make headers bold
        headerRow.font = { bold: true };

        // Add data rows with row totals
        const rowTotals = [];
        data.forEach((row) => {
            const rowValues = Object.values(row);
            // Calculate row total (sum of numeric values)
            const rowTotal = rowValues.slice(1).reduce((sum, val) => {
                return sum + (typeof val === 'number' ? val : 0);
            }, 0);
            rowTotals.push(rowTotal);
            worksheet.addRow([...rowValues, rowTotal]);
        });

        // Calculate column totals including the Total column
        const totals = ["Overall Total"];
        for (let i = 1; i < headers.length; i++) {
            let sum = 0;
            if (i < headers.length - 1) {
                // Sum data columns
                data.forEach(row => {
                    const value = Object.values(row)[i];
                    sum += (typeof value === 'number' ? value : 0);
                });
            } else {
                // Sum the Total column
                sum = rowTotals.reduce((acc, val) => acc + val, 0);
            }
            totals.push(sum);
        }

        // Add total row
        worksheet.addRow(totals);

        // Set column widths
        worksheet.columns = [
            { width: 30 },
            { width: 15 },
            { width: 20 },
            { width: 15 },
            { width: 15 }
        ];

        // Apply center alignment to columns B, C, D, E (numeric columns)
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, colNumber) => {
                if (colNumber >= 2) {
                    cell.alignment = {
                        horizontal: "center",
                        vertical: "middle",
                    };
                }
                
                // Make total row bold
                if (rowNumber === worksheet.rowCount) {
                    cell.font = { bold: true };
                }
            });
        });

        // Generate Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${fileName}.xlsx`);
    };

    return <button onClick={exportToExcel}>Export to Excel</button>;
};

// const ExportToExcel = ({ data, fileName }) => {
//     const exportToExcel = () => {
//         // 1. Convert JSON data to a worksheet
//         const worksheet = XLSX.utils.json_to_sheet(data);

//         // Set column widths
//         worksheet["!cols"] = [
//             { wch: 30 },
//             { wch: 15 },
//             { wch: 15 },
//             { wch: 15 },
//         ];

//         // 2. Apply center alignment to all cells with numeric values
//         const range = XLSX.utils.decode_range(worksheet["!ref"]);
//         for (let R = range.s.r; R <= range.e.r; ++R) {
//             for (let C = range.s.c; C <= range.e.c; ++C) {
//                 const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//                 if (!worksheet[cellAddress]) continue;

//                 // Initialize cell style if it doesn't exist
//                 if (!worksheet[cellAddress].s) {
//                     worksheet[cellAddress].s = {};
//                 }

//                 // Apply center alignment to columns B, C, D (indices 1, 2, 3)
//                 if (C >= 1) {
//                     worksheet[cellAddress].s.alignment = {
//                         horizontal: "center",
//                         vertical: "center",
//                     };
//                 }
//             }
//         }

//         // 3. Create a new workbook and append the worksheet
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//         // 4. Generate a buffer with cellStyles enabled
//         const excelBuffer = XLSX.write(workbook, {
//             bookType: "xlsx",
//             type: "array",
//             cellStyles: true,
//         });

//         // 5. Create a Blob and save the file
//         const dataBlob = new Blob([excelBuffer], {
//             type: "application/octet-stream",
//         });
//         saveAs(dataBlob, `${fileName}.xlsx`);
//     };

//     return <button onClick={exportToExcel}>Export to Excel</button>;
// };

function TestExcel() {
    const { scholarAllowances } = useScholarAllowances();

    return (
        <div>
            <h1>My Data</h1>
            <ExportToExcel data={scholarAllowances} fileName="UserData" />
        </div>
    );
}

export default TestExcel;
