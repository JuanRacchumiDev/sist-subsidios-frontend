import { Empresa } from "./IEmpresa"
import { Detalle } from "./IDetalleParametro"

export interface Persona {
    id?: string
    id_tipodocumento?: string
    id_empresa?: string
    id_cargo?: string
    id_sede?: string
    id_pais?: string
    numero_documento?: string
    nombres?: string
    apellido_paterno?: string
    apellido_materno?: string
    nombre_completo?: string
    departamento?: string
    provincia?: string
    distrito?: string
    direccion?: string
    direccion_completa?: string
    email_personal?: string
    email_institucional?: string
    telefono?: string
    ubigeo_reniec?: string
    ubigeo_sunat?: string
    ubigeo?: string
    direccion_fiscal?: string
    partida_registral?: string
    ospe?: string
    fecha_nacimiento?: string
    fecha_ingreso?: string
    fecha_salida?: string
    nombre_area?: string
    nombre_sede?: string
    nombre_pais?: string
    estado_civil?: string
    foto?: string
    sexo?: string
    origen?: string
    is_asociado_sindicato?: boolean
    is_tiene_inconvenientes?: boolean
    is_representante_legal?: boolean
    sistema?: boolean
    estado?: boolean
    nombre_grupo?: string
    abreviatura?: string
    nombre_cargo?: string
    nombre_o_razon_social?: string
    tipoDocumento?: Detalle
    empresa?: Empresa
    cargo?: Detalle
    sede?: Detalle
    pais?: Detalle
}

export interface PersonaResponse {
    result?: boolean
    message?: string
    data?: Persona | Persona[]
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

export interface PersonaPaginateResponse {
    result: boolean
    data?: Persona[]
    pagination?: Pagination
    errors?: string
    status?: number
}

export interface PersonaFilter {
    id_tipodocumento?: string
    id_empresa?: string
    numero_documento?: string
    nombre_completo?: string
    nombreGrupo?: string
}