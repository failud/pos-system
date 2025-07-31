import apiClient from "../api"
import type { CategoryInput } from "../types/CategoryType";


export const getAllCategory = async () => {
    try {
        const response = await apiClient("/categories");
        return response;
    } catch (error) {
        throw error;
    }
}

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