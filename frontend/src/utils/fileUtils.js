// fileUtils.js

// Chuẩn hóa API_BASE_URL (loại bỏ dấu / cuối)
const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

/**
 * Chuẩn hóa URL đảm bảo luôn trả đúng link tuyệt đối
 */
const normalizeUrl = (cleanUrl) => {
    if (!cleanUrl) return "";

    cleanUrl = cleanUrl.trim();

    // 1) Absolute URL → trả thẳng
    if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
        return cleanUrl;
    }

    // 2) Asset nội bộ FE
    if (cleanUrl.startsWith("assets/") || cleanUrl.startsWith("/assets/")) {
        return cleanUrl.startsWith("/") ? cleanUrl : "/" + cleanUrl;
    }

    // 3) `/uploads/...`
    // if (cleanUrl.startsWith("/uploads/")) {
    //     return `${API_BASE_URL}${cleanUrl}`;
    // }

    if (cleanUrl.startsWith("/uploads/")) {
        return cleanUrl;
    }

    // 4) `uploads/...` (thiếu dấu /)
    if (cleanUrl.startsWith("uploads/")) {
        return `${API_BASE_URL}/${cleanUrl}`;
    }

    // 5) `/api/files/...`
    if (cleanUrl.startsWith("/api/files/")) {
        return `${API_BASE_URL}${cleanUrl}`;
    }

    // 6) Chỉ là file name → convert sang API
    return `${API_BASE_URL}/api/files/${cleanUrl}`;
};

/**
 * Public helpers
 */
export const getFileUrl = (url, type = "image") => {
    if (!url) {
        if (type === "panorama") return "/assets/images/vr_hero_banner.png";
        if (type === "model") return null;
        return "/assets/images/vr_hero_banner.png";
    }

    return normalizeUrl(url);
};

export const getPanoramaUrl = (url) => getFileUrl(url, "panorama");
export const getModelUrl = (url) => getFileUrl(url, "model");
export const getThumbnailUrl = (url) => getFileUrl(url, "image");

export const isValidImageUrl = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
};

export const isValid3DModel = (url) => {
    if (!url) return false;
    return /\.(glb|gltf)$/i.test(url);
};
