import { Perfil } from '../interfaces/IPerfil'
import {
    getAll,
    getById,
    create,
    update,
    getAllWithPaginate
} from '../repositories/perfilRepository'

export const getPerfiles = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getPerfilesWithPaginate = async (page: number, limit: number) => {
    const response = await getAllWithPaginate(page, limit)

    return {
        ...response
    }
}

export const getPerfilById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const createPerfil = async (payload: Perfil) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updatePerfil = async (id: string, payload: Perfil) => {
    const response = await update(id, payload)

    return {
        ...response
    }
}
