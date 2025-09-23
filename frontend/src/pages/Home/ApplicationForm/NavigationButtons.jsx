import { toast } from "react-toastify";

const validateSection = (section, formData, formConfig) => {
    const errors = {};
    let hasErrors = false;

    // const [section1, section2] = sections;

    formConfig[section].forEach((field) => {
        if (
            field.required &&
            !formData[section][field.name]?.toString().trim()
        ) {
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
    disabled,
    handleSubmit,
    handleRenewSubmit,
    formData,
    formConfig,
    sections,
    section,
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

        if (section === "Family") {
            if (formData.family_members.length === 0) {
                toast.error("Please fill in all required fields");

                // You could also highlight the fields with errors here if needed
                return;
            }
        }

        if (!sections && section === "Requirements") {
            if (formData.picture_file === null || formData.uploaded_files.length === 0) {
                toast.error("Please fill in all required fields");

                // You could also highlight the fields with errors here if needed
                return;
            }
        }

        if (section === "Other Information") {
            if (formData.character_reference.length === 0) {
                toast.error("Please fill in all required fields");
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
                    className="mr-2 px-5 py-[6px] bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-md"
                    onClick={prevStep}
                >
                    Previous
                </button>
            )}

            {!isLast ? (
                <button
                    className="px-5 py-[6px] bg-green-600 hover:bg-green-700 text-white text-sm rounded-md shadow-lg"
                    onClick={checkAndProceed}
                >
                    Next
                </button>
            ) : (
                <button
                    className={`px-5 py-[6px] ${
                        disabled
                            ? "bg-green-400"
                            : "bg-green-600 hover:bg-green-700"
                    } text-white text-sm rounded-md shadow-lg`}
                    onClick={checkAndProceed}
                    disabled={disabled}
                >
                    Submit
                </button>
            )}
        </div>
    );
};

export default NavigationButtons;
