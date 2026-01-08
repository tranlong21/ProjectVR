import api from "./api";

const ADMIN_ENDPOINT = "/admin/blog-images";

export const getAll = async () => {
    try {
        const res = await api.get(ADMIN_ENDPOINT);
        return res.data;
    } catch (error) {
        console.error("BlogImages Service GetAll Error:", error);
        throw error;
    }
};

export const upload = async (file, usageType = "CONTENT") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("usageType", usageType);

    try {
        const res = await api.post(`${ADMIN_ENDPOINT}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error) {
        console.error("BlogImages Service Upload Error:", error);
        throw error;
    }
};

export const remove = async (id) => {
    try {
        const res = await api.delete(`${ADMIN_ENDPOINT}/${id}`);
        return res.data;
    } catch (error) {
        console.error("BlogImages Service Remove Error:", error);
        throw error;
    }
};
