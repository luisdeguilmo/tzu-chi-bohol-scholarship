import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

export const generateExcel = () => {
    const exportAllowancesToExcel = async (data, fileName) => {
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
                return sum + (typeof val === "number" ? val : 0);
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
                data.forEach((row) => {
                    const value = Object.values(row)[i];
                    sum += typeof value === "number" ? value : 0;
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
            { width: 15 },
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
