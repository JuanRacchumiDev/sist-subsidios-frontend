import apiClient from "./apiClient"
import { Detalle, DetalleResponse } from "../interfaces/IDetalleParametro"

export const getAll = async (queryParams: string): Promise<DetalleResponse> => {
    try {
        const urlApi = `${'/detalles?'}${queryParams}`

        const response = await apiClient.get(urlApi)

        const { data: { result, message, data, error, status } } = response

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
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const getAllWithPaginate = async (clase: number, queryParams: string) => {
    try {
        const urlApi = `${'/detalles/paginate/'}${clase}${'?'}${queryParams}`

        const response = await apiClient.get(urlApi)

        const { data: dataDetalles } = response

        const { result, data, pagination, status } = dataDetalles

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

export const getById = async (id: string): Promise<DetalleResponse> => {
    try {
        const urlApi = `${'/detalles/'}${id}`

        const response = await apiClient.get(urlApi)

        const { data: { result, message, data, error, status } } = response

        return {
            result,
            message,
            data,
            error,
            status
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const create = async (payload: Detalle): Promise<DetalleResponse> => {
    try {
        const response = await apiClient.post('/detalles', payload)

        const { data: { result, data, status, message, error } } = response

        return {
            result,
            data,
            status,
            message,
            error
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const update = async (id: string, payload: Detalle): Promise<DetalleResponse> => {
    try {
        const urlApi = `${'/detalles/'}${id}`
        const response = await apiClient.patch(urlApi, payload)
        console.log('response update detalle', response)

        const { data: { result, data, status, message } } = response

        return {
            result,
            data,
            status,
            message
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}