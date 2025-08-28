import apiClient from "./apiClient"
import { Cargo, CargoResponse } from '../interfaces/ICargo'

export const getAll = async (): Promise<CargoResponse> => {
    try {
        const response = await apiClient.get('/cargos')
        const { data: dataCargos } = response
        const { result, data, message, status, error } = dataCargos

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

export const getById = async (id: string): Promise<CargoResponse> => {
    try {
        const urlApi = `${'/cargos/'}${id}`
        const response = await apiClient.get(urlApi)
        // console.log('response getById', response)
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

export const create = async (payload: Cargo): Promise<CargoResponse> => {
    try {
        const response = await apiClient.post('/cargos', payload)
        // console.log('response create', response)

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

export const update = async (id: string, payload: Cargo): Promise<CargoResponse> => {
    try {
        const urlApi = `${'/cargos/'}${id}`
        const response = await apiClient.put(urlApi, payload)
        // console.log('response update', response)
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