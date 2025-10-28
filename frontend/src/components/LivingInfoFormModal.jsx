import { useEffect, useState } from "react";
import InputModal from "./InputModal";

function LivingInfoFormModal({
    scholar,
    isOpen,
    onClose,
    label,
    isLoading,
    onUpdate,
    onRefresh,
    onRefreshAllowanceData,
}) {
    const [stayingArrangement, setStayingArrangement] = useState("");
    const [otherStayingArrangement, setOtherStayingArrangement] = useState("");
    const [address, setAddress] = useState("");
    const [distanceFromSchool, setDistanceFromSchool] = useState("");
    const [transportMode, setTransportMode] = useState("");
    const [otherTransportMode, setOtherTransportMode] = useState("");
    const [dailyTransportCost, setDailyTransportCost] = useState("");
    const [stayDurationFrom, setStayDurationFrom] = useState("");
    const [stayDurationTo, setStayDurationTo] = useState("");

    const resetFields = () => {
        setStayingArrangement("");
        setOtherStayingArrangement("");
        setAddress("");
        setDistanceFromSchool("");
        setTransportMode("");
        setOtherTransportMode("");
        setDailyTransportCost("");
        setStayDurationFrom("");
        setStayDurationTo("");
    };

    const handleCancel = (e) => {
        e.preventDefault();
        onClose(false);
    };

    const handleSubmit = async () => {
        const livingInfo = {
            stayingArrangement:
                stayingArrangement === "Others"
                    ? otherStayingArrangement
                    : stayingArrangement,
            address,
            distanceFromSchool,
            transportMode:
                transportMode === "Others" ? otherTransportMode : transportMode,
            dailyTransportCost,
            stayDurationFrom,
            stayDurationTo,
        };

        const success = await onUpdate(livingInfo);

        if (success) {
            onClose(false);
            onRefresh?.();
            onRefreshAllowanceData?.();
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
            buttonLabel={"Save"}
            isLoading={isLoading}
            isScholar={true}
        >
            <div className="pb-5">
                {/* Where do you stay during the school term? */}
                <div className="block w-full relative pt-4 px-6">
                    <label className="block mb-2 text-gray-600 text-xs font-medium">
                        Where do you stay during the school term?
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center text-xs text-gray-700">
                            <input
                                type="radio"
                                name="stayingArrangement"
                                value="At home"
                                checked={stayingArrangement === "At home"}
                                onChange={(e) =>
                                    setStayingArrangement(e.target.value)
                                }
                                className="mr-2 accent-green-600"
                            />
                            At home
                        </label>
                        <label className="flex items-center text-xs text-gray-700">
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
                            />
                            In a boarding house
                        </label>
                        <label className="flex items-center text-xs text-gray-700">
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
                            />
                            With relatives or friends near the school
                        </label>
                        <label className="flex items-center text-xs text-gray-700">
                            <input
                                type="radio"
                                name="stayingArrangement"
                                value="Others"
                                checked={stayingArrangement === "Others"}
                                onChange={(e) =>
                                    setStayingArrangement(e.target.value)
                                }
                                className="mr-2 accent-green-600"
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
                                            e.target.value
                                        )
                                    }
                                    placeholder="Please specify"
                                    className="w-[95%] mr-auto border text-xs border-gray-300 rounded-md px-2 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Address */}
                <div className="block w-full relative pt-4 px-6">
                    <label className="block mb-1 text-gray-600 text-xs">
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

                {/* Approximate distance from school */}
                {/* <div className="block w-full relative pt-4 px-6">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Approximate distance from school (km)
                    </label>
                    <input
                        type="number"
                        name="distanceFromSchool"
                        min={0}
                        step="0.1"
                        value={distanceFromSchool}
                        placeholder="Distance in kilometers"
                        onChange={(e) => setDistanceFromSchool(e.target.value)}
                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div> */}

                {/* Mode of transport */}

                {/* Estimated daily transport cost */}
                <div className="block w-full relative pt-4 px-6">
                    <label className="block mb-1 text-gray-600 text-xs">
                        Estimated daily transport cost (₱)
                    </label>
                    <input
                        type="number"
                        name="dailyTransportCost"
                        min={0}
                        value={dailyTransportCost}
                        placeholder="Daily transport cost"
                        onChange={(e) => setDailyTransportCost(e.target.value)}
                        className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="pt-4 px-6">
                    <p className="text-xs italic">
                        Tip:{" "}
                        <span className="text-gray-600">
                            This information is required before allowance
                            release. You can update it anytime in your Profile.
                        </span>
                    </p>
                </div>
            </div>
        </InputModal>
    );
}

export default LivingInfoFormModal;
