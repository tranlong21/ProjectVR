/**
 * Utility function to resolve file URLs for images and 3D models
 * Handles both absolute URLs and relative paths from backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8096';

/**
 * Get the full URL for an image or file
 * @param {string} url - The URL or path from the backend
 * @param {string} type - Type of resource: 'image', 'model', 'panorama'
 * @returns {string} - Full URL to the resource
 */
export const getFileUrl = (url, type = 'image') => {
    // Handle null, undefined, or empty strings
    if (!url || url.trim() === '') {
        // Return default placeholder based on type
        if (type === 'panorama') return '/assets/images/vr_hero_banner.png';
        if (type === 'model') return null;
        return '/assets/images/vr_hero_banner.png';
    }

    // Trim whitespace
    const cleanUrl = url.trim();

    // Already an absolute URL (http/https)
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
        return cleanUrl;
    }

    // Local asset path - return as-is (browser will resolve from public folder)
    if (cleanUrl.startsWith('/assets/') || cleanUrl.startsWith('assets/')) {
        return cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
    }

    // Backend API file path
    if (cleanUrl.startsWith('/api/files/')) {
        return `${API_BASE_URL}${cleanUrl}`;
    }

    // Backend uploads path (direct static serving)
    if (cleanUrl.startsWith('/uploads/')) {
        return `${API_BASE_URL}${cleanUrl}`;
    }

    // Filename only - assume it's served via /api/files/
    // This handles cases like: "7c717428-bc9c-4bf0-9712-337ffbcc1729.jpg"
    return `${API_BASE_URL}/api/files/${cleanUrl}`;
};

/**
 * Get URL specifically for panorama images (2:1 aspect ratio)
 */
export const getPanoramaUrl = (url) => {
    return getFileUrl(url, 'panorama');
};

/**
 * Get URL specifically for 3D models (.glb, .gltf)
 */
export const getModelUrl = (url) => {
    return getFileUrl(url, 'model');
};

/**
 * Get URL for project thumbnails
 */
export const getThumbnailUrl = (url) => {
    return getFileUrl(url, 'image');
};

/**
 * Check if URL is a valid image
 */
export const isValidImageUrl = (url) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerUrl.includes(ext));
};

/**
 * Check if URL is a valid 3D model
 */
export const isValid3DModel = (url) => {
    if (!url) return false;
    const modelExtensions = ['.glb', '.gltf'];
    const lowerUrl = url.toLowerCase();
    return modelExtensions.some(ext => lowerUrl.endsWith(ext));
};
