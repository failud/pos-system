import apiClient from "../api"
import type { BrandInput } from "../types/BrandType";

export const getALLBrandPaginated = async (page: number, pageSize: number, searchText: string) => {
    try {
        const response = await apiClient.get('/brands', {
            params: {
                page: page,
                limit: pageSize,
                search: searchText,
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteBrand = async (id: string) => {
    try {
        const response = await apiClient.delete(`/brands/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getBrandBYID = async (id: string) => {
    try {
        const response = await apiClient.get(`/brands/${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const editBrand = async (id: string, body: BrandInput) => {
    try {
        const response = await apiClient.patch(`/brands/${id}`, body);
        return response;
    } catch (error) {
        throw error;
    }
}

export const createBrand = async (body: BrandInput) => {
    try {
        const response = apiClient.post('/brands', body);
        return response;
    } catch (error) {
        throw error;
    }
}