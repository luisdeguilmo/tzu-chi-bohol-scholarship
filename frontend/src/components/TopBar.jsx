import Logo from "/src/assets/tzu_chi_logo.png";

function TopBar() {
    return (
        <div className="p-2 px-5 flex justify-between items-center bg-white border-b-[2px] border-gray-300">
            {/* <h1 className="w-full ml-[30px] text-gray-800 text-lg font-semibold">
                Dashboard
            </h1> */}
            <div className="flex justify-center items-center ml-7">
                <img
                    className="w-[70px] mx-auto"
                    src={Logo}
                    alt="Tzu Chi Logo"
                />
                <div className="flex flex-col p-1 ml-[-6px]">
                    <h2 className="text-[14px] font-bold whitespace-nowrap">
                        Tzu Chi Foundation
                    </h2>
                    <p className="mt-[-4px] text-[10px] whitespace-nowrap">
                        Information Management System
                    </p>
                </div>
            </div>
            <div>
                <div className="px-3 py-1 rounded-full inline-block bg-blue-700 text-white text-center">
                    L
                </div>
            </div>
        </div>
    );
}

export default TopBar;
