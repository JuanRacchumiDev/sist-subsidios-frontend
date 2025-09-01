import { TrabajadorSocial } from '../interfaces/ITrabajadorSocial'
import {
    getAll,
    getById,
    getByIdTipoDocAndNumDoc,
    create
} from '../repositories/trabajadorSocialRepository'

export const getTrabajadoresSociales = async () => {
    const response = await getAll()

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