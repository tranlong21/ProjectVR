import React, { useState, useMemo } from 'react';
import Viewer360 from '../../components/Viewer360';
import UnityViewer from '../../components/unity/UnityViewer';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  GraduationCap,
  Cpu
} from 'lucide-react';

const Education = () => {
  // 🔑 TAB STATE: chỉ cho phép 1 WebGL chạy
  const [activeTab, setActiveTab] = useState('360'); // '360' | '3d'


  const scenes = useMemo(() => [
    {
      id: 'huce-campus',
      name: 'HUCE Campus',
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
            VR 360
          </span>{' '}
          cho Giáo Dục Đại Học
        </h1>
        <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto">
          Ứng dụng thực tế ảo trong tham quan – đào tạo – tuyển sinh
          tại Đại học Xây dựng Hà Nội (HUCE)
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
          VR 360°
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

      {/* ===== VIEWER AREA ===== */}
      <section className="max-w-7xl mx-auto px-4 mb-14">
        <div className="glass-panel p-2 rounded-2xl border border-[var(--border-color)] shadow-2xl relative">

          {/* Badge */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-white text-xs flex items-center gap-2 border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {activeTab === '360'
              ? 'HUCE Virtual Campus'
              : '3D Learning Model'}
          </div>

          {/* ===== ONLY ONE WEBGL HERE ===== */}
          <div className="h-[50vh] md:h-[70vh] rounded-xl overflow-hidden border border-[var(--border-color)] bg-black">

            {activeTab === '360' && (
              <Viewer360
                scenes={scenes}
                initialSceneId="huce-campus"
              />
            )}

            {activeTab === '3d' && (
              <UnityViewer />
            )}

          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            to="/projects/16"
            className="inline-flex items-center gap-2 text-lg font-medium text-[var(--accent-purple)] hover:text-purple-400 transition-colors"
          >
            Trải nghiệm hệ sinh thái VR giáo dục
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ===== BLOG / CASE STUDY CONTENT ===== */}
      <article className="max-w-4xl mx-auto px-4 pb-32 space-y-24">

        {/* INTRO */}
        <section>
          <p className="text-lg leading-relaxed text-[var(--text-secondary)]
            first-letter:text-5xl first-letter:font-bold
            first-letter:text-[var(--accent-purple)]
            first-letter:mr-1 first-letter:float-left">
            Công nghệ VR 360 đang mở ra một cách tiếp cận hoàn toàn mới
            trong giáo dục đại học. Đối với các trường kỹ thuật như
            Đại học Xây dựng Hà Nội (HUCE), thực tế ảo không chỉ là công cụ
            trình diễn, mà còn là nền tảng giúp sinh viên, phụ huynh và xã hội
            tiếp cận môi trường đào tạo một cách trực quan, minh bạch và hiện đại.
          </p>
        </section>

        {/* IMAGE 1 */}
        <section className="space-y-6">
          <img
            src="/assets/images/huces/huce.png"
            alt="HUCE Campus VR"
            className="rounded-2xl shadow-xl w-full"
          />
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Toàn cảnh khuôn viên Đại học Xây dựng Hà Nội được số hóa bằng công nghệ
            VR 360°, cho phép người xem tham quan từ xa như đang đứng trực tiếp
            tại trường.
          </p>
        </section>

        {/* IMAGE 2 */}
        <section className="space-y-6">
          <img
            src="/assets/images/huces/huce1.png"
            alt="HUCE Learning Space"
            className="rounded-2xl shadow-xl w-full"
          />
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Các không gian học tập, phòng chức năng và khu nghiên cứu
            được tái hiện chân thực, hỗ trợ sinh viên và phụ huynh
            hình dung rõ ràng về môi trường đào tạo.
          </p>
        </section>

        {/* IMAGE 3 */}
        <section className="space-y-6">
          <img
            src="/assets/images/huces/huce2.png"
            alt="HUCE Virtual Experience"
            className="rounded-2xl shadow-xl w-full"
          />
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Kết hợp VR 360 và mô hình 3D giúp nhà trường xây dựng
            hệ sinh thái giáo dục số, phục vụ tuyển sinh, đào tạo
            và truyền thông thương hiệu trong kỷ nguyên số.
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
              'WebVR – chạy trực tiếp trên trình duyệt',
              'VR 360 (Pannellum) & Unity WebGL',
              'WASM & GPU Acceleration',
              'Hỗ trợ PC, Mobile, VR Headset'
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
            Sẵn sàng số hóa không gian giáo dục?
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-8">
            VR 360 & 3D giúp các trường đại học nâng cao hình ảnh,
            cải thiện tuyển sinh và đổi mới phương pháp đào tạo.
          </p>

          <Link
            to="/projects?category=education"
            className="px-8 py-3 bg-[var(--accent-purple)] text-white rounded-full font-bold
                        shadow-lg hover:shadow-[var(--accent-purple)]/40 transition-all"
          >
            Xem dự án giáo dục mẫu
          </Link>
        </section>

      </article>
    </div>
  );
};

export default Education;
