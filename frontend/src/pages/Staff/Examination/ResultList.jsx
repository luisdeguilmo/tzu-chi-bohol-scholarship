import { Upload } from "lucide-react";
import { formatDateTime } from "../../../utils/formatDateTime";
import { useState } from "react";
import { TableButtonAction } from "../../../components/TableButtonAction";

export const ResultList = ({
    item,
    index,
    tableHeaders,
    profilePics,
    onOpenModal,
}) => {
    return (
        <div className="p-4 border rounded-md bg-gray-50">
            <div className="mb-2 font-normal text-gray-600">
                <div className="w-[max-content] flex items-center text-left gap-2">
                    <img
                        src={profilePics[item.application_id]}
                        alt="Profile"
                        className="w-10 h-10 object-cover rounded-full mx-auto"
                    />
                    <div>
                        <p className="font-bold text-xs">
                            {item.first_name + " " + item.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{item.email}</p>
                    </div>
                </div>
            </div>
            <div key={index} className="flex gap-6 ">
                <div className="space-y-2">
                    {tableHeaders
                        .filter((item) => item.name !== "Applicant")
                        .map((header, index) => (
                            <p
                                key={index}
                                className="text-xs font-bold text-gray-800"
                            >
                                {header.name}
                            </p>
                        ))}
                </div>
                <div className="text-xs space-y-2">
                    <p className="font-normal text-gray-600">
                        {item.application_id}
                    </p>
                    <p className="font-normal text-gray-600">{item.batch}</p>
                    <p className="font-normal text-gray-600">
                        {formatDateTime(item.schedule) || "Not Set"}
                    </p>
                    <p className="font-normal text-gray-600">
                        {item.score || "--"}
                    </p>
                    <p className="font-normal text-gray-600">
                        <span
                            className={`inline-flex items-center px-2.5 rounded-lg font-medium
                     ${
                         item.is_examination_passed
                             ? "bg-green-100 text-green-800"
                             : item.is_examination_failed
                               ? "bg-red-100 text-red-800"
                               : "bg-yellow-100 text-yellow-800"
                     }`}
                        >
                            {item.is_examination_passed
                                ? "Passed"
                                : item.is_examination_failed
                                  ? "Failed"
                                  : "Pending"}
                        </span>
                    </p>

                    <TableButtonAction
                        onClick={() => onOpenModal(item.application_id)}
                        button={{
                            title: "Upload Document",
                            icon: <Upload className="w-4 h-4" />,
                            color: "blue",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
