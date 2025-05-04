import Accordion from "./Accordion";
import { Award } from "lucide-react";

function ScholarshipInfo() {
    return (
        <section className="px-5 py-8 bg-white">
            <div className="mb-6 mx-auto w-max flex items-center gap-2">
                <Award className="text-green-600" size={32} />
                <h2 className="text-3xl font-bold text-gray-800">
                    Scholarship Criteria
                </h2>
            </div>
            <div className="max-w-[800px] mx-auto">
                <Accordion />
            </div>
        </section>
    );
}

export default ScholarshipInfo;
