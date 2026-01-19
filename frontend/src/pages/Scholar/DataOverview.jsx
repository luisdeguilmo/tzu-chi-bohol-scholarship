import { Calendar, CheckCircle, Clock } from "lucide-react";

const DataOverview = ({ overviewData }) => {
    return (
        <div className="mb-6 p-6 bg-green-600 rounded-xl shadow-xl text-center relative overflow-hidden">
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
                        <span className="text-sm">July 2024</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white/80 text-xs sm:text-sm">
                                Attended Events
                            </span>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-4 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {overviewData.attendedEvents || 0}
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white/80 text-xs sm:text-sm">
                                Upcoming Events
                            </span>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {overviewData.numberOfEvents || 0}
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white/80 text-xs sm:text-sm">
                                All Events
                            </span>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {overviewData.numberOfEvents || 0}
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white/80 text-xs sm:text-sm">
                                Total Rendered Hours
                            </span>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                <Clock className="w-4 h-5 text-white" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">4</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataOverview;
