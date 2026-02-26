import { DescansoMedico } from '../interfaces/IDescansoMedico'
import {
    getAll,
    getById,
    getAllWithPaginate,
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