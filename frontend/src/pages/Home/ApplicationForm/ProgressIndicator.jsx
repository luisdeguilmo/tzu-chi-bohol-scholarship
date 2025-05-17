const ProgressIndicator = ({ steps, currentStep }) => {
    return (
        <div className="w-[80%] lg:w-[65%] mx-auto mb-8 mt-6">
            <div className="relative flex items-center justify-between">
                {/* Progress line */}
                <div className="absolute h-1 bg-gray-200 w-full"></div>

                {/* Step indicators */}
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full 
                  ${index + 1 <= currentStep ? "bg-green-500" : "bg-gray-300"}`}
                    >
                        {/* Optional step number or icon inside the circle */}
                        {index + 1 <= currentStep && (
                            <span className="material-symbols-outlined text-white">
                                check
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Step labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
                {steps.map((step, index) => (
                    <div key={index}>{step.label}</div>
                ))}
            </div>
        </div>
    );
};

export default ProgressIndicator;