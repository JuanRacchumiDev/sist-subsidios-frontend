import { DescansoMedico } from '../interfaces/IDescansoMedico'
import {
    getAll,
    getById,
    getAllWithPaginate,
    getAllByColaboradorPaginate,
    getAllForReports,
    create,
    update
} from '../repositories/descansoMedicoRepository'
import { DescansoMedicoFilter } from '../interfaces/IDescansoMedico'

export const getDescansos = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getDescansosWithPaginate = async (
    page: number,
    limit: number,
    filters: DescansoMedicoFilter = {}
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

export const getDescansosByColaboradorWithPaginate = async (
    idColaborador: string,
    page: number,
    limit: number,
    filters: DescansoMedicoFilter = {}
) => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value)
        )
    }).toString()

    // const response = await getAllByColaboradorPaginate(idColaborador, page, limit)
    const response = await getAllByColaboradorPaginate(idColaborador, queryParams)

    return {
        ...response
    }
}

export const getDescansosForReport = async (tipo: string) => {
    const response = await getAllForReports(tipo)

    return response
}

export const getDescansoById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const createDescanso = async (payload: DescansoMedico) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updateDescanso = async (id: string, payload: DescansoMedico) => {
    const response = await update(id, payload)

    return {
        ...response
    }
}