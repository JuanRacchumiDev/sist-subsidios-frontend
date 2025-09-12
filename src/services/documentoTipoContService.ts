import { DocumentoTipoContingencia } from '../interfaces/IDocumentoTipoContingencia'
import {
    getAll,
    getById,
    getAllWithPaginate,
    create,
    update
} from '../repositories/documentoTCRepository'

export const getDocumentosTipoCont = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getDocumentosTipoContWithPaginate = async (page: number, limit: number) => {
    const response = await getAllWithPaginate(page, limit)

    return {
        ...response
    }
}

export const getDocumentoTipoContById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const createDocumentoTipoCont = async (payload: DocumentoTipoContingencia) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updateDocumentoTipoCont = async (id: string, payload: DocumentoTipoContingencia) => {
    const response = await update(id, payload)

    return {
        ...response
    }
}