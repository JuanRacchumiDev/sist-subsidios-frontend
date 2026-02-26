import { TrabajadorSocial, TrabajadorSocialFilter } from '../interfaces/ITrabajadorSocial'
import {
    getAll,
    getById,
    getByIdTipoDocAndNumDoc,
    getAllWithPaginate,
    create,
    updateEstado
} from '../repositories/trabajadorSocialRepository'

export const getTrabajadoresSociales = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getTrabjadoresSocialesWithPaginate = async (
    page: number,
    limit: number,
    filters: TrabajadorSocialFilter = {}
) => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value)
        )
    }).toString()

    const response = await getAllWithPaginate(queryParams)

    return {
        ...response
    }
}

export const getTrabajadorSocialById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const getTrabSocialByIdTipoDocAndNumDoc = async (idTipoDoc: string, numDoc: string) => {
    const response = await getByIdTipoDocAndNumDoc(idTipoDoc, numDoc)

    return {
        ...response
    }
}

export const createTrabajadorSocial = async (payload: TrabajadorSocial) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updateTrabajadorSocialByEstado = async (id: string, payload: TrabajadorSocial) => {
    const response = await updateEstado(id, payload)

    return {
        ...response
    }
}
