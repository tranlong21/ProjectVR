import React from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Box, Monitor, Layers, Factory, Map } from 'lucide-react';

const ServicesSection = () => {
    const { t } = useTranslation();

    const services = [
        { icon: <Camera size={32} />, title: "VR360 Photography", desc: "High-resolution 360 panoramas for real estate and tourism." },
        { icon: <Box size={32} />, title: "AR 3D Modeling", desc: "Interactive 3D models for e-commerce and education." },
        { icon: <Monitor size={32} />, title: "Virtual Showroom", desc: "Digital spaces to showcase your products globally." },
        { icon: <Layers size={32} />, title: "Digital Twin", desc: "Exact digital replicas of physical assets for management." },
        { icon: <Factory size={32} />, title: "360 Factory Tour", desc: "Remote inspections and tours of industrial facilities." },
        { icon: <Map size={32} />, title: "Interactive Mapping", desc: "Custom maps with integrated VR hotspots." },
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-[var(--bg-primary)]">
            {/* Background Elements */}
            <div className="absolute top-40 left-0 w-96 h-96 bg-[var(--accent-purple)] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
                        {t('nav.services') || "Our Services"}
                    </h2>
                    <div className="h-1 w-24 bg-[var(--accent-purple)] mx-auto rounded mb-6"></div>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
                        Comprehensive VR/AR solutions tailored to elevate your business into the metaverse.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="glass-panel p-8 rounded-2xl hover:bg-[var(--accent-purple)]/5 transition-all duration-300 group hover:-translate-y-2 border border-[var(--border-color)] hover:border-[var(--accent-purple)]/50"
                        >
                            <div className="w-16 h-16 rounded-xl bg-[var(--accent-purple)]/10 flex items-center justify-center text-[var(--accent-purple)] mb-6 group-hover:scale-110 group-hover:bg-[var(--accent-purple)] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-[var(--text-primary)] group-hover:text-[var(--accent-purple)] transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed group-hover:text-[var(--text-primary)] transition-colors">
                                {service.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
