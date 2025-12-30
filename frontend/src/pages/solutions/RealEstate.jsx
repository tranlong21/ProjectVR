import React from 'react';
import Viewer360 from '../../components/Viewer360';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    CheckCircle,
    Building2,
    Globe,
    Camera,
    Users,
    Cpu,
    Zap,
    Layers
} from 'lucide-react';

const RealEstate = () => {

    const scenes = [
        {
            id: 'real-estate-main',
            name: 'Không gian Bất động sản',
            panoramaUrl: '/assets/images/NuThanTudo.jpg',
            hotspots: []
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans">

            {/* ===== HEADER ===== */}
            <section className="pt-24 pb-12 text-center px-4">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-purple)] to-purple-400">
                        VR 360
                    </span>{' '}
                    cho Bất Động Sản
                </h1>
                <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto">
                    Giải pháp tham quan bất động sản từ xa – trực quan – hiệu quả cho nhà ở, dự án và đô thị
                </p>
            </section>

            {/* ===== VIEWER 360 ===== */}
            <section className="max-w-7xl mx-auto px-4 mb-14">
                <div className="glass-panel p-2 rounded-2xl border border-[var(--border-color)] shadow-2xl relative">

                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-white text-xs flex items-center gap-2 border border-white/10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Virtual Real Estate Tour
                    </div>

                    <div className="h-[50vh] md:h-[70vh] rounded-xl overflow-hidden border border-[var(--border-color)] bg-black">
                        <Viewer360
                            scenes={scenes}
                            initialSceneId="real-estate-main"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 text-lg font-medium text-[var(--accent-purple)] hover:text-purple-400 transition-colors"
                    >
                        👉 Xem dự án bất động sản VR
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* ===== MAIN CONTENT ===== */}
            <article className="max-w-4xl mx-auto px-4 pb-32 space-y-20">

                {/* INTRO */}
                <section>
                    <p className="text-lg leading-relaxed text-[var(--text-secondary)] first-letter:text-5xl first-letter:font-bold first-letter:text-[var(--accent-purple)] first-letter:mr-1 first-letter:float-left">
                        Thị trường bất động sản đang thay đổi mạnh mẽ dưới tác động của công nghệ số.
                        VR 360 cho phép khách hàng tham quan nhà ở, căn hộ, khu đô thị và dự án
                        một cách chân thực như đang có mặt tại hiện trường,
                        giúp tiết kiệm thời gian, tăng tỷ lệ chuyển đổi và nâng cao trải nghiệm mua bán.
                    </p>
                </section>

                {/* IMAGE: SMART REAL ESTATE */}
                <figure className="rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-lg">
                    <img
                        src="/assets/images/real-estate/real-estate.jpg"
                        alt="Smart Real Estate Concept"
                        className="w-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <figcaption className="text-center text-sm text-[var(--text-secondary)] italic p-2">
                        Bất động sản số – kết hợp công nghệ và trải nghiệm khách hàng
                    </figcaption>
                </figure>

                {/* WHY VR FOR REAL ESTATE */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-[var(--accent-purple)]" />
                        Vì sao bất động sản cần VR 360?
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="glass-panel p-6 rounded-xl border-l-4 border-[var(--accent-purple)]">
                            <h3 className="font-bold text-lg mb-2">Xem nhà từ xa</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Khách hàng có thể tham quan căn hộ, nhà mẫu
                                mà không cần di chuyển, phù hợp với khách ở xa.
                            </p>
                        </div>

                        <div className="glass-panel p-6 rounded-xl border-l-4 border-pink-500">
                            <h3 className="font-bold text-lg mb-2">Tăng tỷ lệ chốt sale</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Trải nghiệm trực quan giúp khách hàng
                                hiểu rõ không gian và dễ đưa ra quyết định mua.
                            </p>
                        </div>
                    </div>
                </section>

                {/* IMAGE: INTERIOR */}
                <section className="space-y-4">
                    <img
                        src="/assets/images/real-estate/real-estate1.jpg"
                        alt="Interior VR Tour"
                        className="w-full rounded-2xl shadow-lg border border-[var(--border-color)]"
                    />
                    <p className="text-[var(--text-secondary)]">
                        Không gian nội thất được thể hiện rõ ràng về bố cục,
                        ánh sáng, vật liệu và phong cách thiết kế,
                        giúp khách hàng hình dung chính xác căn nhà tương lai.
                    </p>
                </section>

                {/* USE CASES */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Layers className="w-8 h-8 text-[var(--accent-purple)]" />
                        Ứng dụng VR 360 trong bất động sản
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            {
                                icon: Globe,
                                title: 'Tour dự án từ xa',
                                desc: 'Khám phá toàn cảnh khu đô thị, phân khu, tiện ích.'
                            },
                            {
                                icon: Camera,
                                title: 'Nhà mẫu ảo',
                                desc: 'Tham quan căn hộ, biệt thự với bố cục thực tế.'
                            },
                            {
                                icon: Users,
                                title: 'Hỗ trợ sale',
                                desc: 'Tư vấn khách hàng trực tuyến hiệu quả.'
                            },
                            {
                                icon: Zap,
                                title: 'Marketing dự án',
                                desc: 'Tăng sự khác biệt và chuyên nghiệp khi quảng bá.'
                            }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border-color)] hover:border-[var(--accent-purple)] transition-colors"
                            >
                                <item.icon className="w-8 h-8 text-[var(--accent-purple)] mb-3" />
                                <h4 className="font-bold mb-1">{item.title}</h4>
                                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* IMAGE: CITY VIEW */}
                <section className="space-y-4">
                    <img
                        src="/assets/images/real-estate/real-estate2.jpg"
                        alt="Urban Real Estate"
                        className="w-full rounded-2xl shadow-lg border border-[var(--border-color)]"
                    />
                    <p className="text-[var(--text-secondary)]">
                        VR 360 giúp thể hiện tầm nhìn tổng thể của dự án trong không gian đô thị,
                        kết nối vị trí, hạ tầng và tiện ích xung quanh.
                    </p>
                </section>

                {/* TECH STACK */}
                <section className="bg-[var(--muted)]/30 p-8 rounded-3xl border border-[var(--border-color)]">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Cpu className="text-[var(--accent-purple)]" />
                        Công nghệ nền tảng
                    </h2>

                    <ul className="space-y-3">
                        {[
                            'WebXR – chạy trực tiếp trên trình duyệt',
                            'Pannellum + Three.js + React',
                            'Không cần cài ứng dụng',
                            'Tối ưu cho PC, Mobile và Tablet'
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* CTA */}
                <section className="text-center pt-12 border-t border-[var(--border-color)]">
                    <h2 className="text-3xl font-bold mb-6">
                        Sẵn sàng số hóa dự án bất động sản?
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] mb-8">
                        VR 360 giúp chủ đầu tư và sàn giao dịch
                        tiếp cận khách hàng nhanh hơn và hiệu quả hơn.
                    </p>

                    <div className="flex justify-center">
                        <Link
                            to="/projects"
                            className="px-8 py-3 bg-[var(--accent-purple)] text-white rounded-full font-bold shadow-lg hover:shadow-[var(--accent-purple)]/40 transition-all"
                        >
                            Xem dự án bất động sản
                        </Link>
                    </div>
                </section>

            </article>
        </div>
    );
};

export default RealEstate;
