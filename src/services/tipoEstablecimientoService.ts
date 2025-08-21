import { getAll, getById } from '../repositories/tipoEstablecimientoRepository'

export const getTipoEstablecimientos = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getTipoEstablecimientoById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}