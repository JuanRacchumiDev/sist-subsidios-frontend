import { Cargo } from "./ICargo"
import { Empresa } from "./IEmpresa"
import { TipoDocumento } from "./ITipoDocumento"

export interface RepresentanteLegal {
    id?: string
    id_tipodocumento?: string
    id_empresa?: string
    id_cargo?: string
    numero_documento?: string
    nombres?: string
    apellido_paterno?: string
    apellido_materno?: string
    direccion_fiscal?: string
    partida_registral?: string
    cargoName?: string
    telefono?: string
    correo?: string
    ospe?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    tipoDocumento?: TipoDocumento
    empresa?: Empresa
    cargo?: Cargo
}

export interface RepresentanteLegalResponse {
    result: boolean
    message?: string
    data?: RepresentanteLegal | RepresentanteLegal[]
    error?: string
    status?: number
}