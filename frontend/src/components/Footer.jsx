import Logo from "/src/assets/tzu_chi_logo.png";

function Footer() {
    return (
        <footer className="mt-auto bg-gray-300 opacity-80 text-gray-900 pt-4 flex flex-col items-center gap-10 justify-center">
            <div className="w-[80%]">
                <div className="flex items-center w-fit mx-auto">
                    <img className="w-12" src={Logo} alt="Tzu Chi Logo" />
                    <div>
                        <h2 className="ml-2 text-xl font-bold">
                            Tzu Chi Bohol
                        </h2>
                    </div>
                </div>
                <p className="text-center text-sm text-gray-700">
                    The hope of parents are with children and children's hopes
                    are in education.
                </p>
            </div>
            <div className="w-[80%]">
                <div className="text-center">
                    <h4 className="text-lg pt-4 pb-1 font-semibold">
                        Contact Us
                    </h4>
                    <ul className="flex flex-col items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                            {/* <span className="material-symbols-outlined">
                                call
                            </span> */}
                            0998 885 5342
                        </li>
                        <li className="flex items-center gap-2">
                            {/* <span className="material-symbols-outlined">
                                mail
                            </span> */}
                            tzuchibohol2014@gmail.com
                        </li>
                        <li className="flex items-center gap-2">
                            {/* <span className="material-symbols-outlined">
                                location_on
                            </span> */}
                            3rd Floor of FCB Building, CPG North Avenue, Cogon
                            District, Tagbilaran City, Philippines
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-center text-lg font-semibold pt-4 pb-1">
                        Follow Us
                    </h4>
                    <div className="flex justify-center items-center gap-4">
                        <a
                            href="https://www.facebook.com/tzuchibohol.org.ph"
                            target="_blank"
                            className="text-blue-500 hover:text-green-600 transition-colors duration-200"
                        >
                            {/* <i className="fa-brands fa-facebook text-2xl"></i> */}
                            <div className="p-1 rounded-sm bg-blue-800 w-[max-content]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 32 32"
                                    fill="currentColor"
                                    className="text-white"
                                >
                                    <path d="M19 6h5V0h-5c-5.523 0-10 4.477-10 10v4H4v6h5v12h6V20h5l1-6h-6v-4c0-1.103.897-2 2-2z" />
                                </svg>
                            </div>
                        </a>
                        <a
                            href="https://www.instagram.com/tzuchibohol2013"
                            target="_blank"
                            className="text-gray-600 hover:text-green-700 transition-colors duration-200"
                        >
                            {/* <i className="fa-brands fa-instagram text-2xl"></i> */}

                            <div className="p-1 rounded-sm bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 w-[max-content]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="text-white"
                                >
                                    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                                </svg>
                            </div>
                        </a>
                        <a
                            href="https://www.youtube.com/@tzuchiboholchannel2110"
                            target="_blank"
                            className="text-red-500 hover:text-green-600 transition-colors duration-200"
                        >
                            <div className="p-1 rounded-sm bg-red-800 w-[max-content]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="text-white"
                                >
                                    <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.4.6A3 3 0 00.5 6.2 31.7 31.7 0 000 12a31.7 31.7 0 00.5 5.8 3 3 0 002.1 2.1c2 .6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 002.1-2.1A31.7 31.7 0 0024 12a31.7 31.7 0 00-.5-5.8zM9.75 15.5v-7l6 3.5-6 3.5z" />
                                </svg>
                            </div>

                            {/* <i className="fa-brands fa-youtube text-2xl"></i> */}
                        </a>
                    </div>
                </div>
            </div>
            <div className="border-t-[1px] border-gray-400 h-1 w-[90%]"></div>
            <div>
                <p className="pb-10 text-xs md:text-sm">
                    &copy; {new Date().getFullYear()} Tzu Chi Foundation Bohol.
                    All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
