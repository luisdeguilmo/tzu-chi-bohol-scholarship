import { useState } from "react";
import NavigationButtons from "./NavigationButtons";
import ReviewPage from "./ReviewPage";

const ReviewSection = ({ formData, prevStep, handleSubmit }) => {
    const [isConsent, setIsConsent] = useState(false);

    const handleConsent = () => {
        setIsConsent(!isConsent);
    };

    return (
        <div className="w-[85%] lg:w-[65%] mx-auto">
            <h2 className="pb-6 font-bold">Review Information</h2>
            <ReviewPage
                formData={formData}
                isConsent={isConsent}
                onSetConsent={handleConsent}
            />
            <NavigationButtons
                isFirst={false}
                isLast={true}
                prevStep={prevStep}
                disabled={!isConsent}
                handleSubmit={handleSubmit}
                sections={null}
            />
        </div>
    );
};

export default ReviewSection;
