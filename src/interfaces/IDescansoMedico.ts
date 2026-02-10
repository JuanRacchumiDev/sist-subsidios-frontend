import { EDescansoMedico } from "../enums/EDescansoMedico"
import { Adjunto } from "./IAdjunto"
// import { Colaborador } from "./IColaborador"
import { Diagnostico } from "./IDiagnostico"
import { Detalle } from "./IDetalleParametro"
import { Persona } from "./IPersona"
import { Empresa } from "./IEmpresa"
// import { TipoContingencia } from "./ITipoContingencia"
// import { TipoDescansoMedico } from "./ITipoDescansoMedico"

export interface DescansoMedico {
    id?: string
    id_empresa?: string
    id_colaborador?: string
    id_tipodescansomedico?: string
    id_tipocontingencia?: string
    codcie10_diagnostico?: string
    correlativo?: number
    codigo?: string
    codigo_citt?: string
    fecha_inicio_ingresado?: string
    fecha_final_ingresado?: string
    fecha_otorgamiento?: string
    fecha_inicio?: string
    fecha_final?: string
    fecha_registro?: string
    fecha_actualiza?: string
    fecha_elimina?: string
    fecha_maxima_subsanar?: string
    dia_fecha_inicio?: number
    mes_fecha_inicio?: number
    anio_fecha_inicio?: number
    dia_fecha_final?: number
    mes_fecha_final?: number
    anio_fecha_final?: number
    mes_devengado?: string
    numero_colegiatura?: string
    medico_tratante?: string
    nombre_colaborador?: string
    nombre_tipodescansomedico?: string
    nombre_tipocontingencia?: string
    nombre_diagnostico?: string
    nombre_establecimiento?: string
    observacion?: string
    total_dias?: number
    is_subsidio?: boolean
    is_acepta_responsabilidad?: boolean
    is_acepta_politica?: boolean
    is_continuo?: boolean
    estado_registro?: EDescansoMedico,
    sistema?: boolean
    estado?: boolean
    codigo_temp?: string
    empresa?: Empresa
    colaborador_dm?: Persona
    tipoDescansoMedico?: Detalle
    tipoContingencia?: Detalle
    diagnostico?: Diagnostico
    adjuntos?: Adjunto
    id_usuario?: string
    nombre_perfil_url?: string
}

export interface DescansoMedicoResponse {
    result: boolean
    message?: string
    data?: DescansoMedico | DescansoMedico[]
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

export interface DescansoMedicoPaginateResponse {
    result: boolean
    data?: DescansoMedico[]
    pagination?: Pagination
    errors?: string
    status?: number
}

export interface DescansoMedicoFilter {
    id_colaborador?: string
    id_tipodescansomedico?: string
    id_tipocontingencia?: string
    id_empresa?: string
    nombre_colaborador?: string
    fecha_inicio?: string
    fecha_final?: string
    user_crea?: string
}