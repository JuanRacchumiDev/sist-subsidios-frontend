import apiClient from './apiClient';
import { TipoEstablecimientoResponse } from '../interfaces/ITipoEstablecimiento';

export const getAll = async (): Promise<TipoEstablecimientoResponse> => {
    try {
        const response = await apiClient.get('/tipo-establecimientos')
        // console.log('response tipo establecimientos', response)

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

export const getById = async (id: string): Promise<TipoEstablecimientoResponse> => {
    try {
        const urlApi = `${'/tipo-establecimientos/'}${id}`

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