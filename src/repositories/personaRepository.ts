import apiClient from "./apiClient";
import { Persona, PersonaResponse } from "../interfaces/IPersona";

export const getAll = async (): Promise<PersonaResponse> => {
    try {
        const response = await apiClient.get('/personas')

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

export const getAllNoUsuarios = async (): Promise<PersonaResponse> => {
    try {
        const response = await apiClient.get('/personas/no-usuarios')

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

export const getAllPaginate = async (queryParams: string) => {
    try {
        const urlApi = `/personas/buscar-por-grupo/paginate?${queryParams}`
        console.log({ urlApi })

        const response = await apiClient.get(urlApi)

        console.log({ response })

        const { data: { result, data, pagination, status, message } } = response

        return {
            result,
            data,
            message,
            pagination,
            status
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const getAllByEmpresa = async (idEmpresa: string): Promise<PersonaResponse> => {
    try {
        const urlApi = `${'/personas/empresa/'}${idEmpresa}`
        console.log({ urlApi })
        const response = await apiClient.get(urlApi)
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

export const getByEmpresaWithGrupo = async (queryParams: string) => {
    try {
        const urlApi = `${'/personas/buscar-unico?'}${queryParams}`
        console.log({ urlApi })

        const response = await apiClient.get(urlApi)

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

export const getAllByEmpresaWithGrupo = async (queryParams: string) => {
    try {
        const urlApi = `${'/personas/buscar-por-empresa-por-grupo?'}${queryParams}`
        console.log({ urlApi })

        const response = await apiClient.get(urlApi)

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

export const getById = async (id: string): Promise<PersonaResponse> => {
    try {
        const urlApi = `${'/personas/'}${id}`
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

export const getByIdTipoDocAndNumDoc = async (idTipoDoc: string, numDoc: string): Promise<PersonaResponse> => {
    try {
        const urlApi = `${'/personas/buscar-por-tipodoc-numdoc?idTipoDoc='}${idTipoDoc}${'&numDoc='}${numDoc}`
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

export const create = async (payload: Persona): Promise<PersonaResponse> => {
    try {
        const response = await apiClient.post('/personas', payload)

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

export const update = async (id: string, payload: Persona): Promise<PersonaResponse> => {
    try {
        const urlApi = `${'/personas/'}${id}`
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