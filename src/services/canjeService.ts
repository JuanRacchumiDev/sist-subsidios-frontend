import { Canje, CanjeFilter } from '../interfaces/ICanje'
import {
    getAll,
    getById,
    getAllPaginate,
    getAllForReports,
    create,
    update
} from '../repositories/canjeRepository'

export const getCanjes = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getCanjesPaginate = async (
    page: number,
    limit: number,
    filters: {}
) => {
    console.log('---- filters in canjeService ----')
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

export const getCanjesForReport = async (outputType: string, reportType: string, limit: number) => {
    const response = await getAllForReports(outputType, reportType, limit)

    return response
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