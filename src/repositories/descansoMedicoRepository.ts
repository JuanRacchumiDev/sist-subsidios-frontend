import apiClient from "./apiClient"
import { DescansoMedico, DescansoMedicoResponse } from '../interfaces/IDescansoMedico'
import { AuthData } from "../interfaces/IAuth"

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

export const getAllWithPaginate = async (queryParams: string) => {
    try {
        const urlApi = `${'/descansos/paginate?'}${queryParams}`

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

export const getAllByColaboradorPaginate = async (idColaborador: string, queryParams: string) => {
    try {
        const urlApi = `${'/descansos/colaborador/paginate?idColaborador='}${idColaborador}${'&'}${queryParams}`

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

export const getAllForReports = async (tipo: string) => {
    try {
        const urlApi = `${'/descansos/reportes/subsidiados?tipo='}${tipo}`

        console.log({ urlApi })

        const response = await apiClient.get(urlApi, {
            responseType: 'blob'
        })

        return {
            result: true,
            data: response.data,
            status: response.status,
            message: "Reporte generado correctamente"
        };
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
        const codigo_temp = localStorage.getItem("codigo_temp") || null

        const auth = localStorage.getItem("auth")

        const authData = auth ? (JSON.parse(auth) as AuthData) : null

        if (codigo_temp) {
            payload.codigo_temp = codigo_temp
        }

        if (authData) {
            const { usuario: { id_usuario, nombre_perfil_url } } = authData
            payload.id_usuario = id_usuario
            payload.nombre_perfil_url = nombre_perfil_url
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