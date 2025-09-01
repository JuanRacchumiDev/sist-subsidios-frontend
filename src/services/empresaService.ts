import { Empresa } from '../interfaces/IEmpresa'
import {
    getAll,
    getById,
    create,
    getAllWithPaginate
} from '../repositories/empresaRepository'

export const getEmpresas = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getEmpresasWithPaginate = async (page: number, limit: number) => {
    const response = await getAllWithPaginate(page, limit)

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
