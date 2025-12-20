import Viewer360 from '../../components/Viewer360';
import ThaiBikeGame from './ThaiBikeGame';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    CheckCircle,
    Layers,
    Camera,
    Globe,
    Smartphone,
    Zap,
    Cpu,
    Scan,
    Gamepad2,
    Trophy
} from 'lucide-react';

const Vr360 = () => {
    const { t, i18n } = useTranslation();
    const isVi = i18n.language === 'vi';
    const [showGame, setShowGame] = useState(false);

    if (showGame) {
        return <ThaiBikeGame onExit={() => setShowGame(false)} />;
    }

    const scenes = [
        {
            id: 'demo-scene',
            name: 'Nu Than Tu Do',
            panoramaUrl: '/assets/images/NuThanTudo.jpg',
            hotspots: []
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-purple)] selection:text-white">

            {/* Header / Title Section */}
            <div className="pt-24 pb-10 text-center px-4">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-purple)] to-purple-400">
                        VR 360
                    </span>{' '}
                    {isVi ? 'Solution' : 'Solution'}
                </h1>
                <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto">
                    {isVi
                        ? 'Giải pháp thực tế ảo toàn diện cho doanh nghiệp 4.0'
                        : 'Comprehensive Virtual Reality Solutions for Business 4.0'}
                </p>
            </div>

            {/* 1) VIEWER 360 SECTION (HERO) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="glass-panel p-2 rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden relative group">
                    {/* Live Badge */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-mono flex items-center gap-2 border border-white/10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live Interactive Demo
                    </div>

                    <div className="h-[50vh] md:h-[70vh] w-full rounded-xl overflow-hidden relative bg-gray-900 border border-[var(--border-color)]">
                        <Viewer360
                            scenes={scenes}
                            initialSceneId="demo-scene"
                            i18n={i18n}
                        />
                    </div>
                </div>

                {/* 2) CTA LINE UNDER VIEWER */}
                <div className="mt-6 flex justify-center">
                    <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 text-lg font-medium text-[var(--accent-purple)] hover:text-purple-400 transition-colors border-b-2 border-transparent hover:border-[var(--accent-purple)] pb-1"
                    >
                        <span>👉 {isVi ? 'Trải nghiệm đầy đủ tính năng tại đây' : 'Experience the full features here'}</span>
                        <ArrowRight size={20} className="animate-pulse" />
                    </Link>
                </div>
            </section>

            {/* MAIN ARTICLE CONTENT */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-16">

                {/* Introduction */}
                <section>
                    <p className="text-lg md:text-xl leading-relaxed text-[var(--text-secondary)] first-letter:text-5xl first-letter:font-bold first-letter:text-[var(--accent-purple)] first-letter:mr-1 first-letter:float-left">
                        {isVi
                            ? 'Công nghệ VR 360 đang định hình lại cách chúng ta tương tác với thế giới số. Không chỉ là những hình ảnh tĩnh đơn điệu, VR 360 mang đến một không gian sống động, nơi người dùng có thể tự do khám phá, di chuyển và tương tác như đang hiện diện tại địa điểm thực tế.'
                            : 'VR 360 technology is reshaping how we interact with the digital world. More than just static images, VR 360 delivers a vivid immersive space where users can freely explore, move, and interact as if they were physically present at the location.'}
                    </p>
                </section>

                {/* Image: Hero Banner */}
                <figure className="rounded-2xl overflow-hidden shadow-lg border border-[var(--border-color)]">
                    <img
                        src="/assets/images/vr_hero_banner.png"
                        alt="VR Experience"
                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <figcaption className="text-center text-sm text-[var(--text-secondary)] mt-2 italic p-2">
                        {isVi ? 'Kết nối thế giới thực và ảo' : 'Bridging the physical and digital worlds'}
                    </figcaption>
                </figure>

                {/* Section: Why VR 360 Matters */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold flex items-center gap-3 text-[var(--text-primary)]">
                        <span className="w-8 h-8 rounded-lg bg-[var(--accent-purple)] flex items-center justify-center text-white">
                            <Zap size={20} />
                        </span>
                        {isVi ? 'Tại sao VR 360 quan trọng với doanh nghiệp?' : 'Why VR 360 Matters for Businesses'}
                    </h2>
                    <div className="prose dark:prose-invert max-w-none text-[var(--text-secondary)] leading-relaxed">
                        <p>
                            {isVi
                                ? 'Trong kỷ nguyên số, "See before you buy" (Xem trước khi mua) đã trở thành thói quen của người tiêu dùng. VR 360 giúp xóa bỏ khoảng cách địa lý, tăng cường niềm tin và giữ chân khách hàng lâu hơn trên website của bạn so với hình ảnh truyền thống.'
                                : 'In the digital age, "See before you buy" has become a consumer habit. VR 360 eliminates geographical barriers, enhances trust, and keeps customers on your website longer compared to traditional imagery.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div className="glass-panel p-6 rounded-xl border-l-4 border-[var(--accent-purple)]">
                            <h3 className="font-bold text-lg mb-2">{isVi ? 'Tăng tỷ lệ chuyển đổi' : 'Boost Conversion Rates'}</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                {isVi
                                    ? 'Khách hàng có xu hướng chốt đơn cao hơn khi có trải nghiệm trực quan.'
                                    : 'Customers are more likely to convert after a visual immersive experience.'}
                            </p>
                        </div>
                        <div className="glass-panel p-6 rounded-xl border-l-4 border-pink-500">
                            <h3 className="font-bold text-lg mb-2">{isVi ? 'Marketing hiệu quả' : 'Effective Marketing'}</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                {isVi
                                    ? 'Nội dung VR tạo dấu ấn mạnh mẽ và dễ dàng viral trên mạng xã hội.'
                                    : 'VR content creates a strong impression and easily goes viral on social media.'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Image: Team/Business */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <img
                        src="/assets/images/team_collaboration.png"
                        alt="Team Collaboration"
                        className="rounded-2xl shadow-md border border-[var(--border-color)] h-full object-cover"
                    />
                    <div className="flex flex-col justify-center space-y-4">
                        <h3 className="text-2xl font-bold">{isVi ? 'Tương tác không giới hạn' : 'Limitless Interaction'}</h3>
                        <p className="text-[var(--text-secondary)]">
                            {isVi
                                ? 'Không chỉ là xem, người dùng có thể tương tác, click vào hotspot để xem thông tin, video hoặc thậm chí mua hàng trực tiếp trong không gian ảo.'
                                : 'More than just viewing, users can interact, click hotspots to view info, videos, or even purchase directly within the virtual space.'}
                        </p>
                    </div>
                </div>

                {/* Section: Key Features */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-[var(--accent-purple)] flex items-center justify-center text-white">
                            <Scan size={20} />
                        </span>
                        {isVi ? 'Tính Năng Nổi Bật' : 'Key Features of VRPlus'}
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { icon: Globe, title: 'Web-based', desc: isVi ? 'Chạy ngay trên trình duyệt, không cần cài App.' : 'Runs directly on browser, no App needed.' },
                            { icon: Smartphone, title: 'Multi-device', desc: isVi ? 'Tương thích PC, Mobile, Tablet & VR Headsets.' : 'Compatible with PC, Mobile, Tablet & VR Headsets.' },
                            { icon: Layers, title: 'High Resolution', desc: isVi ? 'Hỗ trợ ảnh 8K-16K sắc nét từng chi tiết.' : 'Supports 8K-16K sharp resolution.' },
                            { icon: Camera, title: 'Custom Hotspots', desc: isVi ? 'Tích hợp video, ảnh, text, 3D model vào cảnh.' : 'Integrate video, images, text, 3D models.' },
                            { icon: Cpu, title: 'AI Integration', desc: isVi ? 'Tự động thuyết minh và gợi ý hành trình.' : 'Auto-narration and journey suggestions.' },
                            { icon: Zap, title: 'Fast Loading', desc: isVi ? 'Tối ưu hóa tải trang thông minh.' : 'Smart loading optimization.' },
                        ].map((feature, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border-color)] hover:border-[var(--accent-purple)] transition-colors">
                                <feature.icon className="w-8 h-8 text-[var(--accent-purple)] mb-3" />
                                <h4 className="font-bold mb-1">{feature.title}</h4>
                                <p className="text-sm text-[var(--text-secondary)]">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section: Use Cases with Images */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-bold text-[var(--text-primary)] border-l-4 border-[var(--accent-purple)] pl-4">
                        {isVi ? 'Ứng Dụng Thực Tế' : 'Real-world Use Cases'}
                    </h2>

                    {/* Case 1: Real Estate / Showroom */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">{isVi ? 'Bất Động Sản & Showroom' : 'Real Estate & Showrooms'}</h3>
                        <img
                            src="/assets/images/virtual_showroom_project.png"
                            alt="Virtual Showroom"
                            className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg border border-[var(--border-color)]"
                        />
                        <p className="text-[var(--text-secondary)]">
                            {isVi
                                ? 'Cho phép khách hàng tham quan căn hộ mẫu, showroom ô tô từ xa. Giảm chi phí xây dựng nhà mẫu vật lý và mở rộng tệp khách hàng toàn cầu.'
                                : 'Allow customers to visit model apartments and car showrooms remotely. Reduce costs of physical model homes and expand to a global customer base.'}
                        </p>
                    </div>

                    {/* Case 2: Tourism / Education */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">{isVi ? 'Du Lịch & Văn Hóa' : 'Tourism & Culture'}</h3>
                            <img
                                src="/assets/images/tourism_360_tour.png"
                                alt="Tourism VR"
                                className="w-full h-48 object-cover rounded-2xl shadow-lg border border-[var(--border-color)]"
                            />
                            <p className="text-sm text-[var(--text-secondary)]">
                                {isVi
                                    ? 'Quảng bá danh lam thắng cảnh, di tích lịch sử. Tái hiện lại các không gian văn hóa đã mất.'
                                    : 'Promote landscapes and historical sites. Reconstruct lost cultural spaces.'}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">{isVi ? 'Giáo Dục & Đào Tạo' : 'Education & Training'}</h3>
                            <img
                                src="/assets/images/vr_education_training.png"
                                alt="Education VR"
                                className="w-full h-48 object-cover rounded-2xl shadow-lg border border-[var(--border-color)]"
                            />
                            <p className="text-sm text-[var(--text-secondary)]">
                                {isVi
                                    ? 'Các bài học trực quan, tham quan bảo tàng ảo, và đào tạo kỹ năng trong môi trường an toàn.'
                                    : 'Visual lessons, virtual museum tours, and skill training in a safe environment.'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section: Entertainment Applications (NEW) */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center text-white">
                            <Gamepad2 size={20} />
                        </span>
                        {isVi ? 'Ứng dụng vào giải trí' : 'Entertainment Applications'}
                    </h2>

                    <div className="glass-panel p-8 rounded-2xl border border-[var(--border-color)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <Trophy size={120} />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-extrabold text-[var(--accent-purple)] mb-2">
                                {isVi ? 'Đua Xe Đạp Thái' : 'Thai Bike Racing'}
                            </h3>
                            <p className="text-xl font-medium text-[var(--text-primary)] mb-1 italic">
                                {isVi ? '"Xe không thắng"' : '"Bicycle without brakes"'}
                            </p>
                            <p className="text-sm text-[var(--text-secondary)] mb-6">
                                {isVi
                                    ? 'Hãy trổ tài tay lái lụa để né vật cản và chạy về đích'
                                    : 'Show off your driving skills to dodge obstacles and reach the finish line'}
                            </p>

                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-4">
                                    <p className="text-[var(--text-secondary)] leading-relaxed">
                                        {isVi
                                            ? 'Một trò chơi đua xe đạp góc nhìn thứ nhất đầy kịch tính. Người chơi tham gia vào đường đua thẳng 3 làn, mật độ vật cản tăng dần. Điểm đặc biệt là sự tích hợp công nghệ điều khiển bằng cử chỉ tay (Gesture Control).'
                                            : 'A thrilling first-person bicycle racing game. Players race on a straight 3-lane track with increasing obstacle density. The highlight is the integration of Hand Gesture Control technology.'}
                                    </p>
                                    <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                                            {isVi ? 'Góc nhìn người lái thực tế' : 'Realistic rider perspective'}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                                            {isVi ? 'Điều khiển bằng chuyển động tay' : 'Controlled by hand movements'}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                                            {isVi ? 'Tăng cường độ đắm chìm và tương tác' : 'Enhanced immersion and interaction'}
                                        </li>
                                    </ul>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="p-4 bg-[var(--background)] rounded-xl border border-[var(--border-color)] text-center">
                                        <p className="font-mono text-sm mb-2 text-pink-500 font-bold">{isVi ? 'CÔNG NGHỆ GESTURE' : 'GESTURE TECH'}</p>
                                        <p className="text-xs text-[var(--text-secondary)]">
                                            {isVi
                                                ? 'Sử dụng AI để theo dõi độ sâu và vị trí tay, cho phép đánh lái trái/phải tự nhiên mà không cần thiết bị cầm tay.'
                                                : 'Uses AI to track hand depth and position, allowing natural left/right steering without controllers.'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowGame(true)}
                                        className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-bold shadow-lg hover:shadow-pink-500/30 transition-all hover:scale-105"
                                    >
                                        <span>{isVi ? 'Chơi Ngay' : 'Play Now'}</span>
                                        <Gamepad2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: Technical Advantages */}
                <section className="bg-[var(--muted)]/30 p-8 rounded-3xl border border-[var(--border-color)]">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <h2 className="text-2xl font-bold">{isVi ? 'Sức Mạnh Công Nghệ' : 'Technical Advantages'}</h2>
                            <ul className="space-y-3">
                                {[
                                    'WebXR Standard',
                                    'React Three Fiber Ecosystem',
                                    'Cloud Streaming Assets',
                                    'Analytics & Heatmap Tracking'
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-sm text-[var(--text-secondary)] mt-4">
                                {isVi
                                    ? 'Nền tảng của chúng tôi được xây dựng tối ưu cho hiệu suất, đảm bảo trải nghiệm mượt mà ngay cả trên mạng di động 4G.'
                                    : 'Our platform is built for performance, ensuring smooth experiences even on 4G mobile networks.'}
                            </p>
                        </div>
                        <div className="flex-1">
                            <img
                                src="/assets/images/ar_marketing_demo.png"
                                alt="Tech Demo"
                                className="rounded-xl shadow-inner border border-white/10"
                            />
                        </div>
                    </div>
                </section>

                {/* FAQ section previously implemented, keeping it brief or replacing with Best Practices */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">{isVi ? 'Lưu ý khi triển khai' : 'Best Practices for VR Tours'}</h2>
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-[var(--accent-purple)] flex items-center justify-center shrink-0 font-bold text-white">1</div>
                            <div>
                                <h4 className="font-bold">{isVi ? 'Chất lượng hình ảnh' : 'Image Quality'}</h4>
                                <p className="text-sm text-[var(--text-secondary)]">Should use 8K-12K HDR panoramas for best clarity.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-[var(--accent-purple)] flex items-center justify-center shrink-0 font-bold text-white">2</div>
                            <div>
                                <h4 className="font-bold">{isVi ? 'Dẫn chuyện (Storytelling)' : 'Storytelling'}</h4>
                                <p className="text-sm text-[var(--text-secondary)]">Guide users logically through scenes, don't just dump them in.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-[var(--accent-purple)] flex items-center justify-center shrink-0 font-bold text-white">3</div>
                            <div>
                                <h4 className="font-bold">UI/UX</h4>
                                <p className="text-sm text-[var(--text-secondary)]">Keep interfaces clean and intuitive. Avoid cluttering the view.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Conclusion + Final CTA */}
                <section className="text-center py-12 border-t border-[var(--border-color)]">
                    <h2 className="text-3xl font-bold mb-6">
                        {isVi ? 'Sẵn sàng để bắt đầu?' : 'Ready to Get Started?'}
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
                        {isVi
                            ? 'Hãy để chúng tôi giúp bạn xây dựng trải nghiệm VR 360 đẳng cấp cho thương hiệu của bạn.'
                            : 'Let us help you build a world-class VR 360 experience for your brand.'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/projects"
                            className="px-8 py-3 bg-[var(--accent-purple)] hover:bg-[var(--accent-purple-hover)] text-white rounded-full font-bold transition-all shadow-lg hover:shadow-[var(--accent-purple)]/50"
                        >
                            {isVi ? 'Xem Dự Án Mẫu' : 'View Sample Projects'}
                        </Link>
                        {/* <Link 
                            to="/contact" 
                            className="px-8 py-3 glass-panel hover:bg-[var(--muted)] rounded-full font-bold transition-all border border-[var(--border-color)]"
                        >
                            {isVi ? 'Liên Hệ Tư Vấn' : 'Contact for Advice'}
                        </Link> */}
                    </div>
                </section>

            </article>
        </div>
    );
};

export default Vr360;
