import { getAll, getById } from '../repositories/tipoContingenciaRepository'

export const getTipoContingencias = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getTipoContingenciaById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}