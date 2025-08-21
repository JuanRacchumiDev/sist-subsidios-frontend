export interface Pais {
    id?: string
    nombre?: string
    nombre_url?: string
    codigo_postal?: string
    sistema?: boolean
    estado?: boolean
}

export interface PaisResponse {
    result?: boolean
    message?: string
    data?: Pais | Pais[]
    error?: string
    status?: number
}