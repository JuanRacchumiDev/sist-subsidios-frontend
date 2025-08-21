import apiClient from "./apiClient"
import { Empresa, EmpresaResponse } from "../interfaces/IEmpresa"

export const getAll = async (): Promise<EmpresaResponse> => {
    try {
        const response = await apiClient.get('/empresas')
        console.log('response getEmpresas', response)

        const { data: { result, data, status, message, error } } = response

        return {
            result,
            data,
            status,
            message,
            error
        }
    } catch (error) {
        // if (error.response) {
        //     throw new Error(error.response.data.message || 'Error al obtener empresas')
        // }
        // throw new Error('Error de conexión con el servidor')
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const create = async (payload: Empresa): Promise<EmpresaResponse> => {
    try {
        const response = await apiClient.post('/empresas', payload)
        // console.log('response createEmpresa', response)

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