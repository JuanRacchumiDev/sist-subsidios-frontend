export interface Sede {
    id?: string
    nombre?: string
    nombre_url?: string
    sistema?: boolean
    estado?: boolean
}

export interface SedeResponse {
    result?: boolean
    message?: string
    data?: Sede | Sede[]
    error?: string
    status?: number
}