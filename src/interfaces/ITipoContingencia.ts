import { DocumentoContingencia } from './IDocumentoTipoContingencia'

export interface TipoContingencia {
    id?: string
    nombre?: string
    nombre_url?: string,
    sistema?: boolean
    estado?: boolean
    documentoTipoCont?: DocumentoContingencia[]
}

export interface TipoContingenciaResponse {
    result?: boolean
    message?: string
    data?: TipoContingencia | TipoContingencia[]
    error?: string
    status?: number
}