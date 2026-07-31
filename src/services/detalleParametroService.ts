import { Detalle, DetallePaginateResponse } from '../interfaces/IDetalleParametro'
import { ParametroClase } from '../constants/parametroClase'
import {
    getAll,
    getById,
    getAllPaginate,
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

export const getDetallesPaginate = async (
    page: number,
    limit: number,
    filters: {}
): Promise<DetallePaginateResponse> => {

    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value)
        )
    }).toString()

    console.log({ queryParams })

    const response = await getAllPaginate(queryParams)
    console.log('---- detalleParametroService getDetallePaginate ----')
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