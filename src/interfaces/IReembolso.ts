import { EReembolso } from "../enums/EReembolso"
import { Canje } from "./ICanje"
import { Colaborador } from "./IColaborador"

export interface Reembolso {
    id?: string
    id_canje?: string
    id_colaborador?: string
    correlativo?: string
    codigo?: string
    codigo_reembolso?: string
    numero_expediente?: string
    fecha_registro?: string
    fecha_reembolso?: string
    fecha_maxima_reembolso?: string
    fecha_maxima_subsanar?: string
    fecha_pago?: string
    is_cobrable?: boolean
    observacion?: string
    nombre_colaborador?: string
    user_crea?: string
    user_actualiza?: string
    estado_registro?: EReembolso
    canje?: Canje
    colaborador?: Colaborador
}

export interface ReembolsoResponse {
    result: boolean
    message?: string
    data?: Reembolso | Reembolso[]
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

export interface ReembolsoPaginateResponse {
    result: boolean
    data?: Reembolso[]
    pagination?: Pagination
    errors?: string
    status?: number
}

export interface ReembolsoFilter {
    id_canje?: string
    codigo?: string
    codigo_reembolso?: string
    numero_expediente?: string
    fecha_reembolso?: string
    fecha_maxima_reembolso?: string
    fecha_maxima_subsanar?: string
    fecha_pago?: string
}