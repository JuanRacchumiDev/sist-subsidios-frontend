import apiClient from './apiClient';
import { TipoContingenciaResponse } from '../interfaces/ITipoContingencia';

export const getAll = async (): Promise<TipoContingenciaResponse> => {
    try {
        const response = await apiClient.get('/tipo-contingencias')
        // console.log('response tipo contingencias', response)

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

export const getById = async (id: string): Promise<TipoContingenciaResponse> => {
    try {
        const urlApi = `${'/tipo-contingencias/'}${id}`

        const response = await apiClient.get(urlApi)

        // console.log('response getById', response)

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