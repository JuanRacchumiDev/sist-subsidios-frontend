export interface TipoEstablecimiento {
    id?: string
    nombre?: string
    nombre_url?: string
    sistema?: boolean
    estado?: boolean
}

export interface TipoEstablecimientoResponse {
    result?: boolean
    message?: string
    data?: TipoEstablecimiento[] | TipoEstablecimiento
    error?: string
    status?: number
}