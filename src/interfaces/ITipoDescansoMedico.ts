export interface TipoDescansoMedico {
    id?: string
    nombre?: string
    nombre_url?: string
    sistema?: boolean
    estado?: boolean
}

export interface TipoDescansoMedicoResponse {
    result?: boolean
    message?: string
    data?: TipoDescansoMedico | TipoDescansoMedico[],
    error?: string
    status?: number
}