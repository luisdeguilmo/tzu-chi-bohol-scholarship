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
    primary: "rgba(54, 162, 235, 1)",        // blue
    info: "rgba(23, 162, 184, 1)",          // teal
    success: "rgba(40, 167, 69, 1)",        // green
    warning: "rgba(255, 193, 7, 1)",        // yellow
    secondary: "rgba(108, 117, 125, 1)",    // gray
    orange: "rgba(255, 159, 64, 1)",        // NEW: orange
    danger: "rgba(255, 99, 132, 1)",        // NEW: red
};

const FunnelChart = ({ applicationData }) => {
    const data = {
        labels: [
            "Application",
            "Entrance Examination",
            "Initial Interview",
            "Home Visitation",
            "Final Interview",
            "Orientation",
            "Awarding",
        ],
        datasets: [
            {
                label: "Applicants",
                data: [
                    applicationData?.application,
                    applicationData?.exam,
                    applicationData?.interview,
                    applicationData?.home_visit,
                    applicationData?.final_interview,
                    applicationData?.orientation,
                    applicationData?.awarding,
                ],
                backgroundColor: [
                    chartColors.primary,
                    chartColors.info,
                    chartColors.success,
                    chartColors.warning,
                    chartColors.secondary,
                    chartColors.orange,   // added
                    chartColors.danger,   // added
                ],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
    };

    return (
        <div className="chart-card">
            <div className="chart-container" style={{ height: "300px" }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default FunnelChart;
