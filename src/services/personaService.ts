import { Persona, PersonaFilter, PersonaPaginateResponse } from '../interfaces/IPersona'
import {
    getAll,
    getAllNoUsuarios,
    getAllPaginate,
    getAllByEmpresa,
    getAllByEmpresaWithGrupo,
    getByEmpresaWithGrupo,
    getById,
    getByIdTipoDocAndNumDoc,
    create,
    update
} from '../repositories/personaRepository'
import { searchForTipoDocAndNumDoc } from '../repositories/apiPersonaRepository'

export const getPersonas = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getPersonasNoUsuarios = async () => {
    const response = await getAllNoUsuarios()

    return {
        ...response
    }
}

export const getPersonasPaginate = async (
    page: number,
    limit: number,
    filters: {}
): Promise<PersonaPaginateResponse> => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...Object.fromEntries(
                Object.entries(filters).filter(([, value]) => value)
            )
        }).toString()

        console.log({ queryParams })

        const response = await getAllPaginate(queryParams)

        console.log({ response })

        return {
            ...response
        }
    } catch (error) {
        console.error("Error en service getPersonasPaginate:", error);
        throw error;
    }
}

export const getPersonasByEmpresa = async (idEmpresa: string) => {
    const response = await getAllByEmpresa(idEmpresa)

    return {
        ...response
    }
}

export const getPersonasByEmpresaWithGrupo = async (
    idEmpresa: string,
    nombreGrupo: string
) => {
    const queryParams = new URLSearchParams({
        idEmpresa,
        nombreGrupo
    }).toString()

    const response = await getAllByEmpresaWithGrupo(queryParams)

    return {
        ...response
    }
}

export const getPersonaByEmpresaWithGrupo = async (
    idEmpresa: string,
    nombreGrupo: string
) => {
    const queryParams = new URLSearchParams({
        idEmpresa,
        nombreGrupo
    }).toString()

    const response = await getByEmpresaWithGrupo(queryParams)

    return {
        ...response
    }
}

export const getPersonaById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const getPersonaByIdTipoDocAndNumDoc = async (idTipoDoc: string, numDoc: string) => {
    const responsePersona = await getByIdTipoDocAndNumDoc(idTipoDoc, numDoc)

    const { result, message, data } = responsePersona

    if (result && data) {
        return {
            result,
            data,
            message
        }
    }

    const responseApiPersona = await searchForTipoDocAndNumDoc(idTipoDoc, numDoc)

    return {
        ...responseApiPersona
    }
}

export const createPersona = async (payload: Persona) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updatePersona = async (id: string, payload: Persona) => {
    const response = await update(id, payload)

    return {
        ...response
    }
}