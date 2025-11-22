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

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const chartColors = {
    purple: "rgba(128, 90, 213, 1)", // Purple color for bars
};

const DutyHoursChart = ({ scholars }) => {
    const data = {
        labels: scholars?.map((scholar) => scholar.first_name),
        datasets: [
            {
                label: "Duty Hours",
                data: scholars?.map((scholar) => scholar.rendered_hours),
                backgroundColor: chartColors.purple,
            },
        ],
    };

    const options = {
        indexAxis: "y", // horizontal bar
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
    };

    return (
        <div className="chart-card full-width">
            =
            <div className="chart-container" style={{ height: "300px" }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default DutyHoursChart;
