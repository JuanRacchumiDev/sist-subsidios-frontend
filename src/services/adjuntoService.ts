import { Adjunto } from '../interfaces/IAdjunto'
import { TipoAdjunto } from '../interfaces/ITipoAdjunto'
import { responseViewFile } from '../types/TFile';
import {
    getAll,
    getById,
    create,
    update,
    getAllPaginate,
    upload,
    viewFile
} from '../repositories/adjuntoRepository'
import { getByNombre } from '../repositories/tipoAdjuntoRepository'

export const getAdjuntos = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getAdjuntosPaginate = async (page: number, limit: number) => {
    const response = await getAllPaginate(page, limit)

    return {
        ...response
    }
}

export const getAdjuntoById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}

export const createAdjunto = async (payload: Adjunto) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updateAdjunto = async (id: string, payload: Adjunto) => {
    const response = await update(id, payload)

    return {
        ...response
    }
}

export const uploadAdjunto = async (params: Adjunto = {}, formData: FormData) => {
    const hasParams = params && Object.keys(params).length > 0

    console.log(hasParams ? "Modo: Actualización (PATCH)" : "Modo: Creación (POST)")

    const responseTipoAdjunto = await getByNombre("GENERAL");

    console.log({ responseTipoAdjunto })

    const { data } = responseTipoAdjunto

    const dataTipoAdjunto = data as TipoAdjunto

    const { id } = dataTipoAdjunto

    if (id) {
        formData.append("id_tipoadjunto", id)
    }

    console.log('---- params in adjuntoService ----')
    console.log({ params })

    console.log('---- uploadAdjunto in adjuntoService ----')
    console.log({ formData })

    const response = await upload(params, formData)

    return {
        ...response
    }
}

export const viewAdjunto = async (id: string): Promise<responseViewFile> => {
    const response = await viewFile(id)

    return {
        ...response
    }
}