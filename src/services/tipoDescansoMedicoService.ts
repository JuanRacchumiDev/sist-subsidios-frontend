import { getAll, getById } from '../repositories/tipoDescansoMedicosRepository'

export const getTipoDescansosMedicos = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getTipoDescansoById = async (id: string) => {
    const response = await getById(id)

    return {
        ...response
    }
}