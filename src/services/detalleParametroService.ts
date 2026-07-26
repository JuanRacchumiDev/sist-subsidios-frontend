import { Detalle } from '../interfaces/IDetalleParametro'
import { ParametroClase } from '../constants/parametroClase'
import {
    getAll,
    getById,
    getAllWithPaginate,
    create,
    update
} from '../repositories/detalleParametroRepository'

export const getDetalles = async (
    clase: number,
    estado: boolean,
    // enPersona: boolean
) => {
    const queryParams = new URLSearchParams({
        clase: clase.toString(),
        estado: (estado) ? "true" : "false",
        // enPersona: (enPersona) ? "true" : "false"
    }).toString()

    const response = await getAll(queryParams)

    return {
        ...response
    }
}

export const getDetallesWithPaginate = async (
    clase: ParametroClase,
    page: number,
    limit: number,
    filter: string | Record<string, any>
) => {
    const filterValue = typeof filter === 'object'
        ? JSON.stringify(filter)
        : filter

    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        filter: filterValue
    }).toString()

    const response = await getAllWithPaginate(clase, queryParams)
    console.log('---- detalleParametroService getDetallesWithPaginate ----')
    console.log({ response })

    return {
        ...response
    }
}

export const getDetalleById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const createDetalle = async (payload: Detalle) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updateDetalle = async (id: string, payload: Detalle) => {
    const response = await update(id, payload)
    console.log('---- response updateDetalle detalleParametroService ----')
    console.log({ response })

    return {
        ...response
    }
}