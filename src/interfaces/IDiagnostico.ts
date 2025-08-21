export interface Diagnostico {
    codCie10?: string
    nombre?: string
    nombre_url?: string
    tiempo?: number
    sexo?: string
    sistema?: boolean
    estado?: boolean
}

export interface DiagnosticoResponse {
    result: boolean
    message?: string
    data?: Diagnostico | Diagnostico[]
    error?: string
    status?: number
}