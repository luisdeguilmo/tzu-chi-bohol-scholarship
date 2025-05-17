import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PersonalSection from "./PersonalSection";
import EducationSection from "./EducationSection";
import ApplicationSection from "./ApplicationSection";
import FamilySection from "./FamilySection";
import RequirementsSection from "./RequirementsSection";
import ProgressIndicator from "./ProgressIndicator";
import formConfig from "../../../constant/application/formConfig";
import FORM_SECTIONS from "../../../constant/application/formSections";

const generateInitialState = (fieldsConfig) => {
    const initialState = {};
    fieldsConfig.forEach((field) => {
        initialState[field.name] =
            field.type === "select" ? field.defaultValue || "" : "";
    });
    return initialState;
};

function ApplicationForm({ includeRequirements = true }) {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false); // For showing a loading spinner or message
    const [error, setError] = useState(null); // For displaying error messages

    // Define steps based on whether requirements are included
    const steps = [
        { label: "Application", section: FORM_SECTIONS.APPLICATION },
        { label: "Personal", section: FORM_SECTIONS.PERSONAL },
        { label: "Education", section: FORM_SECTIONS.EDUCATION },
        { label: "Family", section: FORM_SECTIONS.FAMILY },
    ];

    // Add requirements step if needed
    if (includeRequirements) {
        steps.push({
            label: "Requirements",
            section: FORM_SECTIONS.REQUIREMENTS,
        });
    }

    // Total number of steps in the form
    const totalSteps = steps.length;

    // Consolidated form state
    const [formData, setFormData] = useState({
        application_info: generateInitialState(
            formConfig[FORM_SECTIONS.APPLICATION]
        ),
        personal_information: generateInitialState(
            formConfig[FORM_SECTIONS.PERSONAL]
        ),
        educational_background: generateInitialState(
            formConfig[FORM_SECTIONS.EDUCATION]
        ),
        parents_guardian: generateInitialState(
            formConfig[FORM_SECTIONS.FAMILY]
        ),
        contact_person: generateInitialState(
            formConfig[FORM_SECTIONS.CONTACT_PERSON]
        ),
        // Initialize the family-related data
        family_members: [],
        tzu_chi_siblings: [],
        other_assistance: [],
        // Initialize the files-related data
        uploaded_files: [],
    });

    // Generic handler for input changes
    const handleInputChange = (section, e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [name]: value,
            },
        }));
    };

    // Navigation functions
    const nextStep = (e) => {
        e.preventDefault();
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const prevStep = (e) => {
        e.preventDefault();
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleRenewSubmit = (e) => {
        e.preventDefault();
        // setFormData(formData.application_info.status = 'Old');
        console.log(`Form Submitted:\n${JSON.stringify(formData, null, 2)}`);
    };

    // Handle final form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.application_info.status = 'New';
        console.log(`Form Submitted:\n${JSON.stringify(formData, null, 2)}`);
    
        const submitStudentData = async () => {
            try {
                setLoading(true);
    
                const formDataToSend = new FormData();
    
                // Separate application data (excluding files)
                const applicationData = { ...formData };
                delete applicationData.uploaded_files;
    
                formDataToSend.append(
                    'applicationData',
                    JSON.stringify(applicationData)
                );
    
                // Append files one by one
                if (formData.uploaded_files && formData.uploaded_files.length > 0) {
                    formData.uploaded_files.forEach((fileItem) => {
                        // If we have the actual file object stored in fileObj property
                        if (fileItem.fileObj) {
                            formDataToSend.append('files[]', fileItem.fileObj);
                        }
                        // Also send the filename format as a separate key
                        formDataToSend.append('fileInfo[]', JSON.stringify({ 
                            filename: fileItem.filename 
                        }));
                    });
                }
    
                const response = await axios.post(
                    "http://localhost:8000/backend/api/applications",
                    formDataToSend,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
    
                console.log("Server response:", response.data);
                toast.success("Application submitted successfully!");
                setLoading(false);
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } catch (err) {
                console.error("Error submitting data:", err);
                setError("Failed to submit. Please try again.");
                toast.error("Failed to submit application. Please try again.");
                setLoading(false);
            }
        };
    
        submitStudentData();
    };
    
    console.log(formData);

    // Render form step components
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <ApplicationSection
                        formData={formData}
                        handleInputChange={handleInputChange}
                        nextStep={nextStep}
                    />
                );
            case 2:
                return (
                    <PersonalSection
                        formData={formData}
                        handleInputChange={handleInputChange}
                        prevStep={prevStep}
                        nextStep={nextStep}
                    />
                );
            case 3:
                return (
                    <EducationSection
                        formData={formData}
                        handleInputChange={handleInputChange}
                        prevStep={prevStep}
                        nextStep={nextStep}
                    />
                );
            case 4:
                if (includeRequirements) {
                    return (
                        <FamilySection
                            formData={formData}
                            setFormData={setFormData}
                            handleInputChange={handleInputChange}
                            prevStep={prevStep}
                            nextStep={nextStep}
                        />
                    );
                } else {
                    return (
                        <FamilySection
                            formData={formData}
                            setFormData={setFormData}
                            handleInputChange={handleInputChange}
                            prevStep={prevStep}
                            nextStep={nextStep}
                            handleRenewSubmit={handleRenewSubmit}
                            isLast={true}
                        />
                    );
                }
            case 5:
                // Only render if requirements are included
                if (includeRequirements) {
                    return (
                        <RequirementsSection
                            formData={formData}
                            setFormData={setFormData}
                            prevStep={prevStep}
                            handleSubmit={handleSubmit}
                        />
                    );
                }
                return null;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center">
            {/* Add Toaster component for notifications */}

            <ProgressIndicator steps={steps} currentStep={currentStep} />
            {renderStep()}
        </div>
    );
}

function NewApplicationForm() {
    return <ApplicationForm includeRequirements={true} />;
}

function RenewalApplicationForm() {
    return <ApplicationForm includeRequirements={false} />;
}

export { ApplicationForm, NewApplicationForm, RenewalApplicationForm };
