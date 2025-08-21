import { TipoDocumento } from "./ITipoDocumento"

export interface Persona {
    id?: string
    id_tipodocumento?: number
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
    ubigeo_reniec?: string
    ubigeo_sunat?: string
    ubigeo?: string
    fecha_nacimiento?: string
    estado_civil?: string
    foto?: string
    sexo?: string
    origen?: string
    sistema?: boolean
    estado?: boolean
    tipoDocumento?: TipoDocumento
}

export interface PersonaResponse {
    result?: boolean
    message?: string
    data?: Persona | Persona[]
    error?: string
    status?: number
}