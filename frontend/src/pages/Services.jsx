import React from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Box, Monitor, Layers, Factory, Map } from 'lucide-react';
import PageBanner from '../components/PageBanner';

const Services = () => {
    const { t } = useTranslation();

    const services = [
        { icon: <Camera size={40} />, title: "VR360 Photography", desc: "High-resolution 360 panoramas for real estate and tourism." },
        { icon: <Box size={40} />, title: "AR 3D Modeling", desc: "Interactive 3D models for e-commerce and education." },
        { icon: <Monitor size={40} />, title: "Virtual Showroom", desc: "Digital spaces to showcase your products globally." },
        { icon: <Layers size={40} />, title: "Digital Twin", desc: "Exact digital replicas of physical assets for management." },
        { icon: <Factory size={40} />, title: "360 Factory Tour", desc: "Remote inspections and tours of industrial facilities." },
        { icon: <Map size={40} />, title: "Interactive Mapping", desc: "Custom maps with integrated VR hotspots." },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <PageBanner
                title={t('banners.services.title')}
                subtitle={t('banners.services.subtitle')}
                backgroundImage="/assets/images/virtual_showroom_project.png"
            />
            <div className="max-w-7xl mx-auto py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="glass-panel p-8 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="text-[var(--accent-blue)] mb-6 group-hover:scale-110 transition-transform duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3 group-hover:text-[var(--accent-cyan)] transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-400">
                                {service.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
