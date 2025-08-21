export interface Perfil {
    id?: string
    nombre?: string
    nombre_url?: string
    sistema?: boolean
    estado?: boolean
}

export interface PerfilResponse {
    result?: boolean
    message?: string
    data?: Perfil | Perfil[]
    error?: string
    status?: number
}