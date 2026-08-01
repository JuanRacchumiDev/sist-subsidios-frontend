import { Reembolso } from '../interfaces/IReembolso'
import {
    getAll,
    getById,
    getAllPaginate,
    create,
    update
} from '../repositories/reembolsoRepository'

export const getReembolsos = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getReembolsosPaginate = async (page: number, limit: number) => {
    const response = await getAllPaginate(page, limit)

    return {
        ...response
    }
}

export const getReembolsoById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const createReembolso = async (payload: Reembolso) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updateReembolso = async (id: string, payload: Reembolso) => {
    const response = await update(id, payload)

    return {
        ...response
    }
}