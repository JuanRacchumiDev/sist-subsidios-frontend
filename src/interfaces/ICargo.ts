export interface Cargo {
    id?: string
    nombre?: string
    nombre_url?: string
    sistema?: boolean
    estado?: boolean
}

export interface CargoResponse {
    result?: boolean
    message?: string
    data?: Cargo | Cargo[]
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

export interface EmpresaPaginateResponse {
    result: boolean
    data?: Cargo[]
    pagination?: Pagination
    errors?: string
    status?: number
}