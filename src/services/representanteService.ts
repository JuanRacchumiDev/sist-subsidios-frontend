import { RepresentanteLegal, RepresentanteLegalResponse } from '@/interfaces/IRepresentanteLegal';
import {
    getAll,
    getById,
    create,
    update
} from "@/repositories/representanteRepository"

export const getRepresentantes = async () => {
    const response = await getAll();

    return {
        ...response
    }
}

export const getRepresentanteById = async (id: string): Promise<RepresentanteLegalResponse> => {
    try {
        const response = await getById(id)

        return {
            ...response
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const createRepresentante = async (payload: RepresentanteLegal) => {
    try {
        const response = await create(payload)

        return {
            ...response
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const updateRepresentante = async (id: string, payload: Cargo) => {
    try {
        const response = await update(id, payload)

        return {
            ...response
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}