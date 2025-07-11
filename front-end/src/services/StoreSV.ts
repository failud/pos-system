import apiClient from "../api";


export const GetMainStore = async () => {
    try {
        const response = await apiClient.get('/stores')
        return response.data;
    } catch (error) {
        throw error;
    }
}