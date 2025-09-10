import apiClient from "./apiClient"
import { Usuario, UsuarioResponse } from "../interfaces/IUsuario"

export const getAll = async (): Promise<UsuarioResponse> => {
    try {
        const response = await apiClient.get('/usuarios')
        const { data: dataUsuarios } = response

        const { result, data, status, message, error } = dataUsuarios

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

export const getAllWithPaginate = async (page: number, limit: number) => {
    try {
        const urlApi = `${'/usuarios/paginate?page='}${page}${'&limit='}${limit}`
        const response = await apiClient.get(urlApi)
        const { data: dataUsuarios } = response

        const { result, data, pagination, status } = dataUsuarios

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

export const getById = async (id: string): Promise<UsuarioResponse> => {
    try {
        const urlApi = `${'/usuarios/'}${id}`
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

export const create = async (payload: Usuario): Promise<UsuarioResponse> => {
    try {
        const response = await apiClient.post('/usuarios', payload)

        const { result, data, status, message, error } = response as UsuarioResponse

        return {
            result,
            data,
            status,
            message,
            error
        }
    } catch (error) {
        // if (error.response) {
        //     throw new Error(error.response.data.message || 'Error al crear empresa')
        // }
        // throw new Error('Error de conexión con el servidor')
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const update = async (id: string, payload: Usuario): Promise<UsuarioResponse> => {
    try {
        const urlApi = `${'/usuarios/'}${id}`
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