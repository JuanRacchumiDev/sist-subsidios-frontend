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

export const getAllWithPaginate = async (page: number, limit: number) => {
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
        const response = await apiClient.put(urlApi, payload)
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

export const upload = async (formData: FormData): Promise<AdjuntoResponse> => {
    try {

        // Añadiendo tipo adjunto a formData
        const tipoAdjunto = "ab55a4f1-b5aa-4ac6-a14f-f27ac1a4ad84";

        formData.append("id_tipoadjunto", tipoAdjunto)

        // Obteniendo el código temporal del usuario autenticado
        const auth = localStorage.getItem("auth") || null

        if (auth) {

            const authJson = JSON.parse(auth)

            const { codigoTemp } = authJson

            formData.append("codigo_temp", codigoTemp)
        }

        const response = await apiClient.post('/adjuntos', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

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

        // const { data: { result, data, message, error, status } } = response

        // return {
        //     result,
        //     data,
        //     message,
        //     error,
        //     status
        // }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, status: 500 }
    }
}