import { Colaborador, ColaboradorFilter } from '../interfaces/IColaborador'
import {
    getAll,
    getById,
    getByIdTipoDocAndNumcDoc,
    getAllByIdEmpresa,
    getAllPaginate,
    create,
    updateEstado
} from '../repositories/colaboradorRepository'

export const getColaboradores = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getColaboradoresPaginate = async (
    page: number,
    limit: number,
    filters: ColaboradorFilter = {}
) => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value)
        )
    }).toString()

    const response = await getAllPaginate(queryParams)

    return {
        ...response
    }
}

export const getColaboradorById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const getColaboradorByIdTipoDocAndNumDoc = async (idTipoDoc: string, numDoc: string) => {
    const response = await getByIdTipoDocAndNumcDoc(idTipoDoc, numDoc)

    return {
        ...response
    }
}

export const getColaboradoresByIdEmpresa = async (idEmpresa: string) => {
    const response = await getAllByIdEmpresa(idEmpresa)

    return {
        ...response
    }
}

export const createColaborador = async (payload: Colaborador) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updateColaboradorByEstado = async (id: string, payload: Colaborador) => {
    const response = await updateEstado(id, payload)

    return {
        ...response
    }
}
