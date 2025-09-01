import { Persona } from '../interfaces/IPersona'
import {
    getAll,
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