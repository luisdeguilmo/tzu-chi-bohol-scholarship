import Logo from "/src/assets/tzu_chi_logo.png";

function Footer() {
    return (
        <footer className="mt-auto bg-slate-800 opacity-80 text-white pt-6 flex flex-col items-center gap-10 justify-center">
            <div className="w-[80%]">
                <div className="flex items-center w-fit mx-auto">
                    <img className="w-12" src={Logo} alt="Tzu Chi Logo" />
                    <div>
                        <h2 className="text-2xl font-bold">Tzu Chi Foundation Bohol</h2>
                    </div>
                </div>
                <p className="text-center text-gray-300">
                    The hope of parents are with children and children's hopes
                    are in education.
                </p>
            </div>
            <div className="w-[80%]">
                <div className="text-center">
                    <h4 className="text-lg pt-4 pb-1 font-semibold">Contact Us</h4>
                    <ul className="flex flex-col items-center text-gray-300">
                        <li className="flex items-center gap-2 text">
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
                    <h4 className="text-center text-lg font-semibold pt-4 pb-1">Follow Us</h4>
                    <ul className="flex justify-center gap-6">
                        <li>
                            <a
                                href="https://www.facebook.com/tzuchibohol.org.ph"
                                target="_blank"
                            >
                                <img
                                    className="w-8"
                                    src="/src/assets/facebook.png"
                                    alt="Facebook Icon"
                                />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.instagram.com/tzuchibohol2013/?fbclid=IwY2xjawIqbTxleHRuA2FlbQIxMAABHdBtk3mAia8l7A7dTY5JPd-Q4Tz8rne4iQirBDDzXiTd98a_ngg2Fx2W4g_aem_77HhzEZMgnfAcuF8zZ0WVQ#"
                                target="_blank"
                            >
                                <img
                                    className="w-8"
                                    src="/src/assets/instagram.png"
                                    alt="Instagram Icon"
                                />
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.instagram.com/tzuchibohol2013/?fbclid=IwY2xjawIqbTxleHRuA2FlbQIxMAABHdBtk3mAia8l7A7dTY5JPd-Q4Tz8rne4iQirBDDzXiTd98a_ngg2Fx2W4g_aem_77HhzEZMgnfAcuF8zZ0WVQ#"
                                target="_blank"
                            >
                                <img
                                    className="w-8"
                                    src="/src/assets/youtube.png"
                                    alt="Youtube Icon"
                                />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t-[1px] h-1 w-[90%]"></div>
            <div>
                <p className="pb-8">
                    &copy; {new Date().getFullYear()} Tzu Chi Foundation Bohol. All
                    Rights Reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;