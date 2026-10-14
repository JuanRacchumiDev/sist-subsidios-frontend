import { Configuracion } from '../interfaces/IConfiguracion'
import {
    getAll,
    getAllPaginate,
    getById,
    create,
    update
} from '../repositories/configuracionRepository'

export const getConfiguraciones = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getConfiguracionesPaginate = async (
    page: number,
    limit: number,
    filters: {}
) => {
    console.log('---- filters in configuracionService ----')
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

export const getConfiguracionById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const createConfiguracion = async (payload: Configuracion) => {
    console.log('---- payload configuracionService ----')
    console.log({ payload })

    const response = await create(payload)

    return {
        ...response
    }
}

export const updateConfiguracion = async (id: string, payload: Configuracion) => {
    const response = await update(id, payload)

    return {
        ...response
    }
}