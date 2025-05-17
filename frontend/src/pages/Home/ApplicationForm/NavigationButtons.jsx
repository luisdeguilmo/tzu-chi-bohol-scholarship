import { toast } from "react-toastify";

const validateSection = (section, formData, formConfig) => {
    const errors = {};
    let hasErrors = false;

    // const [section1, section2] = sections;

    formConfig[section].forEach((field) => {
        if (field.required && !formData[section][field.name]?.trim()) {
            errors[field.name] = `${field.label} is required`;
            hasErrors = true;
        }
    });

    return { errors, hasErrors };
};

const NavigationButtons = ({
    isFirst,
    isLast,
    prevStep,
    nextStep,
    handleSubmit,
    handleRenewSubmit,
    formData,
    formConfig,
    sections,
}) => {
    const checkAndProceed = (e) => {
        e.preventDefault();

        if (sections) {
            let [section1, section2] = sections;
            console.log(section1, section2);
            console.log(sections);
            // let section1, section2;

            const { errors, hasErrors } = validateSection(
                section1.toString(),
                formData,
                formConfig
            );

            // let hasErrorsInSection2 = false, errors2 = {};

            if (section2) {
                const { errors, hasErrors } = validateSection(
                    section2,
                    formData,
                    formConfig
                );

                if (hasErrors) {
                    // Show toast notification for validation errors
                    toast.error("Please fill in all required fields");

                    // You could also highlight the fields with errors here if needed
                    return;
                }
            }

            if (hasErrors) {
                // Show toast notification for validation errors
                toast.error("Please fill in all required fields");

                // You could also highlight the fields with errors here if needed
                return;
            }
        }

        // If validation passes, proceed to next step
        if (!isLast) {
            nextStep(e);
        } else {
            if (handleRenewSubmit) {
                handleRenewSubmit(e);
            } else {
                handleSubmit(e);
            }
        }
    };

    return (
        <div className="mt-4">
            {!isFirst && (
                <button
                    className="mr-2 px-5 py-[6px] bg-gray-200 text-gray-600 rounded-md"
                    onClick={prevStep}
                >
                    Previous
                </button>
            )}

            {!isLast ? (
                <button
                    className="px-5 py-[6px] bg-green-500 text-white rounded-md shadow-lg"
                    onClick={checkAndProceed}
                >
                    Next
                </button>
            ) : (
                <button
                    className="px-5 py-[6px] bg-green-500 text-white rounded-md shadow-lg"
                    onClick={checkAndProceed}
                >
                    Submit
                </button>
            )}
        </div>
    );
};

export default NavigationButtons;