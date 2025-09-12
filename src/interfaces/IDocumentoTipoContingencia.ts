import { TipoContingencia } from "./ITipoContingencia"

export interface DocumentoTipoContingencia {
    id?: string
    id_tipocontingencia?: string
    nombre?: string
    nombre_url?: string
    sistema?: boolean
    estado?: boolean
    tipoContingencia?: TipoContingencia
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