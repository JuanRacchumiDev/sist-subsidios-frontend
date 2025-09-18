import { CanjeResponse } from "@/interfaces/ICanje"
import apiClient from "./apiClient"

export const getAll = async (): Promise<CanjeResponse> => {
    try {
        const response = await apiClient.get('/canjes')
        const { data: dataCanjes } = response
        const { result, data, message, status, error } = dataCanjes

        return {
            result,
            data,
            message,
            status,
            error
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, data: [], error: errorMessage, status: 500 }
    }
}


export const getAllWithPaginate = async (page: number, limit: number) => {
    try {
        const urlApi = `${'/canjes/paginate?page='}${page}${'&limit='}${limit}`
        const response = await apiClient.get(urlApi)
        const { data: dataCanjes } = response

        const { result, data, pagination, status } = dataCanjes

        return {
            result,
            data,
            pagination,
            status
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const getById = async (id: string): Promise<CanjeResponse> => {
    try {
        const urlApi = `${'/canjes/'}${id}`
        const response = await apiClient.get(urlApi)
        const { data: { result, data, message, error, status } } = response

        return {
            result,
            data,
            message,
            error,
            status
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, data: [], error: errorMessage, status: 500 }
    }
}