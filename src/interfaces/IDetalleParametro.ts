import { Parametro } from "./IParametro"
import { DocumentoTipoContingencia } from './IDocumentoTipoContingencia'

export interface Detalle {
    id?: string
    parametro_clase?: number
    nombre?: string
    nombre_url?: string
    descripcion?: string
    valor?: string
    abreviatura?: string
    longitud?: number
    en_persona?: boolean
    en_empresa?: boolean
    compra?: boolean
    venta?: boolean
    visible?: boolean
    sistema?: boolean
    estado?: boolean
    parametro?: Parametro
    documentoTipoCont?: DocumentoTipoContingencia[]
}

export interface DetalleResponse {
    result?: boolean
    message?: string
    data?: Detalle | Detalle[]
    error?: string
    status?: number
}

export interface Pagination {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface DetallePaginateResponse {
    result: boolean
    data?: Detalle[]
    pagination?: Pagination
    errors?: string
    status?: number
}

export interface DetalleFilter {
    nombre?: string
}