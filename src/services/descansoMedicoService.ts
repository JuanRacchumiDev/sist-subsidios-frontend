import { DescansoMedico } from '../interfaces/IDescansoMedico'
import {
    getAll,
    getById,
    getAllWithPaginate,
    getAllByColaboradorPaginate,
    create,
    update
} from '../repositories/descansoMedicoRepository'

export const getDescansos = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getDescansosWithPaginate = async (page: number, limit: number) => {
    const response = await getAllWithPaginate(page, limit)

    return {
        ...response
    }
}

export const getDescansosByColaboradorWithPaginate = async (idColaborador: string, page: number, limit: number) => {
    const response = await getAllByColaboradorPaginate(idColaborador, page, limit)

    return {
        ...response
    }
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