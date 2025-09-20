export interface TipoAdjunto {
    id?: string
    nombre?: string
    extensiones?: string
    sistema?: boolean
    estado?: boolean
}

export interface TipoAdjuntoResponse {
    result?: boolean
    message?: string
    data?: TipoAdjunto | TipoAdjunto[]
    error?: string
    status?: number
}