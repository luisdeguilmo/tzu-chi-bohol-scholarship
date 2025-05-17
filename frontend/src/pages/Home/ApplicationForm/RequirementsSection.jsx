import { useCallback } from "react";
import FileUploadForm from "./FileUploadForm";
import NavigationButtons from "./NavigationButtons";

const RequirementsSection = ({
    formData,
    setFormData,
    prevStep,
    handleSubmit,
}) => {
    // Function to update the files-related data in the main form state
    const updateFilesData = useCallback(
        (filesData) => {
            setFormData((prevData) => ({
                ...prevData,
                ...filesData, // This will add/update uploaded_files
            }));
        },
        [setFormData]
    );

    return (
        <div className="w-[80%] lg:w-[65%] mx-auto">
            <h2 className="pb-12 font-bold">Requirements</h2>
            <FileUploadForm
                formData={formData}
                updateFilesData={updateFilesData}
            />
            <NavigationButtons
                isFirst={false}
                isLast={true}
                prevStep={prevStep}
                handleSubmit={handleSubmit}
                sections={null}
            />
        </div>
    );
};

export default RequirementsSection;