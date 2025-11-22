import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function AboutSection() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scrolls to the top-left corner of the document
        window.scrollTo(0, 0);
    }, [pathname]);

    const sections = [
        {
            id: 1,
            title: "This is Tzu Chi",
            sub_title: "Jing Si Abode, Hualien, Taiwan",
            image: "/src/assets/this_is_tzu_chi.jpg",
            text1: 'Tzu Chi Foundation is a non-profit organization founded in 1966 by Dharma Master Cheng Yen in the impoverished east coast of Taiwan. The Foundation has been contributing to better social and community services, medical care, education and humanism in Taiwan for 58 years now. Master Cheng Yen firmly believes that suffering in this world is caused by material deprivation and spiritual poverty. She felt that "lack of love for others" has been the root of many problems in this world. "To save the world, we must begin by transforming human hearts."',
            text2: "A volunteer-based, spiritual as well as welfare organization, Tzu Chi's missions focus on giving material aid and inspiring love and humanity in both the givers and receivers. Since its founding, Tzu Chi has dedicated itself in the fields of charity, medicine, education, environmental protection, as well as the promotion of humanistic values and community volunteerism. The humanitarian work is both a means to help those in need and a way to open the eyes of the volunteers to the harsher side of life, so that through giving, they may find spiritual happiness and life's true meaning.",
            text3: "A home-grown Taiwanese organization, Tzu Chi volunteers living abroad began setting up overseas chapters in 1985. They used money that they have earned in their country of residence to help the poor and needy in their local communities.",
            text4: "In addition to material aid, Tzu Chi has also encouraged mutual help among disaster victims and helped them to become independent by involving them in rebuilding their own communities. The ultimate goal is to inspire disaster victims to contribute to others in turn when they have the ability to do so, thus creating a global village of Great Love.",
            quote: "If everyone exercises the love in their heart, then goodness and blessings will accumulate, creating a cycle of kindness.",
            author: "Master Cheng Yen",
        },
        {
            id: 2,
            title: "Our Founder",
            sub_title: "Dharma Master Cheng Yen",
            sub_title2: "Founder, Buddhist Tzu Chi Foundation",
            image: "/src/assets/our_founder.jpg",
            text1: "Dharma Master Cheng Yen was born in 1937 in a small town in Taichung County, Taiwan. When she was twenty-three years old, she left home to become a Buddhist nun and was instructed by her mentor, Venerable Master Yin Shun, to work for Buddha's teachings, for sentient beings.",
            text2: 'In 1966, she founded a charity organization, which later became the Buddhist Tzu Chi Foundation. Its purpose was "to help the poor and educate the rich" - that is, to give material aid to the needy and inspire love and humanitarian spirit in both the giver and the receiver.',
            text3: "In recent years, Master Cheng Yen's contributions have been increasingly recognized by the global community.",
            text4: "In 1991, she received the Ramon Magsaysay Social Leadership Award. In 2011, she was conferred the Roosevelt Institute's FDR Distinguished Public Service Award and was named one of the world's 100 most influential people by TIME Magazine.",
            text5: "In 2014, she was presented with the Rotary International Award of Honor in recognition of her humanitarian efforts and contributions to world peace.",
            text6: "In 2022, Master Cheng Yen was named one of the top 100 women in the world by the BBC, and became a fellow of the National Academy of Investors.",
            quote: "Misfortunes in the world have the power to inspire compassion. An act of giving has the power to touch our heart.",
            author: "Master Cheng Yen",
        },
        {
            id: 3,
            title: "Tzu Chi Bohol",
            sub_title: "Bohol, Philippines",
            image: "/src/assets/tzu_chi_bohol.jpg",
            text1: '"Keep up with our commitment to help Bohol."',
            text2: "Dharma Master Cheng Yen said these words after Tzu Chi volunteers went on to respond to the devastations caused by Super Typhoon Haiyan, which struck the Philippines on November 8, 2013. This powerful typhoon, the most destructive of all time, happened shortly after the 7.2 magnitude earthquake that devastated Bohol on October 15, 2013.",
            text3: "Tzu Chi volunteers were already holding relief operations for the earthquake survivors in Bohol when it was suddenly put on hold to address a disaster of a much larger scale. Having swiftly mobilized its resources and concluded the emergency relief operations in the province of Leyte, Tzu Chi volunteers returned to Taiwan to provide updates to the head office. It was during this time when Master Cheng Yen gently reminded the volunteers to keep up with Tzu Chi's commitment to help Bohol. Her words led Tzu Chi to continue its relief and rehabilitation projects in Bohol, which include donating prefabricated classrooms and shelters, conducting more relief aid distributions, Jing Si books distributions, and medical missions.",
            text4: "Over time, more Boholanos joined the volunteer ranks, and on December 12, 2014, the Tzu Chi Foundation Philippines officially opened its Bohol Operations Office.",
            text5: "The work continues to this day. As the Tzu Chi Foundation goes far and wide to spread the seeds of love, the Boholanos are empowered to create positive change within their community through volunteerism.",
            quote: "Compassion is not only expressed through words; it is to be realized through service to humanity.",
            author: "Master Cheng Yen",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="w-[95%] md:w-[80%] mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        About Tzu Chi
                    </h1>
                </div>

                <div className="space-y-24">
                    {sections.map((section, index) => (
                        <div
                            key={section.id}
                            className={`flex flex-col ${
                                index % 2 === 0
                                    ? "lg:flex-row"
                                    : "lg:flex-row-reverse"
                            } gap-8 lg:gap-12 items-center`}
                        >
                            <div className="w-full lg:w-1/2">
                                <h2 className="title text-center italic text-4xl font-bold text-slate-900 mb-4">
                                    {section.title}
                                </h2>
                                <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                                    <img
                                        src={section.image}
                                        alt={section.title}
                                        className={`w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500`}
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="mt-2 text-center">
                                    <h3 className="font-bold">
                                        {section?.sub_title}
                                    </h3>
                                    <h4 className="text-sm">
                                        {section?.sub_title2}
                                    </h4>
                                </div>
                                <div className="mx-auto">
                                    <div class="quote">{section.quote}</div>

                                    <div class="author">— {section.author}</div>
                                </div>
                            </div>

                            <div className="w-full lg:w-1/2 space-y-6">
                                <div>
                                    {/* <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
                                        {`0${section.id}`}
                                    </div> */}
                                    {/* <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                        {section.title}
                                    </h2> */}
                                </div>
                                <p className="text-sm text-slate-700 text-justify leading-relaxed">
                                    {section?.text1}
                                </p>
                                <p className="text-sm text-slate-700 text-justify leading-relaxed">
                                    {section?.text2}
                                </p>
                                <p className="text-sm text-slate-700 text-justify leading-relaxed">
                                    {section?.text3}
                                </p>
                                <p className="text-sm text-slate-700 text-justify leading-relaxed">
                                    {section?.text4}
                                </p>
                                <p className="text-sm text-slate-700 text-justify leading-relaxed">
                                    {section?.text5}
                                </p>
                                <p className="text-sm text-slate-700 text-justify leading-relaxed">
                                    {section?.text6}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
