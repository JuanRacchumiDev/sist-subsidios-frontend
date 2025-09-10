import { Usuario } from '../interfaces/IUsuario'
import {
    getAll,
    getById,
    create,
    update,
    getAllWithPaginate
} from '../repositories/usuarioRepository'

export const getUsuarios = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getUsuariosWithPaginate = async (page: number, limit: number) => {
    const response = await getAllWithPaginate(page, limit)

    return {
        ...response
    }
}

export const getUsuarioById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const createUsuario = async (payload: Usuario) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updateUsuario = async (id: string, payload: Usuario) => {
    const response = await update(id, payload)

    return {
        ...response
    }
}
