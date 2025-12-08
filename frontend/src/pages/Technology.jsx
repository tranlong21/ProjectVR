import React, { useRef, useEffect } from "react";
import PageBanner from "../components/PageBanner";
import { useTranslation } from "react-i18next";

const Technology = () => {
    const { t } = useTranslation();

    // === Lấy JSON sections ===
    const raw = t("technology.sections", { returnObjects: true });
    const keys = Object.keys(raw);

    // === Tạo danh sách card theo cặp _title + _desc ===
    const items = [];
    keys.forEach((key) => {
        if (key.endsWith("_title")) {
            const title = raw[key];
            const desc = raw[key.replace("_title", "_desc")] || "";
            items.push({ title, desc });
        }
    });

    // === DRAG-TO-SCROLL (NO INFINITE LOOP) ===
    const sliderRef = useRef(null);
    const dragging = useRef(false);
    const startX = useRef(0);
    const scrollStart = useRef(0);

    const startDrag = (e) => {
        dragging.current = true;
        startX.current = e.pageX;
        scrollStart.current = sliderRef.current.scrollLeft;
    };

    const stopDrag = () => {
        dragging.current = false;
    };

    const onDrag = (e) => {
        if (!dragging.current) return;
        const dx = e.pageX - startX.current;
        sliderRef.current.scrollLeft = scrollStart.current - dx;
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">

            <PageBanner
                title={t("technology.title")}
                subtitle={t("technology.subtitle")}
                backgroundImage="/assets/images/ar_marketing_demo.png"
            />

            <div className="max-w-7xl mx-auto py-20 px-6">

                {/* INTRO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-[#C084FC] to-[#8B5CF6] bg-clip-text text-transparent">
                            {t("technology.title")}
                        </h2>

                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                            {t("technology.description")}
                        </p>
                    </div>

                    <div className="relative w-full">
                        <div className="absolute inset-0 bg-[#8B5CF6] blur-[120px] opacity-20"></div>
                        <img
                            src="/assets/images/ar_marketing_demo.png"
                            className="relative z-10 rounded-xl w-full shadow-lg object-cover"
                            style={{ aspectRatio: "4 / 3" }}
                        />
                    </div>
                </div>

                {/* ===================================
                     HORIZONTAL DRAG-TO-SCROLL LIST
                   =================================== */}
                <style>{`
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                `}</style>

                <div className="relative w-full py-10 overflow-hidden select-none">
                    <div
                        ref={sliderRef}
                        className="
                            flex gap-10 px-10 overflow-x-scroll hide-scrollbar
                            cursor-grab active:cursor-grabbing
                        "
                        onMouseDown={startDrag}
                        onMouseUp={stopDrag}
                        onMouseLeave={stopDrag}
                        onMouseMove={onDrag}
                    >
                        {items.map((item, i) => (
                            <div
                                key={i}
                                className="
                                    min-w-[380px]
                                    max-w-[380px]
                                    bg-[var(--card-bg)]
                                    border border-[var(--border-color)]
                                    rounded-2xl p-8
                                    shadow-md
                                "
                            >
                                <h3 className="text-xl font-bold text-[var(--primary)]">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-3">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Technology;
