import { Cobro } from '@/interfaces/ICobro'
import {
    getAll,
    getById,
    getAllWithPaginate,
    create,
    update
} from '../repositories/cobroRepository'

export const getCobros = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getCobrosWithPaginate = async (page: number, limit: number) => {
    const response = await getAllWithPaginate(page, limit)

    return {
        ...response
    }
}

export const getCobroById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const createCobro = async (payload: Cobro) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updateCobro = async (id: string, payload: Cobro) => {
    const response = await update(id, payload)

    return {
        ...response
    }
}