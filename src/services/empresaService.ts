import { Empresa } from '../interfaces/IEmpresa'
import {
    getAll,
    getById,
    create,
    getAllWithPaginate,
    updateEstado
} from '../repositories/empresaRepository'

export const getEmpresas = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getEmpresasWithPaginate = async (
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

export const getEmpresaById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const createEmpresa = async (payload: Empresa) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updateEmpresaByEstado = async (id: string, payload: Empresa) => {
    const response = await updateEstado(id, payload)

    return {
        ...response
    }
}