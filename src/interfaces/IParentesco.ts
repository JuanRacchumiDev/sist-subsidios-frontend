export interface Parentesco {
    id?: string
    nombre?: string
    nombre_url?: string
    sistema?: boolean
    estado?: boolean
}

export interface ParentescoResponse {
    result?: boolean
    message?: string
    data?: Parentesco | Parentesco[]
    error?: string
    status?: number
}