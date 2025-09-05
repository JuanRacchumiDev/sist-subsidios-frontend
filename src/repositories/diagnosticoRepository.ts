import apiClient from "./apiClient"
import { DiagnosticoResponse } from '../interfaces/IDiagnostico'

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