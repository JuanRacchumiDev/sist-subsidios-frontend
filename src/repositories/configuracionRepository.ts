import { Configuracion, ConfiguracionResponse } from "../interfaces/IConfiguracion"
import apiClient from './apiClient'

export const getAll = async (): Promise<ConfiguracionResponse> => {
    try {
        const response = await apiClient.get('/configuraciones')

        const { data: dataConfiguraciones } = response

        const { result, data, message, status, error } = dataConfiguraciones

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
        const urlApi = `${'/configuraciones/paginate?'}${queryParams}`

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

export const getById = async (id: string): Promise<ConfiguracionResponse> => {
    try {
        const urlApi = `${'/configuraciones/'}${id}`
        console.log({ urlApi })

        const response = await apiClient.get(urlApi)
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

export const create = async (payload: Configuracion): Promise<ConfiguracionResponse> => {
    console.log('---- payload configuracionRepository ----')
    console.log({ payload })

    try {
        const response = await apiClient.post('/configuraciones', payload)

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

export const update = async (id: string, payload: Configuracion): Promise<ConfiguracionResponse> => {
    try {
        const urlApi = `${'/configuraciones/'}${id}`

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