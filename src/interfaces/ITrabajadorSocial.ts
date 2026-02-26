import { Cargo } from "./ICargo"
import { TipoDocumento } from "./ITipoDocumento"
import { Empresa } from "./IEmpresa"
import { Area } from "./IArea"
import { Sede } from "./ISede"
import { Pais } from "./IPais"

export interface TrabajadorSocial {
    id?: string
    id_tipodocumento?: string
    id_cargo?: string
    id_empresa?: string
    id_area?: string
    id_sede?: string
    id_pais?: string
    numero_documento?: string
    apellido_paterno?: string
    apellido_materno?: string
    nombres?: string
    nombre_completo?: string
    nombre_area?: string
    nombre_sede?: string
    nombre_pais?: string
    correo_institucional?: string
    correo_personal?: string
    numero_celular?: string
    foto?: string
    fecha_nacimiento?: string
    fecha_ingreso?: string
    fecha_salida?: string
    es_representante_legal?: boolean
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    tipoDocumento?: TipoDocumento
    cargo?: Cargo
    empresa?: Empresa
    area?: Area
    sede?: Sede
    pais?: Pais
}

export interface TrabajadorSocialResponse {
    result?: boolean
    message?: string
    data?: TrabajadorSocial | TrabajadorSocial[]
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

export interface TrabajadorSocialPaginateResponse {
    result: boolean
    data?: TrabajadorSocial[]
    pagination?: Pagination
    errors?: string
    status?: number
}

export interface TrabajadorSocialFilter {
    id_tipodocumento?: string
    numero_documento?: string
    nombre_completo?: string
}