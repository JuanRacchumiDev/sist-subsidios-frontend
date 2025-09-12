import apiClient from "./apiClient"
import {
    DocumentoTipoContingencia,
    DocumentoTipoContingenciaResponse
} from '../interfaces/IDocumentoTipoContingencia'

export const getAll = async (): Promise<DocumentoTipoContingenciaResponse> => {
    try {
        const response = await apiClient.get('/documentos-tipo-contingencia')
        const { data: dataDocumentos } = response
        const { result, data, message, status, error } = dataDocumentos

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

export const getAllWithPaginate = async (page: number, limit: number) => {
    try {
        const urlApi = `${'/documentos-tipo-contingencia/paginate?page='}${page}${'&limit='}${limit}`
        const response = await apiClient.get(urlApi)
        const { data: dataDescansos } = response

        const { result, data, pagination, status } = dataDescansos

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

export const getById = async (id: string): Promise<DocumentoTipoContingenciaResponse> => {
    try {
        const urlApi = `${'/documentos-tipo-contingencia/'}${id}`
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

export const create = async (payload: DocumentoTipoContingencia): Promise<DocumentoTipoContingenciaResponse> => {
    try {
        const response = await apiClient.post('/documentos-tipo-contingencia', payload)

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

export const update = async (id: string, payload: DocumentoTipoContingencia): Promise<DocumentoTipoContingenciaResponse> => {
    try {
        const urlApi = `${'/documentos-tipo-contingencia/'}${id}`
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