import { TipoContingencia } from "./ITipoContingencia"

export interface DocumentoContingencia {
    id?: string
    id_tipocontingencia?: string
    nombre?: string
    nombre_url?: string
    sistema?: boolean
    estado?: boolean
    tipoContingencia?: TipoContingencia
}

export interface DocumentoContingenciaResponse {
    result: boolean
    message?: string
    data?: DocumentoContingencia | DocumentoContingencia[]
    error?: string
    status?: number
}