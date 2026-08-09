import { Reembolso, ReembolsoResponse } from "../interfaces/IReembolso"
import apiClient from "./apiClient"

export const getAll = async (): Promise<ReembolsoResponse> => {
    try {
        const response = await apiClient.get('/reembolsos')

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


export const getAllPaginate = async (queryParams: string) => {
    try {
        const urlApi = `${'/reembolsos/paginate?'}${queryParams}`

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

export const getById = async (id: string): Promise<ReembolsoResponse> => {
    try {
        const urlApi = `${'/reembolsos/'}${id}`

        const response = await apiClient.get(urlApi)

        console.log('---- response getById reembolsoRepository ----')
        console.log({ response })

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

export const create = async (payload: Reembolso): Promise<ReembolsoResponse> => {
    try {
        const response = await apiClient.post('/reembolsos', payload)

        const { data: { result, message, status } } = response

        return {
            result,
            message,
            status
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, data: [], error: errorMessage, status: 500 }
    }
}

export const update = async (id: string, payload: Reembolso): Promise<ReembolsoResponse> => {
    try {
        const urlApi = `${'/reembolsos/'}${id}`

        const response = await apiClient.patch(urlApi, payload)

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