import apiClient from "./apiClient";
import { Adjunto, AdjuntoResponse } from '../interfaces/IAdjunto'
import { responseViewFile } from '../types/TFile';

export const getAll = async (): Promise<AdjuntoResponse> => {
    try {
        const response = await apiClient.get('/adjuntos')
        const { data: dataAdjuntos } = response
        const { result, data, message, status, error } = dataAdjuntos

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

export const getAllPaginate = async (page: number, limit: number) => {
    try {
        const urlApi = `${'/adjuntos/paginate?page='}${page}${'&limit='}${limit}`

        const response = await apiClient.get(urlApi)

        const { data: dataAdjuntos } = response

        const { result, data, pagination, status } = dataAdjuntos

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

export const getById = async (id: string): Promise<AdjuntoResponse> => {
    try {
        const urlApi = `${'/adjuntos/'}${id}`

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

export const create = async (payload: Adjunto): Promise<AdjuntoResponse> => {
    try {
        const response = await apiClient.post('/adjuntos', payload)

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

export const update = async (id: string, payload: Adjunto): Promise<AdjuntoResponse> => {
    try {
        const urlApi = `${'/adjuntos/'}${id}`

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

export const upload = async (params: Adjunto = {}, formData: FormData): Promise<AdjuntoResponse> => {
    try {
        console.log('---- update adjuntoRepository ----')
        console.log({ params })
        console.log({ formData })

        let response: any = null
        let uri: string = `/adjuntos`

        // Obteniendo el código temporal del usuario autenticado
        const codigo_temp = localStorage.getItem("codigo_temp") || null

        console.log({ codigo_temp })

        if (codigo_temp) {
            formData.append("codigo_temp", codigo_temp)
        }

        console.log({ formData })

        if (params) {
            const { id_descansomedico, id_documento } = params
            uri += `?id_descansomedico=${id_descansomedico}&id_documento=${id_documento}`

            response = await apiClient.patch(uri, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        } else {
            response = await apiClient.post(uri, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }

        console.log({ uri })

        console.log({ response })

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

export const viewFile = async (id: string): Promise<responseViewFile> => {
    try {
        const urlApi = `${'/adjuntos/'}${id}`

        const response = await apiClient.get(urlApi, {
            responseType: 'blob'
        })

        const fileUrl = URL.createObjectURL(response.data)

        return {
            result: true,
            data: { url: fileUrl },
            message: 'Archivo obtenido con éxito',
            status: 200
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, status: 500 }
    }
}