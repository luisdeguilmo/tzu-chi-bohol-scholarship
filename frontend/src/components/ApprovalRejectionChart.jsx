import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const chartColors = {
    primary: "rgba(54, 162, 235, 1)", // blue
    info: "rgba(23, 162, 184, 1)", // teal
    success: "rgba(40, 167, 69, 1)", // green
    warning: "rgba(255, 193, 7, 1)", // yellow
    danger: "rgba(255, 99, 132, 1)", // red
    purple: "rgba(153, 102, 255, 1)", // purple
};

const ApprovalRejectionChart = ({ stageData }) => {
    const data = {
        labels: stageData?.labels || [
            "Application",
            "Entrance Examination",
            "InitialInterview",
            "Home Visitation",
            "Final Interview",
        ],
        datasets: [
            {
                label: "Approved",
                data: stageData?.map((item) => item.approved),
                backgroundColor: chartColors.success,
            },
            {
                label: "Rejected",
                data: stageData?.map((item) => item.rejected),
                backgroundColor: chartColors.danger,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            title: {
                display: true,
                font: { size: 18 },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="chart-card full-width">
            <div className="chart-container" style={{ height: "350px" }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default ApprovalRejectionChart;
