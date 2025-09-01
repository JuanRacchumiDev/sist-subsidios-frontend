import apiClient from "./apiClient"
import { Empresa, EmpresaResponse } from "../interfaces/IEmpresa"

export const getAll = async (): Promise<EmpresaResponse> => {
    try {
        const response = await apiClient.get('/empresas')
        const { data: dataEmpresas } = response

        const { result, data, status, message, error } = dataEmpresas

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

export const getAllWithPaginate = async (page: number, limit: number) => {
    try {
        const urlApi = `${'/empresas/paginate?page='}${page}${'&limit='}${limit}`
        const response = await apiClient.get(urlApi)
        const { data: dataEmpresas } = response

        const { result, data, pagination, status } = dataEmpresas

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

export const getById = async (id: string): Promise<EmpresaResponse> => {
    try {
        const urlApi = `${'/empresas/'}${id}`
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

export const create = async (payload: Empresa): Promise<EmpresaResponse> => {
    try {
        const response = await apiClient.post('/empresas', payload)

        const { result, data, status, message, error } = response as EmpresaResponse

        return {
            result,
            data,
            status,
            message,
            error
        }
    } catch (error) {
        // if (error.response) {
        //     throw new Error(error.response.data.message || 'Error al crear empresa')
        // }
        // throw new Error('Error de conexión con el servidor')
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}