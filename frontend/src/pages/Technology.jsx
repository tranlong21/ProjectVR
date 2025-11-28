import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Globe, Eye, Zap } from 'lucide-react';
import PageBanner from '../components/PageBanner';

const Technology = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <PageBanner
                title={t('banners.technology.title')}
                subtitle={t('banners.technology.subtitle')}
                backgroundImage="/assets/images/ar_marketing_demo.png"
            />
            <div className="max-w-7xl mx-auto py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-[var(--accent-blue)]">Cutting-Edge VR Engine</h2>
                        <p className="text-lg text-gray-400">
                            Our platform utilizes the latest WebGL and WebXR technologies to deliver high-fidelity, low-latency virtual experiences directly in the browser. No app installation required.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center"><Zap className="text-yellow-400 mr-3" /> High Performance Rendering</li>
                            <li className="flex items-center"><Globe className="text-blue-400 mr-3" /> Cross-Platform Compatibility</li>
                            <li className="flex items-center"><Eye className="text-purple-400 mr-3" /> Eye-Tracking Support (Beta)</li>
                        </ul>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-[var(--accent-blue)] blur-[100px] opacity-20"></div>
                        <img src="/assets/images/ar_marketing_demo.png" alt="Tech" className="relative z-10 rounded-xl neon-border w-full" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: <Cpu size={48} />, title: "AI Integration", desc: "Automated scene understanding and description generation." },
                        { icon: <Globe size={48} />, title: "Cloud Streaming", desc: "Stream massive 3D models without lag." },
                        { icon: <Eye size={48} />, title: "Immersive Audio", desc: "Spatial audio for realistic environmental sound." },
                        { icon: <Zap size={48} />, title: "Real-time Sync", desc: "Multi-user collaboration in virtual spaces." }
                    ].map((item, idx) => (
                        <div key={idx} className="glass-panel p-6 rounded-xl text-center hover:-translate-y-2 transition-transform">
                            <div className="text-[var(--accent-purple)] flex justify-center mb-4">{item.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Technology;
