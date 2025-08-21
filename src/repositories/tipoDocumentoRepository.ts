import apiClient from "./apiClient";
import { TipoDocumentoResponse } from "../interfaces/ITipoDocumento";

export const getAll = async (): Promise<TipoDocumentoResponse> => {
    try {
        const response = await apiClient.get('/tipo-documentos')
        const { data: dataTipoDocumentos } = response

        const { data: { result, data, status, message, error } } = dataTipoDocumentos

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

export const getById = async (id: string): Promise<TipoDocumentoResponse> => {
    try {
        const urlApi = `${'/tipo-documentos/'}${id}`

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