import { Empresa } from '../interfaces/IEmpresa'
import {
    getAll,
    create
} from '../repositories/empresaRepository'

export const getEmpresas = async () => {
    const response = await getAll()

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
