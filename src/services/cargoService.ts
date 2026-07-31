import { Cargo, CargoPaginateResponse } from '../interfaces/ICargo'
import {
    getAll,
    getById,
    create,
    update,
    getAllPaginate,
    updateEstado
} from '../repositories/cargoRepository'

export const getCargos = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getCargosPaginate = async (
    page: number,
    limit: number,
    filters: {}
): Promise<CargoPaginateResponse> => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value)
        )
    }).toString()

    console.log({ queryParams })

    const response = await getAllPaginate(queryParams)

    console.log({ response })

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

export const updateCargoByEstado = async (id: string, payload: Cargo) => {
    const response = await updateEstado(id, payload)

    return {
        ...response
    }
}