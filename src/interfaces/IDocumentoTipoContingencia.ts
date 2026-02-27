import { Parametro } from "./IParametro"

export interface DocumentoTipoContingencia {
    id?: string
    id_tipocontingencia?: string
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    tipoContingencia?: Parametro
}

export interface DocumentoTipoContingenciaResponse {
    result: boolean
    message?: string
    data?: DocumentoTipoContingencia | DocumentoTipoContingencia[]
    error?: string
    status?: number
}

export interface Pagination {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface DocumentoTipoContingenciaPaginateResponse {
    result: boolean
    data?: DocumentoTipoContingencia[]
    pagination?: Pagination
    errors?: string
    status?: number
}

export interface DocumentoTipoContingenciaFilter {
    id_tipocontingencia?: string
    nombre?: string
}