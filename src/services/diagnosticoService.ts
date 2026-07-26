import {
    getAll,
    getAllWithPaginate,
    getByCodigo,
    create,
    update,
    updateEstado
} from '../repositories/diagnosticoRepository'

export const getDiagnosticos = async () => {
    const response = await getAll()

    return {
        ...response
    }
}

export const getDiagnosticosWithPaginate = async (
    page: number,
    limit: number,
    filter: string
) => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        filter: filter
    }).toString()

    const response = await getAllWithPaginate(queryParams)

    return {
        ...response
    }
}

export const getDiagnosticoByCodigo = async (codigo: string) => {
    const response = await getByCodigo(codigo)

    return {
        ...response
    }
}

export const createDiagnostico = async (payload: Diagnostico) => {
    const response = await create(payload)

    return {
        ...response
    }
}

export const updateDiagnostico = async (id: string, payload: Diagnostico) => {
    const response = await update(id, payload)

    return {
        ...response
    }
}

export const updateDiagnosticoByEstado = async (id: string, payload: Diagnostico) => {
    const response = await updateEstado(id, payload)

    return {
        ...response
    }
}