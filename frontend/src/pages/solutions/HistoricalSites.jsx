import React, { useState, useMemo } from 'react';
import Viewer360 from '../../components/Viewer360';
import Viewer3D from '../../components/Viewer3D';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Landmark,
  Flag,
  Users,
  Globe,
  Layers,
  Camera,
  Cpu
} from 'lucide-react';

const HistoricalSites = () => {
  // 🔑 TAB STATE – chỉ 1 WebGL sống
  const [activeTab, setActiveTab] = useState('360'); // '360' | '3d'

  // 🔒 Scene cố định – tránh re-init
  const scenes = useMemo(() => [
    {
      id: 'lang-bac-ho',
      name: 'Lăng Chủ tịch Hồ Chí Minh',
      panoramaUrl: '/assets/images/NuThanTudo.jpg',
      hotspots: []
    }
  ], []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans">

      {/* ===== HEADER ===== */}
      <section className="pt-24 pb-12 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-purple)] to-purple-400">
            VR Di Tích Lịch Sử
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto">
          Số hóa không gian Lăng Chủ tịch Hồ Chí Minh bằng công nghệ VR 360 & 3D
        </p>
      </section>

      {/* ===== TAB CONTROLS ===== */}
      <section className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setActiveTab('360')}
          className={`px-6 py-2 rounded-full font-bold transition-all
            ${activeTab === '360'
              ? 'bg-[var(--accent-purple)] text-white shadow-lg'
              : 'bg-[var(--card)] text-[var(--text-secondary)] hover:bg-[var(--accent-purple)]/10'
            }`}
        >
          360° Tour
        </button>

        <button
          onClick={() => setActiveTab('3d')}
          className={`px-6 py-2 rounded-full font-bold transition-all
            ${activeTab === '3d'
              ? 'bg-[var(--accent-purple)] text-white shadow-lg'
              : 'bg-[var(--card)] text-[var(--text-secondary)] hover:bg-[var(--accent-purple)]/10'
            }`}
        >
          3D Model
        </button>
      </section>

      {/* ===== VIEWER ZONE (CHỈ 1 WEBGL) ===== */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="glass-panel p-2 rounded-2xl border border-[var(--border-color)] shadow-2xl relative">

          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-white text-xs flex items-center gap-2 border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {activeTab === '360'
              ? 'Quảng trường Ba Đình – Trải nghiệm 360°'
              : 'Mô hình 3D Lăng Chủ tịch Hồ Chí Minh'}
          </div>

          <div className="h-[50vh] md:h-[70vh] rounded-xl overflow-hidden border border-[var(--border-color)] bg-black">

            {activeTab === '360' && (
              <Viewer360
                scenes={scenes}
                initialSceneId="lang-bac-ho"
              />
            )}

            {activeTab === '3d' && (
              <Viewer3D
                modelUrl="/assets/model3d/LangBacHo.glb"
                description="Mô hình 3D Lăng Chủ tịch Hồ Chí Minh – ứng dụng trong giáo dục lịch sử, kiến trúc và quy hoạch."
                lang="vi"
                editMode={false}
                hotspots={[]}
              />
            )}

          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-lg font-medium text-[var(--accent-purple)] hover:text-purple-400 transition-colors"
          >
            👉 Trải nghiệm hệ sinh thái VR Di sản
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ===== CONTENT (NO WEBGL) ===== */}
      <article className="max-w-4xl mx-auto px-4 pb-32 space-y-20">

        {/* INTRO */}
        <section>
          <p className="text-lg leading-relaxed text-[var(--text-secondary)] first-letter:text-5xl first-letter:font-bold first-letter:text-[var(--accent-purple)] first-letter:mr-1 first-letter:float-left">
            Lăng Chủ tịch Hồ Chí Minh là công trình có giá trị lịch sử – chính trị – văn hóa đặc biệt.
            Việc ứng dụng VR 360 và mô hình 3D không chỉ phục vụ bảo tồn,
            mà còn mở ra phương thức giáo dục và truyền thông hiện đại, bền vững.
          </p>
        </section>
        {/* ===== IMAGE STORY – LANG BAC HO ===== */}
        <section className="space-y-10">
          <h2 className="text-3xl font-bold text-center">
            Không gian Lăng Chủ tịch Hồ Chí Minh
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* IMAGE 1 */}
            <figure className="space-y-3">
              <img
                src="/assets/images/historical-sites/LangBacHo.jpg"
                alt="Quảng trường Ba Đình và Lăng Chủ tịch Hồ Chí Minh"
                className="rounded-2xl shadow-lg border border-[var(--border-color)]"
              />
              <figcaption className="text-sm text-[var(--text-secondary)]">
                Quảng trường Ba Đình – nơi diễn ra các sự kiện lịch sử trọng đại của dân tộc Việt Nam.
              </figcaption>
            </figure>

            {/* IMAGE 2 */}
            <figure className="space-y-3">
              <img
                src="/assets/images/historical-sites/LangBacHo1.jpg"
                alt="Mặt chính Lăng Chủ tịch Hồ Chí Minh"
                className="rounded-2xl shadow-lg border border-[var(--border-color)]"
              />
              <figcaption className="text-sm text-[var(--text-secondary)]">
                Kiến trúc Lăng Chủ tịch Hồ Chí Minh mang phong cách trang nghiêm, bền vững và biểu tượng.
              </figcaption>
            </figure>

            {/* IMAGE 3 */}
            <figure className="space-y-3">
              <img
                src="/assets/images/historical-sites/LangBacHo2.jpg"
                alt="Nghi lễ chào cờ tại Quảng trường Ba Đình"
                className="rounded-2xl shadow-lg border border-[var(--border-color)]"
              />
              <figcaption className="text-sm text-[var(--text-secondary)]">
                Nghi lễ chào cờ thể hiện tinh thần yêu nước và truyền thống thiêng liêng của dân tộc.
              </figcaption>
            </figure>

            {/* IMAGE 4 */}
            <figure className="space-y-3">
              <img
                src="/assets/images/historical-sites/LangBacHo3.jpg"
                alt="Lễ thượng cờ tại Lăng Chủ tịch Hồ Chí Minh"
                className="rounded-2xl shadow-lg border border-[var(--border-color)]"
              />
              <figcaption className="text-sm text-[var(--text-secondary)]">
                Không gian Lăng Bác trong các nghi lễ quốc gia, mang giá trị chính trị và văn hóa sâu sắc.
              </figcaption>
            </figure>
          </div>

          {/* IMAGE FULL WIDTH */}
          <figure className="space-y-3">
            <img
              src="/assets/images/historical-sites/LangBacHo4.jpg"
              alt="Đội danh dự diễu hành trước Lăng Chủ tịch Hồ Chí Minh"
              className="w-full rounded-3xl shadow-xl border border-[var(--border-color)]"
            />
            <figcaption className="text-sm text-center text-[var(--text-secondary)]">
              Lễ diễu hành danh dự trước Lăng Chủ tịch Hồ Chí Minh – biểu tượng của kỷ luật, lòng trung thành và niềm tự hào dân tộc.
            </figcaption>
          </figure>
        </section>

        {/* USE CASES */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Landmark className="w-8 h-8 text-[var(--accent-purple)]" />
            Ứng dụng VR & 3D cho di tích lịch sử
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Camera, title: 'Tham quan ảo', desc: 'Trải nghiệm không gian Ba Đình từ xa.' },
              { icon: Layers, title: 'Mô hình 3D', desc: 'Khám phá kiến trúc & tỷ lệ công trình.' },
              { icon: Flag, title: 'Giáo dục lịch sử', desc: 'Phục vụ học tập, nghiên cứu.' },
              { icon: Users, title: 'Đối ngoại – truyền thông', desc: 'Giới thiệu di sản ra thế giới.' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border-color)] hover:border-[var(--accent-purple)] transition-colors">
                <item.icon className="w-8 h-8 text-[var(--accent-purple)] mb-3" />
                <h4 className="font-bold mb-1">{item.title}</h4>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TECH */}
        <section className="bg-[var(--muted)]/30 p-8 rounded-3xl border border-[var(--border-color)]">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Cpu className="text-[var(--accent-purple)]" />
            Công nghệ triển khai
          </h2>

          <ul className="space-y-3">
            {[
              'WebVR – chạy trực tiếp trên trình duyệt',
              'VR 360 + 3D GLB/GLTF',
              'Tối ưu PC, Mobile & VR Headset',
              'Phù hợp giáo dục – du lịch – truyền thông'
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
            Số hóa di sản – Gìn giữ giá trị dân tộc
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-8">
            Công nghệ VR giúp lịch sử Việt Nam tiếp cận thế hệ trẻ và bạn bè quốc tế.
          </p>

          <Link
            to="/projects"
            className="px-8 py-3 bg-[var(--accent-purple)] text-white rounded-full font-bold shadow-lg hover:shadow-[var(--accent-purple)]/40 transition-all"
          >
            Xem dự án di sản số
          </Link>
        </section>

      </article>
    </div>
  );
};

export default HistoricalSites;
