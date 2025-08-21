export interface Area {
    id?: string
    nombre?: string
    nombre_url?: string
    sistema?: boolean
    estado?: boolean
}

export interface AreaResponse {
    result?: boolean
    message?: string
    data?: Area | Area[]
    error?: string
    status?: number
}