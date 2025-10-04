import { Cargo } from '../interfaces/ICargo'
import {
    getAll,
    getById,
    create,
    update,
    getAllWithPaginate
} from '../repositories/cargoRepository'

export const getCargos = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getCargosWithPaginate = async (
    page: number,
    limit: number,
    filter: string
) => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        filter: filter
    }).toString()

    const response = await getAllWithPaginate(queryParams)

    return {
        ...response
    }
}

export const getCargoById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const createCargo = async (payload: Cargo) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updateCargo = async (id: string, payload: Cargo) => {
    const response = await update(id, payload)

    return {
        ...response
    }
}