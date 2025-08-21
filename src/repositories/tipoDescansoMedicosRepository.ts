import apiClient from './apiClient';
import { TipoDescansoMedicoResponse } from '../interfaces/ITipoDescansoMedico';

export const getAll = async (): Promise<TipoDescansoMedicoResponse> => {
    try {
        const response = await apiClient.get('/tipo-descanso-medicos')
        // console.log('response tipo de descansos médicos', response)

        const { data: { result, data, message, status, error } } = response

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
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const getById = async (id: string): Promise<TipoDescansoMedicoResponse> => {
    try {
        const urlApi = `${'/tipo-descanso-medicos/'}${id}`

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