import { Perfil, PerfilResponse } from "@/interfaces/IPerfil"
import apiClient from "./apiClient"

export const getAll = async () => {
    try {
        const response = await apiClient.get('/perfiles')
        const { data: dataPerfiles } = response
        const { result, data, message, status, error } = dataPerfiles

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
        const urlApi = `${'/cargos/paginate?page='}${page}${'&limit='}${limit}`
        const response = await apiClient.get(urlApi)
        const { data: dataCargos } = response

        const { result, data, pagination, status } = dataCargos

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

export const getById = async (id: string): Promise<PerfilResponse> => {
    try {
        const urlApi = `${'/perfiles/'}${id}`
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

export const create = async (payload: Perfil): Promise<PerfilResponse> => {
    try {
        const response = await apiClient.post('/perfiles', payload)

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

export const update = async (id: string, payload: Perfil): Promise<PerfilResponse> => {
    try {
        const urlApi = `${'/perfiles/'}${id}`
        const response = await apiClient.put(urlApi, payload)
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