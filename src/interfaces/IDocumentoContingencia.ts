export interface DocumentoContingencia {
    id?: string
    label?: string
}

export interface DocumentoContingenciaResponse {
    result: boolean
    message?: string
    data?: DocumentoContingencia | DocumentoContingencia[]
    error?: string
    status?: number
}