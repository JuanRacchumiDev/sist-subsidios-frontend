import apiClient from "./apiClient"
import { Diagnostico, DiagnosticoResponse } from '../interfaces/IDiagnostico'

export const getAll = async (): Promise<DiagnosticoResponse> => {
    try {
        const response = await apiClient.get('/diagnosticos')

        const { data: dataDiagnosticos } = response

        const { result, data, message, status, error } = dataDiagnosticos

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
        const urlApi = `${'/diagnosticos/paginate/?'}${queryParams}`

        const response = await apiClient.get(urlApi)

        const { data: dataDiagnosticos } = response

        const { result, data, pagination, status } = dataDiagnosticos

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

export const getByCodigo = async (codigo: string): Promise<DiagnosticoResponse> => {
    try {
        const urlApi = `${'/diagnosticos/'}${codigo}`

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

export const create = async (payload: Diagnostico): Promise<DiagnosticoResponse> => {
    try {
        const response = await apiClient.post('/diagnosticos', payload)

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
        return { result: false, data: [], error: errorMessage, status: 500 }
    }
}

export const update = async (codigo: string, payload: Diagnostico): Promise<DiagnosticoResponse> => {
    try {
        const urlApi = `${'/diagnosticos/'}${codigo}`

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

export const updateEstado = async (id: string, payload: Diagnostico): Promise<DiagnosticoResponse> => {
    try {
        const urlApi = `${'/diagnosticos/update-estado/'}${id}`

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