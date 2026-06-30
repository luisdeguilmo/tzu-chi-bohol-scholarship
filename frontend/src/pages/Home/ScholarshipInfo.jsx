import Accordion from "./Accordion";
import { Award } from "lucide-react";

function ScholarshipInfo() {
    return (
        <section className="md:px-5 py-4 bg-white">
            <div className="mb-8 mx-auto w-max flex items-center gap-2">
                <Award className="w-5 h-5 md:w-8 md:h-8 text-green-600" />
                <h2 className="text-xl md:text-3xl font-bold text-gray-800">
                    Scholarship Criteria
                </h2>
            </div>
            <div className="max-w-[900px] mx-auto">
                <Accordion />
            </div>
        </section>
    );
}

export default ScholarshipInfo;
