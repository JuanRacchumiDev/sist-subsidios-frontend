import apiClient from "./apiClient"
import { Colaborador, ColaboradorResponse } from "../interfaces/IColaborador"

export const getAll = async (): Promise<ColaboradorResponse> => {
    try {
        const response = await apiClient.get('/colaboradores')

        const { data: { result, message, data, error, status } } = response

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

export const getAllWithPaginate = async (page: number, limit: number) => {
    try {
        const urlApi = `${'/colaboradores/paginate?page='}${page}${'&limit='}${limit}`
        const response = await apiClient.get(urlApi)
        const { data: dataColaboradores } = response

        const { result, data, pagination, status } = dataColaboradores

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

export const getById = async (id: string): Promise<ColaboradorResponse> => {
    try {
        const urlApi = `${'/colaboradores/'}${id}`
        const response = await apiClient.get(urlApi)
        const { data: { result, message, data, error, status } } = response
        return {
            result,
            message,
            data,
            error,
            status
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const getByIdTipoDocAndNumcDoc = async (idTipoDoc: string, numDoc: string): Promise<ColaboradorResponse> => {
    const urlApi = `${'/colaboradores/buscar-por-tipodoc-numdoc?idTipoDoc='}${idTipoDoc}${'&numDoc='}${numDoc}`

    const response = await apiClient.get(urlApi)

    const { data: { result, message, data, error, status } } = response

    return {
        result,
        message,
        data,
        error,
        status
    }
}

export const getAllByIdEmpresa = async (idEmpresa: string): Promise<ColaboradorResponse> => {
    const urlApi = `${'/colaboradores/buscar-por-empresa?idEmpresa='}${idEmpresa}`

    const response = await apiClient.get(urlApi)

    const { data: { result, message, data, error, status } } = response

    return {
        result,
        message,
        data,
        error,
        status
    }
}

export const create = async (payload: Colaborador): Promise<ColaboradorResponse> => {
    try {
        const response = await apiClient.post('/colaboradores', payload)

        const { data: { result, data, status, message } } = response

        return {
            result,
            data,
            status,
            message
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const update = async (id: string, payload: Colaborador): Promise<ColaboradorResponse> => {
    try {
        const urlApi = `${'/colaboradores/'}${id}`
        const response = await apiClient.put(urlApi, payload)
        console.log('response update colaborador', response)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}