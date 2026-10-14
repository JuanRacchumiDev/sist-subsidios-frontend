import { Usuario, UsuarioPaginateResponse } from '../interfaces/IUsuario'
import {
    getAll,
    getById,
    create,
    update,
    getAllPaginate,
    updateEstado
} from '../repositories/usuarioRepository'

export const getUsuarios = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getUsuariosPaginate = async (
    page: number,
    limit: number,
    filters: {}
): Promise<UsuarioPaginateResponse> => {
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