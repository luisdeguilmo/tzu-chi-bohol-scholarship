import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register the components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

const chartColors = {
    success: "rgba(40, 167, 69, 1)",
};

const AllowanceChart = ({ monthlyAllowanceDistributionData }) => {
    const data = {
        labels: [
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
                label: "Amount Distributed (₱)",
                data: monthlyAllowanceDistributionData?.map(
                    (item) => item.amount
                ),
                borderColor: chartColors.success,
                backgroundColor: "rgba(72, 187, 120, 0.1)",
                tension: 0.4,
                fill: true,
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
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default AllowanceChart;
