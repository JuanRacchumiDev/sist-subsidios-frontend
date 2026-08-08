import { DescansoMedico } from '../interfaces/IDescansoMedico'
import {
    getAll,
    getById,
    getAllPaginate,
    getAllForReports,
    create,
    update
} from '../repositories/descansoMedicoRepository'

export const getDescansos = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getDescansosPaginate = async (
    page: number,
    limit: number,
    filters: {}
) => {
    console.log('---- filters in descansoMedicoService ----')
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

export const getDescansosForReport = async (tipo: string,) => {
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