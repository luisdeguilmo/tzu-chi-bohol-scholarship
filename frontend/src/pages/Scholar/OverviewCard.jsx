import { Calendar } from "lucide-react";
import SearchInputMobile from "../../components/SearchInputMobile";
import TabNavigation from "./TabNavigation";
import { date } from "../../utils/getDateAndTime";
import SummaryCards from "./SummaryCards";

const OverviewCard = ({
    label,
    tabs,
    activeTab,
    handleTabChange,
    searchTerm,
    setSearchTerm,
    placeholder,
    overviewData,
}) => {
    return (
        <div className=" bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-6">
                <h2 className="text-xl text-slate-700 font-bold mb-4">
                    {label}
                </h2>

                {/* Overview Cards */}
                <div className="mb-6 p-6 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl text-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-left text-white/90 text-sm font-medium">
                                This Month Overview
                            </p>
                            <div className="flex items-center gap-2 text-white/80">
                                <Calendar className="w-4 h-5 text-white" />
                                <span className="text-sm">
                                    {date.getCurrentMonthFormatted()}{" "}
                                    {new Date().getFullYear()}
                                </span>
                            </div>
                        </div>

                        <SummaryCards overviewData={overviewData} />
                    </div>
                </div>

                {/* Search Input */}
                <SearchInputMobile
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder={`Search ${placeholder}...`}
                />
            </div>

            {/* Tab Navigation */}
            <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                handleTabChange={handleTabChange}
            />
        </div>
    );
};

export default OverviewCard;
