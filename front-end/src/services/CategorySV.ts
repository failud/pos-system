import apiClient from "../api"


export const getAllCategory = async () => {
    try {
        const response = await apiClient("/categories");
        return response;
    } catch (error) {
        throw error;
    }
}