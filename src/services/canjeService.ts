import { Canje, CanjeFilter } from '@/interfaces/ICanje'
import {
    getAll,
    getById,
    getAllWithPaginate,
    create,
    update
} from '../repositories/canjeRepository'

export const getCanjes = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getCanjesWithPaginate = async (
    page: number,
    limit: number,
    filters: CanjeFilter = {}
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

export const getCanjeById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const createCanje = async (payload: Canje) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updateCanje = async (id: string, payload: Canje) => {
    const response = await update(id, payload)

    return {
        ...response
    }
}