import React from "react";

const BackgroundLoadingIndicator = () => {
    return (
        <>
            {/* Animated gradient background */}
            <div className="absolute inset-0 " />

            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="bg-gray-100 rounded-lg p-6 shadow-sm animate-pulse"
                >
                    <div className="h-7 w-3/4 bg-gray-200 rounded mb-5"></div>
                    <div className="h-3.5 w-1/2 bg-gray-200 rounded mb-3"></div>
                    <div className="h-3.5 w-2/3 bg-gray-200 rounded mb-3"></div>
                    <div className="h-3.5 w-1/3 bg-gray-200 rounded mb-3"></div>
                    <div className="h-3.5 w-2/3 bg-gray-200 rounded"></div>
                </div>
            ))}

            {/* Gradient shimmer animation */}
            <style>
                {`
          @keyframes gradient-blur {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-blur {
            background-size: 200% 200%;
            animation: gradient-blur 6s ease infinite;
          }
        `}
            </style>
        </>
    );
};

export default BackgroundLoadingIndicator;
