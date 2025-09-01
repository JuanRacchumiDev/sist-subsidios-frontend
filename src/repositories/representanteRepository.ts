import { RepresentanteLegal, RepresentanteLegalResponse } from "@/interfaces/IRepresentanteLegal"
import apiClient from "./apiClient"

export const getAll = async () => {
    try {
        const response = await apiClient.get('/representantes')
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

export const getById = async (id: string): Promise<RepresentanteLegalResponse> => {
    try {
        const urlApi = `${'/representantes/'}${id}`
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

export const create = async (payload: RepresentanteLegal): Promise<RepresentanteLegalResponse> => {
    try {
        const response = await apiClient.post('/representantes', payload)

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