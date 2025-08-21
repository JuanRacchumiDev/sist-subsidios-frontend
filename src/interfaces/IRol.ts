export interface Rol {
    id?: string
    nombre?: string
    nombre_url?: string
    sistema?: boolean
    estado?: boolean
}

export interface RolResponse {
    result: boolean
    message?: string
    data?: Rol | Rol[]
    error?: string
    status?: number
}