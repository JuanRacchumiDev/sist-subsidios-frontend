import { Persona, PersonaFilter } from '../interfaces/IPersona'
import {
    getAll,
    getAllWithPaginate,
    getAllByEmpresa,
    getAllByEmpresaWithGrupo,
    getById,
    getByIdTipoDocAndNumDoc,
    create,
    update
} from '../repositories/personaRepository'
import { searchForTipoDocAndNumDoc } from '../repositories/apiPersonaRepository'
// import { getAllWithPaginate } from '../repositories/detalleParametroRepository';

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
) => {
    // Construir la cadena de query parameters
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value)
        )
    }).toString()

    // const response = await getAllWithPaginate(page, limit)
    const response = await getAllWithPaginate(queryParams)

    return {
        ...response
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

    // const response = await getAllWithPaginate(page, limit)
    const response = await getAllByEmpresaWithGrupo(queryParams)

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
    // Validando si la persona se encuentra registrada
    const responsePersona = await getByIdTipoDocAndNumDoc(idTipoDoc, numDoc)

    const { result, message, data } = responsePersona

    if (result && data) {
        return {
            result,
            data,
            message
        }
    }

    // Registrando una nueva persona
    const responseApiPersona = await searchForTipoDocAndNumDoc(idTipoDoc, numDoc)

    return {
        ...responseApiPersona
    }

    // const { data: dataResponseApi } = responseApiPersona

    // const { result: resultApiPersona, data: dataApiPersona, message: messageApiPersona } = dataResponseApi as PersonaResponse

    // return {
    //     result: resultApiPersona,
    //     data: dataApiPersona,
    //     message: messageApiPersona
    // }
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