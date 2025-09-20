import { ECanje } from "../enums/ECanje"
import { DescansoMedico } from "./IDescansoMedico"

export interface Canje {
    id?: string
    id_descansomedico?: string
    correlativo?: number
    codigo?: string
    codigo_canje?: string
    codigo_citt?: string
    fecha_inicio_subsidio?: string
    fecha_final_subsidio?: string
    fecha_inicio_dm?: string
    fecha_final_dm?: string
    fecha_canje?: string
    fecha_maxima_canje?: string
    fecha_registro?: string
    fecha_actualiza?: string
    fecha_elimina?: string
    fecha_maxima_subsanar?: string
    dia_fecha_inicio_subsidio?: number
    mes_fecha_inicio_subsidio?: number
    anio_fecha_inicio_subsidio?: number
    dia_fecha_final_subsidio?: number
    mes_fecha_final_subsidio?: number
    anio_fecha_final_subsidio?: number
    is_reembolsable?: boolean
    observacion?: string
    mes_devengado?: string
    estado_registro?: ECanje
    descansoMedico?: DescansoMedico
}

export interface CanjeResponse {
    result: boolean
    message?: string
    data?: Canje | Canje[]
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

export interface CanjePaginateResponse {
    result: boolean
    data?: Canje[]
    pagination?: Pagination
    errors?: string
    status?: number
}