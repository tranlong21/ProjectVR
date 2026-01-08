import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as projectsService from '../services/projects.service';
import * as scenesService from '../services/scenes.service';
import * as models3dService from '../services/models3d.service';
import Viewer360 from '../components/Viewer360';
import Viewer3D from '../components/Viewer3D';
import { useTranslation } from 'react-i18next';
import { Info, MapPin, Layers, Image as ImageIcon } from 'lucide-react';
import { getThumbnailUrl, getPanoramaUrl, getModelUrl } from '../utils/fileUtils';
import Skeleton from '../components/common/Skeleton';


const ProjectDetail = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const [project, setProject] = useState(null);
    const [scenes, setScenes] = useState([]);
    const [model3d, setModel3d] = useState(null);
    const [activeTab, setActiveTab] = useState('info');
    const [loading, setLoading] = useState(true);
    const [currentSceneId, setCurrentSceneId] = useState(null);


    const modelDescription =
        i18n.language === "vi"
            ? (model3d?.descriptionVi && model3d.descriptionVi.trim() !== ""
                ? model3d.descriptionVi
                : "Không có mô tả tiếng Việt.")
            : (model3d?.descriptionEn && model3d.descriptionEn.trim() !== ""
                ? model3d.descriptionEn
                : "No English description available.");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                // 1️⃣ PROJECT
                const proj = await projectsService.getById(id);
                setProject(proj);

                // 2️⃣ TAB DEFAULT
                if (proj.has360) setActiveTab("360");
                else if (proj.has3d) setActiveTab("3d");
                else if (proj.hasGallery) setActiveTab("gallery");
                else setActiveTab("info");

                // 3️⃣ 360 SCENES
                if (proj.has360) {
                    const scenesData = await scenesService.getByProjectId(id);
                    setScenes(scenesData || []);

                    if (scenesData?.length > 0) {
                        setCurrentSceneId(scenesData[0].id);
                    }
                }

                // 4️⃣ 3D MODEL (PUBLIC)
                if (proj.has3d) {
                    const modelsData = await models3dService.getByProjectIdPublic(id);

                    if (!Array.isArray(modelsData) || modelsData.length === 0) {
                        setModel3d(null);
                    } else {
                        const readyModel = modelsData.find(
                            (m) => m.status === "READY_FOR_WEB"
                        );

                        if (!readyModel) {
                            setModel3d(null);
                        } else {
                            setModel3d(readyModel);
                        }
                    }
                } else {
                    setModel3d(null);
                }

            } catch (err) {
                console.error("Fetch project detail failed:", err);
                setModel3d(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const getImageUrl = (url) => getThumbnailUrl(url);



    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] pt-20 px-4 transition-colors duration-300">
                {/* Banner Skeleton */}
                <div className="relative h-[40vh] md:h-[50vh] rounded-2xl overflow-hidden mb-8 shadow-2xl bg-gray-800 animate-pulse">
                    <div className="absolute bottom-8 left-8 space-y-4">
                        <div className="w-24 h-6 bg-gray-700 rounded-full" />
                        <div className="w-64 h-12 bg-gray-700 rounded" />
                        <div className="w-32 h-6 bg-gray-700 rounded" />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tabs Skeleton */}
                        <div className="flex space-x-4 border-b border-[var(--border-color)] pb-4">
                            <div className="w-24 h-10 bg-gray-800 rounded-full animate-pulse px-6 py-2" />
                            <div className="w-24 h-10 bg-gray-800 rounded-full animate-pulse px-6 py-2" />
                            <div className="w-24 h-10 bg-gray-800 rounded-full animate-pulse px-6 py-2" />
                        </div>
                        {/* Content Skeleton */}
                        <div className="space-y-4">
                            <Skeleton variant="text" className="h-4 w-full" />
                            <Skeleton variant="text" className="h-4 w-5/6" />
                            <Skeleton variant="text" className="h-4 w-4/5" />
                            <Skeleton variant="rectangular" className="h-64 w-full rounded-xl mt-8" />
                        </div>
                    </div>

                    {/* Sidebar Skeleton */}
                    <div className="space-y-8">
                        <div className="glass-panel p-6 rounded-xl space-y-6">
                            <Skeleton variant="text" className="h-8 w-1/2 mb-4" />
                            <div className="space-y-4">
                                <div className="flex justify-between"><Skeleton variant="text" className="w-16" /><Skeleton variant="text" className="w-24" /></div>
                                <div className="flex justify-between"><Skeleton variant="text" className="w-16" /><Skeleton variant="text" className="w-24" /></div>
                                <div className="flex justify-between"><Skeleton variant="text" className="w-16" /><Skeleton variant="text" className="w-24" /></div>
                            </div>
                            <Skeleton variant="rectangular" className="h-12 w-full rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (!project) return <div className="text-center mt-20 text-[var(--text-primary)]">Project not found</div>;

    const title = i18n.language === 'vi' ? (project.titleVi || project.title) : (project.titleEn || project.title);
    const description = i18n.language === 'vi' ? (project.descriptionVi || project.detailedDescription) : (project.descriptionEn || project.detailedDescription);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20 px-4 transition-colors duration-300">

            {/* Banner Section */}
            <div className="relative h-[40vh] md:h-[50vh] rounded-2xl overflow-hidden mb-8 shadow-2xl">
                <img
                    src={getImageUrl(project.thumbnailUrl)}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        <span className="bg-[var(--accent-blue)] text-white px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">
                            {i18n.language === 'vi' ? project.category?.nameVi : project.category?.nameEn}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 neon-text">{title}</h1>
                        <div className="flex items-center text-gray-300">
                            <MapPin size={20} className="mr-2" />
                            <span>{project.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Tabs */}
                    <div className="flex space-x-4 border-b border-[var(--border-color)] pb-4 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${activeTab === 'info' ? 'bg-[var(--accent-blue)] text-white shadow-lg' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--accent-blue)]/10'}`}
                        >
                            Info
                        </button>

                        {project.has360 && (
                            <button
                                onClick={() => setActiveTab('360')}
                                className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${activeTab === '360' ? 'bg-[var(--accent-blue)] text-white shadow-lg' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--accent-blue)]/10'}`}
                            >
                                360° Tour
                            </button>
                        )}

                        {project.has3d && (
                            <button
                                onClick={() => setActiveTab('3d')}
                                className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${activeTab === '3d' ? 'bg-[var(--accent-blue)] text-white shadow-lg' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--accent-blue)]/10'}`}
                            >
                                3D Model
                            </button>
                        )}

                        <button
                            onClick={() => setActiveTab('gallery')}
                            className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${activeTab === 'gallery' ? 'bg-[var(--accent-blue)] text-white shadow-lg' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--accent-blue)]/10'}`}
                        >
                            Gallery
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[300px]">
                        {activeTab === 'info' && (
                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">About this Project</h3>
                                <p className="text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">
                                    {description}
                                </p>

                                {project.aiDescription && (
                                    <div className="mt-8 p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--accent-purple)]/30">
                                        <h4 className="text-[var(--accent-purple)] font-bold mb-2 flex items-center">
                                            <Info size={18} className="mr-2" /> AI Insight
                                        </h4>
                                        <p className="text-[var(--text-secondary)] italic">
                                            "{project.aiDescription}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Main Thumbnail */}
                                <img
                                    src={getImageUrl(project.thumbnailUrl)}
                                    className="rounded-xl w-full h-64 object-cover hover:scale-[1.02] transition-transform shadow-md"
                                    alt="Main View"
                                    onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
                                />

                                {/* Gallery Images from DB */}
                                {project.galleryImages && project.galleryImages.map(img => (
                                    <img
                                        key={img.id}
                                        src={getImageUrl(img.url)}
                                        className="rounded-xl w-full h-64 object-cover hover:scale-[1.02] transition-transform shadow-md"
                                        alt={img.caption || "Gallery Image"}
                                        onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
                                    />
                                ))}

                                {/* Fallback: Show scene panoramas if gallery is empty */}
                                {(!project.galleryImages || project.galleryImages.length === 0) && scenes.map(scene => (
                                    <img
                                        key={scene.id}
                                        src={getPanoramaUrl(scene.panoramaUrl)}
                                        className="rounded-xl w-full h-64 object-cover hover:scale-[1.02] transition-transform shadow-md"
                                        alt={scene.name}
                                        onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
                                    />
                                ))}
                            </div>
                        )}

                        {activeTab === '360' && project.has360 && (
                            <div className="h-[500px] rounded-xl overflow-hidden relative border border-[var(--border-color)] shadow-2xl">
                                {scenes.length > 0 ? (
                                    <Viewer360
                                        scenes={scenes}
                                        initialSceneId={currentSceneId}
                                        i18n={i18n}
                                        onSceneChange={(newId) => setCurrentSceneId(newId)}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-[var(--text-secondary)] bg-gray-900">
                                        <div className="text-center">
                                            <p className="text-xl font-bold mb-2">Loading 360 Experience...</p>
                                            <p className="text-sm">If this takes too long, please check your connection.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ==== TAB 3D ==== */}
                        {activeTab === '3d' && project.has3d && (
                            <div className="relative h-[520px] rounded-xl overflow-hidden border border-[var(--border-color)] shadow-2xl bg-gray-900 p-4">

                                {/* ===== DEBUG LOG (USER) ===== */}
                                {(() => {
                                    console.group("🎯 USER TAB 3D DEBUG");
                                    console.log("project.has3d:", project.has3d);
                                    console.log("model3d:", model3d);

                                    const finalModelUrl = model3d?.modelUrl
                                        ? import.meta.env.VITE_API_URL + model3d.modelUrl
                                        : model3d?.fileUrl
                                            ? import.meta.env.VITE_API_URL + model3d.fileUrl
                                            : null;

                                    console.log("finalModelUrl:", finalModelUrl);
                                    console.log("hotspots:", model3d?.hotspots || []);
                                    console.groupEnd();
                                    return null;
                                })()}
                                {/* ===== END DEBUG ===== */}

                                <div className="w-full h-[460px] rounded-xl overflow-hidden">
                                    {model3d && (model3d.modelUrl || model3d.fileUrl) ? (
                                        <Viewer3D
                                            modelUrl={
                                                model3d?.modelUrl
                                                    ? getModelUrl(model3d.modelUrl)
                                                    : model3d?.fileUrl
                                                        ? getModelUrl(model3d.fileUrl)
                                                        : null
                                            }
                                            description={modelDescription}
                                            lang={i18n.language}
                                            hotspots={model3d?.hotspots || []}
                                            editMode={false}
                                            onClickHotspot={(h) =>
                                                console.log("🟣 USER clicked hotspot:", h)
                                            }
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-white">
                                            <div className="text-center">
                                                <p className="text-xl font-bold mb-2">
                                                    3D Model Not Available
                                                </p>
                                                <p className="text-sm">
                                                    The 3D model for this project is being prepared.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* No VR/AR Message */}
                        {!project.has360 && !project.has3d && activeTab !== 'info' && activeTab !== 'gallery' && (
                            <div className="p-12 text-center bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
                                <p className="text-xl text-[var(--text-secondary)]">
                                    This project does not have VR or AR content available yet.
                                    <br />
                                    Please check the <strong>Gallery</strong> for images.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Project Details</h3>
                        <ul className="space-y-4 text-[var(--text-secondary)]">
                            <li className="flex justify-between">
                                <span>Client</span>
                                <span className="font-medium text-[var(--text-primary)]">Confidential</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Date</span>
                                <span className="font-medium text-[var(--text-primary)]">{new Date(project.createdAt).toLocaleDateString()}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Category</span>
                                <span className="font-medium text-[var(--text-primary)]">{i18n.language === 'vi' ? project.category?.nameVi : project.category?.nameEn}</span>
                            </li>
                        </ul>
                        <button className="w-full mt-6 bg-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/90 
                                            text-[var(--primary)] font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-500/30">
                            {t("common.contact")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
