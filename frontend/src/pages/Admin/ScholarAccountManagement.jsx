import { useState } from "react";
import PendingScholars from "./PendingScholars";
import CreatedAccounts from "./CreatedAccounts";

export default function ScholarAccountManagement() {
    const [activeTab, setActiveTab] = useState("pending");

    return (
        <div className="py-8">
            <div className="max-w-7xl  mx-auto rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Scholar Account Management</h1>
                
                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab("pending")}
                            className={`py-4 px-6 font-medium text-sm inline-flex items-center ${
                                activeTab === "pending"
                                    ? "border-b-2 border-green-500 text-green-600"
                                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Pending Scholars
                        </button>
                        <button
                            onClick={() => setActiveTab("accounts")}
                            className={`py-4 px-6 font-medium text-sm inline-flex items-center ${
                                activeTab === "accounts"
                                    ? "border-b-2 border-green-500 text-green-600"
                                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Created Accounts
                        </button>
                    </nav>
                </div>
                
                {/* Tab Content */}
                <div className="py-4">
                    {activeTab === "pending" && <PendingScholars />}
                    {activeTab === "accounts" && <CreatedAccounts />}
                </div>
            </div>
        </div>
    );
}