import { Cobro, CobroResponse } from "../interfaces/ICobro"
import apiClient from "./apiClient"

export const getAll = async (): Promise<CobroResponse> => {
    try {
        const response = await apiClient.get('/cobros')

        const { data: { result, data, message, status, error } } = response

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
        const urlApi = `${'/cobros/paginate?'}${queryParams}`

        const response = await apiClient.get(urlApi)

        const { data: { result, data, pagination, status } } = response

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

export const getById = async (id: string): Promise<CobroResponse> => {
    try {
        const urlApi = `${'/cobros/'}${id}`

        const response = await apiClient.get(urlApi)

        console.log('---- response getById cobroRepository ----')
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

export const create = async (payload: Cobro): Promise<CobroResponse> => {
    try {
        const response = await apiClient.post('/cobros', payload)

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

export const update = async (id: string, payload: Cobro): Promise<CobroResponse> => {
    try {
        const urlApi = `${'/cobros/'}${id}`

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