import apiClient from './apiClient';
import { DetalleResponse } from "../interfaces/IDetalleParametro"

export const getAll = async (): Promise<DetalleResponse> => {
    try {
        const response = await apiClient.get('/tipo-contingencias')

        const { data: { result, data, message, status, error } } = response

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

export const getById = async (id: string): Promise<DetalleResponse> => {
    try {
        const urlApi = `${'/tipo-contingencias/'}${id}`

        const response = await apiClient.get(urlApi)

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