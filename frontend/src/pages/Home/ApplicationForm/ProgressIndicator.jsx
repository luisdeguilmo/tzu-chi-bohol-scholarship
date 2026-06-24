import { Check } from "lucide-react";

const ProgressIndicator = ({ includeRequirements, steps, currentStep }) => {
    const progressWidth =
        steps.length > 1
            ? ((!includeRequirements && currentStep === 6
                  ? currentStep - 2
                  : currentStep - 1) /
                  (steps.length - 1)) *
              100
            : 0;

    return (
        <div className="w-[85%] sm:w-[80%] xl:w-[70%] mx-auto mb-8 mt-6">
            <div className="relative flex items-center justify-between">
                {/* Background line */}
                <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-gray-200 rounded"></div>

                {/* Active progress line */}
                <div
                    className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-green-600 rounded transition-all duration-300"
                    style={{ width: `${progressWidth}%` }}
                ></div>

                {/* Step indicators */}
                {steps.map((step, index) => {
                    const isCompleted = index + 1 <= currentStep;

                    return (
                        <div
                            key={index}
                            className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors duration-300 ${
                                isCompleted
                                    ? "bg-green-600 border-green-600"
                                    : "bg-gray-200 border-gray-200"
                            }`}
                        >
                            {isCompleted && (
                                <Check className="w-4 h-4 text-white" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Step labels */}
            <div className="flex justify-between mt-3 md:text-xs text-[10px] text-gray-500">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`text-center ${
                            index + 1 <= currentStep
                                ? "text-green-600 font-medium"
                                : ""
                        }`}
                    >
                        {step.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressIndicator;
