import { Colaborador } from '../interfaces/IColaborador'
import {
    getAll,
    getById,
    getByIdTipoDocAndNumcDoc,
    getAllByIdEmpresa,
    create
} from '../repositories/colaboradorRepository'

export const getColaboradores = async () => {
    const response = await getAll()

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
    console.log('colaboradorService getColaboradorByIdTipoDocAndNumDoc', response)

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
