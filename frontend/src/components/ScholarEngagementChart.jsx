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

// Register the Chart.js components
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
    primary: "rgba(54, 162, 235, 1)",
    success: "rgba(75, 192, 192, 1)",
};

const ScholarEngagementChart = ({
    eventAttendanceData,
    communityServiceHoursCompletionData,
}) => {
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
                label: "Event Attendance %",
                data: eventAttendanceData?.map(
                    (item) => item.attendance_percent
                ),
                borderColor: chartColors.primary,
                backgroundColor: "transparent",
                tension: 0.4,
            },
            {
                label: "Service Hours Completion %",
                data: communityServiceHoursCompletionData?.map(
                    (item) => item.completion_percent
                ),
                borderColor: chartColors.success,
                backgroundColor: "transparent",
                tension: 0.4,
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
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default ScholarEngagementChart;
