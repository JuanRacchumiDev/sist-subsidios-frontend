// import { RepresentanteLegal } from './IRepresentanteLegal';

export interface Empresa {
    id?: string
    numero?: string
    nombre_o_razon_social?: string
    tipo_contribuyente?: string
    departamento?: string
    provincia?: string
    distrito?: string
    direccion?: string
    direccion_completa?: string
    ubigeo_sunat?: string
    estadoSunat?: string
    condicionSunat?: string
    es_agente_de_retencion?: boolean
    // representantes?: RepresentanteLegal[]
    estado?: boolean
}

export interface EmpresaResponse {
    result?: boolean
    message?: string
    data?: Empresa | Empresa[]
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

export interface EmpresaPaginateResponse {
    result: boolean
    data?: Empresa[]
    pagination?: Pagination
    errors?: string
    status?: number
}