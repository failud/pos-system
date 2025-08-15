import apiClient from "../api";
import type { CustomerInput } from "../types/CustomerType";


export const getALLCustomer = async (params: {
    page: number,
    limit: number,
    search?: string,
    gender?: string,
    dateFrom?: string,
    dateTo?: string
}) => {
    try {
        const response = await apiClient.get('/customers', {
            params: params
        })
        return response;
    } catch (error) {
        throw error;
    }
}

export const createCustomer = async (body: CustomerInput) => {
    try {
        const response = await apiClient.post('/customers', body);
        return response;
    } catch (error) {
        throw error;
    }
}

export const editCustomer = async (id: string, body: CustomerInput) => {
    try {
        const response = await apiClient.patch(`/customers/${id}`, body);
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteCustomer = async (id: string) => {
    try {
        const response = await apiClient.delete(`/customers/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
}