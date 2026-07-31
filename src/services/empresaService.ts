import { Empresa } from '../interfaces/IEmpresa'
import {
    getAll,
    getById,
    getByRazonSocial,
    create,
    getAllPaginate,
    updateEstado
} from '../repositories/empresaRepository'

export const getEmpresas = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getEmpresasPaginate = async (
    page: number,
    limit: number,
    filters: {}
) => {
    console.log({ page })
    console.log({ limit })
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

export const getEmpresaById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const getEmpresaByRazonSocial = async (razonSocial: string) => {

    const response = await getByRazonSocial(razonSocial)

    console.log('---- getEmpresaByRazonSocial ----')

    console.log({ response })

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