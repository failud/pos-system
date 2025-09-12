import apiClient from "../api"
import type { CategoryInput } from "../types/CategoryType";

export const getAllCategory = async () => {
    try {
        const response = await apiClient.get("/categories");
        return response;
    } catch (error) {
        throw error;
    }
}

export const getAllCategoryList = async (params?: { search?: string; sortOrder?: string }) => {
    try {
        const response = await apiClient.get("/categories/paginated", {
            params,
        });
        return response;
    } catch (error) {
        throw error;
    }
};


export const createCategory = async (body: CategoryInput) => {
    try {
        const response = await apiClient.post('/categories', body)
        return response;
    } catch (error) {
        throw error;
    }
}

export const editCategory = async (id: string, body: CategoryInput) => {
    try {
        const response = await apiClient.patch(`/categories/${id}`, body)
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteCategory = async (id: string) => {
    try {
        const response = await apiClient.delete(`/categories/${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const getCategoryRoot = async () => {
    try {
        const response = await apiClient.get(`/categories/root`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getCategoryBYID = async (id: string) => {
    try {
        const response = await apiClient.get(`/categories/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
}