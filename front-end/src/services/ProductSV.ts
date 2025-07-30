import apiClient from "../api"


export const getAllProducts = async () => {
    try {
        const response = await apiClient('/products')
        return response;
    } catch (error) {
        throw error;
    }
}