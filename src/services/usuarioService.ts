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
    const params: any = {
        page: page.toString(),
        limit: limit.toString()
    };

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== undefined && value !== "") {
            params[key] = value
        }
    })

    const queryParams = new URLSearchParams(params).toString()

    console.log({ queryParams })

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