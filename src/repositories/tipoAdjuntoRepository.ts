import apiClient from "./apiClient";
import { TipoAdjuntoResponse } from "../interfaces/ITipoAdjunto";

export const getAll = async (): Promise<TipoAdjuntoResponse> => {
    try {
        const response = await apiClient.get('/tipo-adjuntos')
        const { data: dataCanjes } = response
        const { result, data, message, status, error } = dataCanjes

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

export const getById = async (id: string): Promise<TipoAdjuntoResponse> => {
    try {
        const urlApi = `${'/tipo-adjuntos/'}${id}`

        const response = await apiClient.get(urlApi)

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
        return { result: false, data: [], error: errorMessage, status: 500 }
    }
}

export const getByNombre = async (nombre: string): Promise<TipoAdjuntoResponse> => {
    try {
        const urlApi = `${'/tipo-adjuntos/buscar?nombre='}${nombre}`

        const response = await apiClient.get(urlApi)

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
        return { result: false, data: [], error: errorMessage, status: 500 }
    }
}