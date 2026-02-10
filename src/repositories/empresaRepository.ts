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

export const getAllWithPaginate = async (queryParams: string) => {
    try {
        // const urlApi = `${'/empresas/paginate?page='}${page}${'&limit='}${limit}`
        const urlApi = `${'/empresas/paginate?'}${queryParams}`
        // console.log({ urlApi })
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

export const getByRazonSocial = async (razonSocial: string): Promise<EmpresaResponse> => {
    try {
        const urlApi = `${'/empresas/consulta-razon-social?razonSocial='}${razonSocial}`

        const response = await apiClient.get(urlApi)

        console.log('---- empresaRepository getByRazonSocial ----')

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

export const updateEstado = async (id: string, payload: Empresa): Promise<EmpresaResponse> => {
    try {
        const urlApi = `${'/empresas/update-estado/'}${id}`

        const response = await apiClient.patch(urlApi, payload)

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
        return { result: false, error: errorMessage, status: 500 }
    }
}