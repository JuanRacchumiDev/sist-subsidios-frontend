import {
    getAll,
    getByCodigo
} from '../repositories/diagnosticoRepository'

export const getDiagnosticos = async () => {
    const response = await getAll()

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