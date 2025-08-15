import apiClient from "../api"
import type { UserInput } from "../types/UserType";


export const getALLUsers = async (page = 1, limit = 10, search = '') => {
    try {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        if (search && search.trim() !== '') {
            params.append('search', search.trim());
        }

        const response = await apiClient.get(`/users?${params.toString()}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const editUser = async (id: string, body: UserInput) => {
    try {
        const response = await apiClient.patch(`/users/${id}`, body);
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteUser = async (id: string) => {
    try {
        const response = await apiClient.delete(`/users/${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const createUser = async (body: UserInput) => {
    try {
        const response = await apiClient.post('/users', body)
        return response;
    } catch (error) {
        throw error;
    }
}

export const getBYID = async (id: string) => {
    try {
        const response = await apiClient(`/users/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const changeUserPassword = async (id: string, password: string) => {
    try {
        const response = await apiClient.patch(`/users/${id}/change-password`, {
            password: password
        });
        return response;
    } catch (error) {
        throw error;
    }
}