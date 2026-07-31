import { DocumentoTipoContingencia, DocumentoTipoContingenciaFilter } from '../interfaces/IDocumentoTipoContingencia'
import {
    getAll,
    getById,
    getAllPaginate,
    create,
    update,
    updateEstado
} from '../repositories/documentoTCRepository'

export const getDocumentosTipoCont = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getDocumentosTipoContPaginate = async (
    page: number,
    limit: number,
    filters: {}
) => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value)
        )
    }).toString()

    console.log({ queryParams })

    const response = await getAllPaginate(queryParams)

    console.log({ response })

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

export const updateDocumentoTipoContByEstado = async (id: string, payload: DocumentoTipoContingencia) => {
    const response = await updateEstado(id, payload)

    return {
        ...response
    }
}