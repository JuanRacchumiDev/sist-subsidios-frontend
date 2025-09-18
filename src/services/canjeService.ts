import { Canje } from '../interfaces/ICanje'
import {
    getAll,
    getById,
    getAllWithPaginate
} from '../repositories/canjeRepository'

export const getCanjes = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getCanjesWithPaginate = async (page: number, limit: number) => {
    const response = await getAllWithPaginate(page, limit)

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