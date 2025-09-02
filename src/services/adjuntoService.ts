import { Adjunto } from '../interfaces/IAdjunto'
import {
    getAll,
    getById,
    create,
    update,
    getAllWithPaginate,
    upload
} from '../repositories/adjuntoRepository'

export const getAdjuntos = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getAdjuntosWithPaginate = async (page: number, limit: number) => {
    const response = await getAllWithPaginate(page, limit)

    return {
        ...response
    }
}

export const getAdjuntoById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const createAdjunto = async (payload: Adjunto) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updateAdjunto = async (id: string, payload: Adjunto) => {
    const response = await update(id, payload)

    return {
        ...response
    }
}

export const uploadAdjunto = async (formData: FormData) => {
    const response = await upload(formData)

    return {
        ...response
    }
}