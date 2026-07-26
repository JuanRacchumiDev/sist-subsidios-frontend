export interface Diagnostico {
    codCie10?: string
    nombre?: string
    nombre_url?: string
    tiempo?: number
    sexo?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface DiagnosticoResponse {
    result: boolean
    message?: string
    data?: Diagnostico | Diagnostico[]
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

export interface DiagnosticoPaginateResponse {
    result: boolean
    data?: Diagnostico[]
    pagination?: Pagination
    errors?: string
    status?: number
}