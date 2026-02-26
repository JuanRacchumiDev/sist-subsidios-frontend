import { Canje, CanjeFilter } from '../interfaces/ICanje'
import {
    getAll,
    getById,
    getAllWithPaginate,
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

export const getCanjesWithPaginate = async (
    page: number,
    limit: number,
    filters: CanjeFilter = {}
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