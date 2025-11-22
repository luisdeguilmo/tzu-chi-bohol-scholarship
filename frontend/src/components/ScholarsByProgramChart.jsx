import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Register components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const chartColors = {
    primary: "rgba(54, 162, 235, 1)", // blue
    info: "rgba(23, 162, 184, 1)", // teal
    success: "rgba(40, 167, 69, 1)", // green
    warning: "rgba(255, 193, 7, 1)", // yellow
    danger: "rgba(255, 99, 132, 1)", // red
    purple: "rgba(153, 102, 255, 1)", // purple
};

const ScholarsByProgramChart = ({ scholarData }) => {
    const data = {
        labels: scholarData?.map((item) => item.category),
        datasets: [
            {
                data: scholarData?.map((item) => item.total_scholars),
                backgroundColor: [
                    chartColors.primary,
                    chartColors.info,
                    chartColors.success,
                    chartColors.warning,
                    chartColors.danger,
                    chartColors.purple,
                ],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                font: { size: 18 },
            },
        },
    };

    return (
        <div className="chart-card">
            <div className="chart-container" style={{ height: "300px" }}>
                <Pie data={data} options={options} />
            </div>
        </div>
    );
};

export default ScholarsByProgramChart;
