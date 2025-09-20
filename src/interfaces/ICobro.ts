import { ECobro } from "../enums/ECobro";
import { Reembolso } from "./IReembolso";

export interface Cobro {
    id?: string
    id_reembolso?: string
    codigo?: string
    codigo_cheque?: string
    codigo_voucher?: string
    fecha_cobro?: string
    fecha_maxima_cobro?: string
    observacion?: string
    estado_registro?: ECobro
    reembolso?: Reembolso
}

export interface CobroResponse {
    result: boolean
    message?: string
    data?: Cobro | Cobro[]
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

export interface CobroPaginateResponse {
    result: boolean
    data?: Cobro[]
    pagination?: Pagination
    errors?: string
    status?: number
}