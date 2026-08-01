import {
    getAll,
    getAllPaginate,
    getByCodigo,
    create,
    update,
    updateEstado
} from '../repositories/diagnosticoRepository'
import { Diagnostico } from '../interfaces/IDiagnostico'

export const getDiagnosticos = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getDiagnosticosPaginate = async (
    page: number,
    limit: number,
    filter: string
) => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        filter: filter
    }).toString()

    const response = await getAllPaginate(queryParams)

    return {
        ...response
    }
}

export const getDiagnosticoByCodigo = async (codigo: string) => {
    const response = await getByCodigo(codigo)

    return {
        ...response
    }
}

export const createDiagnostico = async (payload: Diagnostico) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updateDiagnostico = async (id: string, payload: Diagnostico) => {
    const response = await update(id, payload)

    return {
        ...response
    }
}

export const updateDiagnosticoByEstado = async (id: string, payload: Diagnostico) => {
    const response = await updateEstado(id, payload)

    return {
        ...response
    }
}