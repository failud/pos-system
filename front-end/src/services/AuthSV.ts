import apiClient from "../api";


export const requestLogin = async (username: string, password: string) => {
    try {
        const response = await apiClient.post('/users/login', {
            username,
            password
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}