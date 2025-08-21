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