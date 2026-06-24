import { Archive, Calendar, HandHeart } from "lucide-react";

const EmptyState = ({
    section,
    searchTerm,
    activeTab,
    setSearchTerm,
    header,
    subHeader,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="md:w-24 md:h-24 w-20 h-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-green-100">
                {searchTerm ? (
                    <svg
                        className="md:w-12 md:h-12 w-8 h-8 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                ) : section === "events" ? (
                    <Calendar className="md:w-12 md:h-12 w-8 h-8 text-green-400" />
                ) : section === "community_services" ? (
                    <HandHeart className="md:w-12 md:h-12 w-8 h-8 text-green-400" />
                ) : (
                    <Archive className="md:w-12 md:h-12 w-8 h-8 text-green-400" />
                )}
            </div>
            <h3 className="md:text-xl text-lg text-slate-700 mb-2">
                {header}
            </h3>
            <p className="text-slate-500 md:text-[15px] text-sm max-w-md mb-4">
                {subHeader}
            </p>
            {searchTerm && (
                <button
                    onClick={() => setSearchTerm("")}
                    className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                >
                    Clear search
                </button>
            )}
        </div>
    );
};

export default EmptyState;
