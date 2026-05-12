import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function OurMission() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scrolls to the top-left corner of the document
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="w-[95%] md:w-[80%] mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Our Mission
                    </h1>
                </div>

                <p className="text-[15px] text-slate-700 text-justify leading-relaxed">
                    Master Cheng Yen encourages a holistic approach to
                    education, emphasizing character development, life skills,
                    and personal growth. Tzu Chi's Mission of Education extends
                    beyond academic excellence, fostering values like
                    volunteerism, leadership, and community engagement.
                    Additionally, by inspiring educators, Tzu Chi aims to
                    cultivate a generation of compassionate and responsible
                    individuals. In Bohol, Tzu Chi Foundation provides
                    scholarships to deserving students from low- income
                    families. This support not only helps cover tuition fees but
                    also provides living allowances, enabling students to pursue
                    their higher education dreams. To complement academic
                    pursuits, Tzu Chi organizes Humanity Classes, where scholars
                    learn the teachings of Master Cheng Yen, fostering a sense
                    of empathy and social responsibility.
                </p>

                <div className="w-[90%] md:w-[60%] mx-auto">
                    <div className="quote">
                        “The hope of society lies in its talented human
                        resources; <br />
                        while the hope of these talents comes from education.”
                    </div>

                    <div class="author">— Master Cheng Yen</div>
                </div>

                <div className="mt-10">
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                        <img
                            src={"/src/assets/img.jpg"}
                            alt={"Mission of Education"}
                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}
