import apiClient from "../api"


export const getAllProducts = async (page?: number, limit?: number) => {
    try {
        const response = await apiClient('/products', {
            params: {
                page,
                limit
            }
        })
        return response;
    } catch (error) {
        throw error;
    }
}