import { getAll, getById } from '../repositories/tipoDocumentoRepository'

export const getTipoDocumentos = async () => {
    const response = await getAll()
    console.log('serviceResponse tipodocumento', response)
    return {
        ...response
    }
}

export const getTipoDocumentoById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}