import { Usuario, UsuarioFilter } from '../interfaces/IUsuario'
import {
    getAll,
    getById,
    create,
    update,
    getAllWithPaginate,
    updateEstado
} from '../repositories/usuarioRepository'

export const getUsuarios = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getUsuariosWithPaginate = async (
    page: number,
    limit: number,
    filters: UsuarioFilter = {}
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

export const updateUsuarioByEstado = async (id: string, payload: Usuario) => {
    const response = await updateEstado(id, payload)

    return {
        ...response
    }
}