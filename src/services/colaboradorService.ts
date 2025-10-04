import { Colaborador, ColaboradorFilter } from '../interfaces/IColaborador'
import {
    getAll,
    getById,
    getByIdTipoDocAndNumcDoc,
    getAllByIdEmpresa,
    getAllWithPaginate,
    create
} from '../repositories/colaboradorRepository'

export const getColaboradores = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getColaboradoresWithPaginate = async (
    page: number,
    limit: number,
    filters: ColaboradorFilter = {}
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
