import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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

const ApplicationTrendsChart = ({ trendData }) => {
    const data = {
        labels: trendData?.labels || [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        datasets: [
            {
                label: "Applications Submitted",
                data: trendData?.map((item) => item.applications_submitted),
                borderColor: chartColors.primary,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                tension: 0.4,
            },
            {
                label: "Applications Approved",
                data: trendData?.map((item) => item.applications_approved),
                borderColor: chartColors.success,
                backgroundColor: "rgba(40, 167, 69, 0.2)",
                tension: 0.4,
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
        <div className="chart-card">
            <div className="chart-container" style={{ height: "300px" }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default ApplicationTrendsChart;
