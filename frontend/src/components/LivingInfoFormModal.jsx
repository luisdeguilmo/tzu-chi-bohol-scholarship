import { useEffect, useState } from "react";
import InputModal from "./InputModal";
import { useSchoolTransportInfo } from "../hooks/useSchoolTransportInfo";
import { useAuth } from "../context/AuthContext";
import { useCoursesAccepted } from "../hooks/useCoursesAccepted";
import { useCollegesUniversities } from "../hooks/useCollegesUniversities";
import { numbersOnly } from "../utils/inputValidations";

function LivingInfoFormModal({ isOpen, onClose, label, isLoading, onRefresh }) {
    const [stayingArrangement, setStayingArrangement] = useState("");
    const [otherStayingArrangement, setOtherStayingArrangement] = useState("");
    const [address, setAddress] = useState("");
    const [dailyTransportCost, setDailyTransportCost] = useState("");
    const [routeAndCost, setRouteAndCost] = useState("");

    const { user } = useAuth();
    const { transportInfo, addTransportInfo } = useSchoolTransportInfo();

    const [university, setUniversity] = useState("");
    const [course, setCourse] = useState("");
    const [selectedCollegeOrUniversity, setSelectedCollegeOrUniversity] =
        useState(0);

    const { collegesAndUniversities } = useCollegesUniversities();
    const { coursesAccepted, fetchCoursesAccepted, resetCoursesAccepted } =
        useCoursesAccepted(selectedCollegeOrUniversity);

    useEffect(() => {
        if (selectedCollegeOrUniversity > 0) {
            fetchCoursesAccepted();
        }
    }, [selectedCollegeOrUniversity]);

    useEffect(() => {
        setStayingArrangement(transportInfo?.stay_type || "");
        setAddress(transportInfo?.address || "");
        setDailyTransportCost(transportInfo?.daily_transport_cost || "");
        setRouteAndCost(transportInfo?.route_explanation || "");
    }, [transportInfo]);

    const resetFields = () => {
        setUniversity("");
        setCourse("");
        setStayingArrangement("");
        setOtherStayingArrangement("");
        setAddress("");
        setRouteAndCost("");
        setDailyTransportCost("");
    };

    const handleCancel = (e) => {
        e.preventDefault();
        onClose(false);
    };

    const handleSubmit = async () => {
        const success = await addTransportInfo(
            user?.scholar_type,
            university,
            course,
            stayingArrangement,
            address,
            dailyTransportCost,
            routeAndCost,
        );

        if (success) {
            onClose(false);
            onRefresh?.();
        }
    };

    return (
        <InputModal
            label={label}
            isOpen={isOpen}
            resetFields={resetFields}
            onClose={onClose}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            buttonLabel={"Submit"}
            isLoading={isLoading}
            // isScholar={true}
        >
            <div className="py-4 px-6 max-h-[500px]">
                {user?.scholar_type === "New" && (
                    <>
                        <div className="block w-full relative">
                            <h2 className="mt-2 mb-3 font-bold text-xs text-gray-700">
                                Scholar Academic Info
                            </h2>
                            <label className="block mb-1 text-gray-500 text-xs">
                                University/School
                            </label>
                            <select
                                value={university}
                                onChange={(e) => {
                                    setUniversity(e.target.value);
                                    setCourse("");

                                    const selectedOption =
                                        e.target.options[
                                            e.target.selectedIndex
                                        ];

                                    const id =
                                        selectedOption.getAttribute("data-id");

                                    setSelectedCollegeOrUniversity(id);
                                }}
                                className="w-full border text-gray-800 text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                            >
                                <option value={""} disabled={university !== ""}>
                                    -- Select --
                                </option>
                                {collegesAndUniversities.map((item, index) => (
                                    <option
                                        key={index}
                                        data-id={item.id}
                                        value={item.name}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="block w-full relative pt-4">
                            <label className="block mb-1 text-gray-500 text-xs">
                                Course
                            </label>
                            <select
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                className="w-full border text-gray-800 text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                            >
                                <option value={""} disabled={course !== ""}>
                                    -- Select --
                                </option>
                                {coursesAccepted.map((item, index) => (
                                    <option
                                        key={index}
                                        data-id={item.id}
                                        value={item.course}
                                    >
                                        {item.course}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                <div
                    className={`block w-full relative ${user?.scholar_type === "New" ? "pt-4" : ""}`}
                >
                    <h2 className="mt-2 mb-3 font-bold text-xs text-gray-700">
                        Living Situation
                    </h2>
                    <label className="block mb-2 text-gray-500 text-xs font-medium">
                        Where do you stay during the school term?
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center text-xs text-gray-600">
                            <input
                                type="radio"
                                name="stayingArrangement"
                                value="At home"
                                checked={stayingArrangement === "At home"}
                                onChange={(e) =>
                                    setStayingArrangement(e.target.value)
                                }
                                className="mr-2 accent-green-600"
                                required
                            />
                            At home
                        </label>
                        <label className="flex items-center text-xs text-gray-600">
                            <input
                                type="radio"
                                name="stayingArrangement"
                                value="In a boarding house"
                                checked={
                                    stayingArrangement === "In a boarding house"
                                }
                                onChange={(e) =>
                                    setStayingArrangement(e.target.value)
                                }
                                className="mr-2 accent-green-600"
                                required
                            />
                            In a boarding house
                        </label>
                        <label className="flex items-center text-xs text-gray-600">
                            <input
                                type="radio"
                                name="stayingArrangement"
                                value="With relatives or friends near the school"
                                checked={
                                    stayingArrangement ===
                                    "With relatives or friends near the school"
                                }
                                onChange={(e) =>
                                    setStayingArrangement(e.target.value)
                                }
                                className="mr-2 accent-green-600"
                                required
                            />
                            With relatives or friends near the school
                        </label>
                        <label className="flex items-center text-xs text-gray-600">
                            <input
                                type="radio"
                                name="stayingArrangement"
                                value="Others"
                                checked={stayingArrangement === "Others"}
                                onChange={(e) =>
                                    setStayingArrangement(e.target.value)
                                }
                                className="mr-2 accent-green-600"
                                required
                            />
                            Others:
                        </label>
                        {stayingArrangement === "Others" && (
                            <div className="flex">
                                <div className="w-[5%]"></div>
                                <input
                                    type="text"
                                    value={otherStayingArrangement}
                                    onChange={(e) =>
                                        setOtherStayingArrangement(
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Please specify"
                                    className="w-[95%] mr-auto border text-xs border-gray-300 rounded-md px-2 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {stayingArrangement !== "At home" && (
                    <div className="block w-full relative pt-4">
                        <label className="block mb-1 text-gray-500 text-xs">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={address}
                            placeholder="Complete address"
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
                            required
                        />
                    </div>
                )}

                {/* Estimated daily transport cost */}
                {(stayingArrangement === "At home" ||
                    stayingArrangement === "Others") && (
                    <div className="block w-full relative pt-4">
                        <label className="block mb-1 text-gray-500 text-xs">
                            Estimated daily transport cost (₱)
                        </label>
                        <input
                            type="text"
                            name="dailyTransportCost"
                            min={0}
                            value={dailyTransportCost}
                            placeholder="Daily transport cost"
                            onChange={(e) => {
                                const value = numbersOnly(e.target.value);
                                setDailyTransportCost(value);
                            }}
                            className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
                            required
                        />
                    </div>
                )}

                <div className="block w-full relative pt-4">
                    <h2 className="mt-2 mb-3 font-bold text-xs text-gray-700">
                        Transport Details
                    </h2>
                    <label className="block mb-1 text-gray-500 text-xs">
                        Travel Route & Cost
                    </label>
                    <textarea
                        rows={5}
                        value={routeAndCost}
                        onChange={(e) => setRouteAndCost(e.target.value)}
                        placeholder="(e.g., Loon → Tagbilaran = ₱50)"
                        className="w-full border resize-none text-xs border-gray-300 rounded-md px-2 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    ></textarea>
                </div>

                {/* You can update it anytime in your Profile */}

                <div className="py-4">
                    <p className="text-xs italic">
                        Tip:{" "}
                        <span className="text-gray-600">
                            This information is required before allowance
                            release.
                        </span>
                    </p>
                </div>
            </div>
        </InputModal>
    );
}

export default LivingInfoFormModal;
