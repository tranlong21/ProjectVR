import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PageBanner from "../components/PageBanner";

const Solutions = () => {
    const { t } = useTranslation();

    const panels = [
        { key: "real_estate", img: "/assets/images/virtual_showroom_project.png" },
        { key: "tourism", img: "/assets/images/tourism_360_tour.png" },
        { key: "culture", img: "/assets/images/vr_hero_banner.png" },
        { key: "education", img: "/assets/images/vr_education_training.png" },
        { key: "historical_sites", img: "/assets/images/team_collaboration.png" },
        { key: "technology", img: "/assets/images/ar_marketing_demo.png" },
    ];

    // Horizontal scroll effect
    useEffect(() => {
        const wrapper = document.getElementById("solutions-wrapper");
        const track = document.getElementById("solutions-track");

        const handleScroll = () => {
            const rect = wrapper.getBoundingClientRect();
            const start = rect.top;
            const total = wrapper.offsetHeight - window.innerHeight;

            if (start > 0 || Math.abs(start) >= total) return;

            const progress = Math.abs(start) / total;
            const moveX = progress * -((panels.length - 1) * window.innerWidth);

            track.style.transform = `translateX(${moveX}px)`;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">

            {/* BANNER */}
            <PageBanner
                title={t("banners.solutions.title")}
                subtitle={t("banners.solutions.subtitle")}
                backgroundImage="/assets/images/tourism_360_tour.png"
            />

            {/* HORIZONTAL SCROLL SECTION */}
            <div id="solutions-wrapper" className="relative h-[650vh] w-full">

                <div className="sticky top-0 h-screen overflow-hidden bg-[var(--bg-primary)]">

                    <div
                        id="solutions-track"
                        className="flex h-full transition-transform duration-300 ease-out will-change-transform"
                        style={{ width: `${panels.length * 100}vw` }}
                    >

                        {panels.map((p, index) => (
                            <div
                                key={index}
                                className="w-screen h-screen flex items-center justify-center px-6 md:px-12"
                                style={{ background: "var(--bg-primary)" }}
                            >
                                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                                    {/* IMAGE */}
                                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-lg neon-border group">
                                        <img
                                            src={p.img}
                                            alt={t(`categories.${p.key}.title`)}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                            onError={(e) => (e.target.src = "/assets/images/vr_hero_banner.png")}
                                        />
                                    </div>

                                    {/* TEXT CONTENT */}
                                    <div className="space-y-6 text-center md:text-left">

                                        {/* TITLE */}
                                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#C084FC] to-[#8B5CF6] bg-clip-text text-transparent">
                                            {t(`categories.${p.key}.title`)}
                                        </h1>

                                        {/* SUBTITLE */}
                                        <p
                                            className="text-lg md:text-xl leading-relaxed font-semibold"
                                            style={{ color: "var(--text-primary)" }}
                                        >
                                            {t(`categories.${p.key}.subtitle`)}
                                        </p>

                                        {/* CONTENT */}
                                        <p
                                            className="text-base md:text-lg leading-relaxed"
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            {t(`categories.${p.key}.content`)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Solutions;
