import { Persona, PersonaFilter, PersonaPaginateResponse } from '../interfaces/IPersona'
import {
    getAll,
    getAllWithPaginate,
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

export const getPersonasWithPaginate = async (
    page: number,
    limit: number,
    filters: PersonaFilter = {}
): Promise<PersonaPaginateResponse> => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        })

        console.log({ params })

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value.toString());
            }
        });

        const response = await getAllWithPaginate(params.toString())

        return {
            ...response
        }
    } catch (error) {
        console.error("Error en service getPersonasWithPaginate:", error);
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