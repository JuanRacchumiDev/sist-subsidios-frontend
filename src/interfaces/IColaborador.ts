import { Area } from "./IArea"
import { Cargo } from "./ICargo"
import { Empresa } from "./IEmpresa"
import { Pais } from "./IPais"
import { Parentesco } from "./IParentesco"
import { Sede } from "./ISede"
import { TipoDocumento } from "./ITipoDocumento"

export interface Colaborador {
    id?: string
    id_parentesco?: string
    id_tipodocumento?: string
    id_cargo?: string
    id_area?: string
    id_sede?: string
    id_pais?: string
    id_empresa?: string
    numero_documento?: string
    apellido_paterno?: string
    apellido_materno?: string
    nombres?: string
    nombre_completo?: string
    fecha_nacimiento?: string
    fecha_ingreso?: string
    fecha_salida?: string
    nombre_area?: string
    nombre_sede?: string
    nombre_pais?: string
    correo_institucional?: string
    correo_personal?: string
    numero_celular?: string
    contacto_emergencia?: string
    numero_celular_emergencia?: string
    foto?: string
    curriculum_vitae?: string
    is_asociado_sindicato?: boolean
    is_presenta_inconvenientes?: boolean
    sistema?: boolean
    estado?: boolean
    parentesco?: Parentesco
    tipoDocumento?: TipoDocumento
    cargo?: Cargo
    area?: Area
    sede?: Sede
    pais?: Pais
    empresa?: Empresa
}

export interface ColaboradorResponse {
    result?: boolean
    message?: string
    data?: Colaborador | Colaborador[]
    error?: string
    status?: number
}