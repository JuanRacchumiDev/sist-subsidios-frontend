import {
    getAll,
    getById,
    getByNombre
} from '../repositories/tipoAdjuntoRepository'

export const getTipoAdjuntos = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getTipoAdjuntoById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const getTipoAdjuntoByNombre = async (nombre: string) => {
    const response = await getByNombre(nombre)

    return {
        ...response
    }
}