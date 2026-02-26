import apiClient from "./apiClient"
import { TrabajadorSocial, TrabajadorSocialResponse } from "../interfaces/ITrabajadorSocial"

export const getAll = async (): Promise<TrabajadorSocialResponse> => {
    try {
        const response = await apiClient.get('/trab-sociales')

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

export const getAllWithPaginate = async (queryParams: string) => {
    try {
        const urlApi = `${'/trab-sociales/paginate?'}${queryParams}`

        const response = await apiClient.get(urlApi)

        const { data: dataTrabSociales } = response

        const { result, data, pagination, status } = dataTrabSociales

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

export const getById = async (id: string): Promise<TrabajadorSocialResponse> => {
    try {
        const urlApi = `${'/trab-sociales/'}${id}`

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

export const getByIdTipoDocAndNumDoc = async (idTipoDoc: string, numDoc: string): Promise<TrabajadorSocialResponse> => {
    const urlApi = `${'/trab-sociales/buscar-por-tipodoc-numdoc?idTipoDoc='}${idTipoDoc}${'&numDoc='}${numDoc}`

    const response = await apiClient.get(urlApi)

    const { data: { result, message, data, error, status } } = response

    return {
        result,
        message,
        data,
        error,
        status
    }
}

export const create = async (payload: TrabajadorSocial): Promise<TrabajadorSocialResponse> => {
    try {
        const response = await apiClient.post('/trab-sociales', payload)

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

export const update = async (id: string, payload: TrabajadorSocial): Promise<TrabajadorSocialResponse> => {
    try {
        const urlApi = `${'/trab-sociales/'}${id}`

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
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const updateEstado = async (id: string, payload: TrabajadorSocial): Promise<TrabajadorSocialResponse> => {
    try {
        const urlApi = `${'/trab-sociales/update-estado/'}${id}`

        const response = await apiClient.patch(urlApi, payload)

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