import apiClient from "./apiClient"
import { DescansoMedico, DescansoMedicoResponse } from '../interfaces/IDescansoMedico'

export const getAll = async (): Promise<DescansoMedicoResponse> => {
    try {
        const response = await apiClient.get('/descansos')
        const { data: dataDescansos } = response
        const { result, data, message, status, error } = dataDescansos

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
        const urlApi = `${'/descansos/paginate?page='}${page}${'&limit='}${limit}`
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

export const getAllByColaboradorPaginate = async (idColaborador: string, page: number, limit: number) => {
    try {
        const urlApi = `${'/descansos/colaborador/paginate?idColaborador='}${idColaborador}${'&page='}${page}${'&limit='}${limit}`
        console.log('urlApi getAllByColaboradorPaginate', urlApi)
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

export const getById = async (id: string): Promise<DescansoMedicoResponse> => {
    try {
        const urlApi = `${'/descansos/'}${id}`
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

export const create = async (payload: DescansoMedico): Promise<DescansoMedicoResponse> => {
    try {
        // Obteniendo el código temporal del usuario autenticado
        const auth = localStorage.getItem("auth") || null

        if (auth) {

            const authJson = JSON.parse(auth)

            const { codigo_temp } = authJson

            payload.codigo_temp = codigo_temp
        }

        const response = await apiClient.post('/descansos', payload)

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

export const update = async (id: string, payload: DescansoMedico): Promise<DescansoMedicoResponse> => {
    try {
        const urlApi = `${'/descansos/'}${id}`
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