import apiClient from "./apiClient"
import { DescansoMedico, DescansoMedicoResponse } from '../interfaces/IDescansoMedico'

export const getAll = async (): Promise<DescansoMedicoResponse> => {
    try {
        const response = await apiClient.get('/descansos')
        const { data: dataDescansos } = response
        const { result, data, message, status, error } = dataDescansos

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
        const urlApi = `${'/descansos/paginate?page='}${page}${'&limit='}${limit}`
        const response = await apiClient.get(urlApi)
        const { data: dataDescansos } = response

        const { result, data, pagination, status } = dataDescansos

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

export const getById = async (id: string): Promise<DescansoMedicoResponse> => {
    try {
        const urlApi = `${'/descansos/'}${id}`
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

export const create = async (payload: DescansoMedico): Promise<DescansoMedicoResponse> => {
    try {
        const response = await apiClient.post('/descansos', payload)

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

export const update = async (id: string, payload: DescansoMedico): Promise<DescansoMedicoResponse> => {
    try {
        const urlApi = `${'/descansos/'}${id}`
        const response = await apiClient.put(urlApi, payload)
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