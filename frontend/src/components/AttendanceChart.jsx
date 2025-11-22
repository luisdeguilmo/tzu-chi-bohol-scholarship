import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const chartColors = {
    success: "rgba(40, 167, 69, 1)",
    danger: "rgba(220, 53, 69, 1)",
    warning: "rgba(255, 193, 7, 1)",
};

const AttendanceChart = ({ orientationAndAwardingData }) => {
    const data = {
        labels: ["Attended", "Absent"],
        datasets: [
            {
                data: [142, 8, 6],
                backgroundColor: [
                    chartColors.success,
                    chartColors.danger,
                    chartColors.warning,
                ],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="chart-card">
            <div className="chart-container" style={{ height: "300px" }}>
                <Doughnut data={data} options={options} />
            </div>
        </div>
    );
};

export default AttendanceChart;
