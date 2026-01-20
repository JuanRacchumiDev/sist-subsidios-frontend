export interface Parametro {
    clase?: number
    nombre?: string
    nombre_url?: string
    descripcion?: string
    sistema?: boolean
    estado?: boolean
}

export interface ParametroResponse {
    result?: boolean
    message?: string
    data?: Parametro | Parametro[]
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

export interface ParametroPaginateResponse {
    result: boolean
    data?: Parametro[]
    pagination?: Pagination
    errors?: string
    status?: number
}

export interface ParametroFilter {
    nombre?: string
}