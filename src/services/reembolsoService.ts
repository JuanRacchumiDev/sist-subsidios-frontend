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

export const getReembolsosPaginate = async (
    page: number,
    limit: number,
    filters: {}
) => {
    console.log('---- filters in reembolsoService ----')
    console.log({ filters })

    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value)
        )
    }).toString()

    console.log({ queryParams })

    const response = await getAllPaginate(queryParams)

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