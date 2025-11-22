import { toast } from "react-toastify";
import { useCheckEmail } from "../../../hooks/useCheckEmail";
import { useAuth } from "../../../context/AuthContext";
import { useEffect } from "react";
import { useApplicationForm } from "../../../context/ApplicationFormContext";

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
    isFirstFormApplicable = false,
    isSecondFormApplicable = false,
}) => {
    const { user } = useAuth();
    const { isTzuChiSiblingsApplicable, isOtherAssistanceApplicable } =
        useApplicationForm();

    const { isEmailExist, refetch } = useCheckEmail(
        formData?.personal_information.email,
        user?.user_id ?? null
    );

    useEffect(() => {
        refetch();
    }, [formData?.personal_information.email]);

    const checkAndProceed = (e) => {
        e.preventDefault();

        if (sections) {
            let [section1, section2] = sections;

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

        if (section === "Personal") {
            const isGmail = (email) => /^[^\s@]+@gmail\.com$/.test(email);

            if (!isGmail(formData.personal_information.email)) {
                toast.error("Invalid email address.");
                return;
            }
        }

        if (section === "Personal") {
            if (isEmailExist) {
                toast.error(
                    user?.user_id
                        ? "Email is already used."
                        : "An application with this email already exists."
                );

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

        if (section === "Family") {
            if (isTzuChiSiblingsApplicable === null) {
                toast.error(
                    "Please select whether you have siblings who received Tzu Chi Educational Assistance."
                );
                return;
            }
        }

        if (section === "Family") {
            if (isOtherAssistanceApplicable === null) {
                toast.error(
                    "Please select whether you received assistance from other organizations."
                );
                return;
            }
        }

        if (section === "Family") {
            if (
                isFirstFormApplicable &&
                formData.tzu_chi_siblings.length === 0
            ) {
                toast.error(
                    "Please add at least one sibling who received Tzu Chi Educational Assistance."
                );
                return;
            }
        }

        if (section === "Family") {
            if (
                isSecondFormApplicable &&
                formData.other_assistance.length === 0
            ) {
                toast.error(
                    "Please provide the details of the assistance you received."
                );
                return;
            }
        }

        if (!sections && section === "Requirements") {
            if (
                formData.picture_file === null ||
                formData.uploaded_files.length === 0
            ) {
                toast.error("Please fill in all required fields");

                // You could also highlight the fields with errors here if needed
                return;
            }
        }

        if (section === "Other Information") {
            const refs = formData.character_reference;

            // If no reference entered
            if (refs.length === 0) {
                toast.error("Please add at least 1 character reference.");
                return;
            }

            // If more than 3 references
            if (refs.length > 3) {
                toast.error(
                    "You can only add a maximum of 3 character references."
                );
                return;
            }

            // If fewer than 3 but at least 1
            // if (refs.length < 3) {
            //     toast.info(
            //         "You have added fewer than the recommended 3 character references."
            //     );
            // }
        }

        // if (section === "Other Information") {
        //     if (formData.character_reference.length < 3) {
        //         toast.error("You must add 3 character references to continue.");
        //         return;
        //     }
        // }

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
        <div className="mt-6">
            {!isFirst && (
                <button
                    className="mr-2 px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-lg"
                    onClick={prevStep}
                >
                    Previous
                </button>
            )}

            {!isLast ? (
                <button
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg shadow-lg"
                    onClick={checkAndProceed}
                >
                    Next
                </button>
            ) : (
                <button
                    className={`px-5 py-2 ${
                        disabled
                            ? "bg-green-400"
                            : "bg-green-600 hover:bg-green-700"
                    } text-white text-sm rounded-lg shadow-lg`}
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
