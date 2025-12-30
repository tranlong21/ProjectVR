import React from 'react';
import Viewer360 from '../../components/Viewer360';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    CheckCircle,
    Globe,
    Camera,
    Users,
    Map,
    Layers,
    Zap
} from 'lucide-react';

const Tourism = () => {

    const scenes = [
        {
            id: 'vietnam-tourism',
            name: 'Vietnam Virtual Tourism',
            panoramaUrl: '/assets/images/tourism.jpg',
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
                    cho Du Lịch
                </h1>
                <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto">
                    Giải pháp tham quan ảo – quảng bá điểm đến – chuyển đổi số du lịch Việt Nam
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
                        Vietnam Virtual Tour
                    </div>

                    <div className="h-[50vh] md:h-[70vh] rounded-xl overflow-hidden border border-[var(--border-color)] bg-black">
                        <Viewer360
                            scenes={scenes}
                            initialSceneId="vietnam-tourism"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 text-lg font-medium text-[var(--accent-purple)] hover:text-purple-400 transition-colors"
                    >
                        👉 Khám phá dự án VR du lịch
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* ===== MAIN CONTENT ===== */}
            <article className="max-w-4xl mx-auto px-4 pb-32 space-y-20">

                {/* INTRO */}
                <section>
                    <p className="text-lg leading-relaxed text-[var(--text-secondary)] first-letter:text-5xl first-letter:font-bold first-letter:text-[var(--accent-purple)] first-letter:mr-1 first-letter:float-left">
                        Du lịch không còn bắt đầu tại sân bay hay bến xe.
                        Với VR 360, hành trình khám phá Việt Nam bắt đầu ngay trên trình duyệt.
                        Du khách có thể “đứng giữa” vịnh biển, ruộng bậc thang,
                        hay phố cổ hàng trăm năm tuổi trước khi quyết định xách balo lên đường.
                    </p>
                </section>

                {/* IMAGE: OVERVIEW */}
                <figure className="rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-lg">
                    <img
                        src="/assets/images/tourism1.jpg"
                        alt="Vietnam Tourism Overview"
                        className="w-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <figcaption className="text-center text-sm text-[var(--text-secondary)] italic p-2">
                        Việt Nam – điểm đến đa dạng từ thiên nhiên, văn hóa đến đô thị hiện đại
                    </figcaption>
                </figure>

                {/* WHY VR FOR TOURISM */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Globe className="w-8 h-8 text-[var(--accent-purple)]" />
                        Vì sao du lịch cần VR 360?
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="glass-panel p-6 rounded-xl border-l-4 border-[var(--accent-purple)]">
                            <h3 className="font-bold text-lg mb-2">Xem trước – tin tưởng hơn</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Du khách được trải nghiệm thực tế không gian điểm đến,
                                giảm khoảng cách giữa quảng cáo và trải nghiệm thật.
                            </p>
                        </div>

                        <div className="glass-panel p-6 rounded-xl border-l-4 border-pink-500">
                            <h3 className="font-bold text-lg mb-2">Tăng tỷ lệ đặt tour</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Nội dung VR giữ chân người xem lâu hơn,
                                tăng khả năng ra quyết định đặt dịch vụ.
                            </p>
                        </div>
                    </div>
                </section>

                {/* IMAGE: HA LONG */}
                <section className="space-y-4">
                    <img
                        src="/assets/images/tourism2.jpg"
                        alt="Ha Long Bay"
                        className="w-full rounded-2xl shadow-lg border border-[var(--border-color)]"
                    />
                    <p className="text-[var(--text-secondary)]">
                        Vịnh Hạ Long – di sản thiên nhiên thế giới,
                        nơi hàng nghìn núi đá vôi trùng điệp nổi lên giữa làn nước xanh ngọc,
                        được tái hiện chân thực qua các tour VR 360 toàn cảnh.
                    </p>
                </section>

                {/* USE CASES */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Map className="w-8 h-8 text-[var(--accent-purple)]" />
                        Ứng dụng VR 360 trong du lịch
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            {
                                icon: Camera,
                                title: 'Tour điểm đến ảo',
                                desc: 'Tham quan danh lam thắng cảnh trước chuyến đi.'
                            },
                            {
                                icon: Users,
                                title: 'Quảng bá địa phương',
                                desc: 'Giới thiệu văn hóa – ẩm thực – con người bản địa.'
                            },
                            {
                                icon: Layers,
                                title: 'Kết hợp thông tin',
                                desc: 'Gắn video, thuyết minh, bản đồ vào từng điểm.'
                            },
                            {
                                icon: Zap,
                                title: 'Lan tỏa nhanh',
                                desc: 'Dễ dàng chia sẻ trên website và mạng xã hội.'
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

                {/* IMAGE: RICE TERRACES */}
                <section className="space-y-4">
                    <img
                        src="/assets/images/tourism3.jpg"
                        alt="Terraced Rice Fields"
                        className="w-full rounded-2xl shadow-lg border border-[var(--border-color)]"
                    />
                    <p className="text-[var(--text-secondary)]">
                        Ruộng bậc thang vùng cao Tây Bắc –
                        vẻ đẹp giao thoa giữa thiên nhiên và lao động con người,
                        mang lại cảm xúc mạnh mẽ khi được trải nghiệm trong không gian VR 360.
                    </p>
                </section>

                {/* TECH STACK */}
                <section className="bg-[var(--muted)]/30 p-8 rounded-3xl border border-[var(--border-color)]">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Zap className="text-[var(--accent-purple)]" />
                        Công nghệ triển khai
                    </h2>

                    <ul className="space-y-3">
                        {[
                            'Ảnh panorama 8K – 16K',
                            'WebXR – chạy trực tiếp trên trình duyệt',
                            'Tương thích PC, Mobile, VR Headset',
                            'Tối ưu tải nhanh cho khách quốc tế'
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
                        Sẵn sàng nâng tầm trải nghiệm du lịch?
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] mb-8">
                        VR 360 giúp điểm đến của bạn nổi bật,
                        thu hút du khách và dẫn đầu xu hướng du lịch số.
                    </p>

                    <div className="flex justify-center">
                        <Link
                            to="/projects"
                            className="px-8 py-3 bg-[var(--accent-purple)] text-white rounded-full font-bold shadow-lg hover:shadow-[var(--accent-purple)]/40 transition-all"
                        >
                            Xem dự án du lịch VR
                        </Link>
                    </div>
                </section>

            </article>
        </div>
    );
};

export default Tourism;
