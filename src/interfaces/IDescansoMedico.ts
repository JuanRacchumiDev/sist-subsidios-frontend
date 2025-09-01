import { EstadoDescansoMedico } from "../enums/EstadoRegistro"
import { Colaborador } from "./IColaborador"
import { Diagnostico } from "./IDiagnostico"
import { TipoContingencia } from "./ITipoContingencia"
import { TipoDescansoMedico } from "./ITipoDescansoMedico"
import { Establecimiento } from '../../../dms-backend-node/src/app/models/Establecimiento';

export interface DescansoMedico {
    id?: string
    id_colaborador?: string
    id_tipodescansomedico?: string
    id_tipocontingencia?: string
    codcie10_diagnostico?: string
    id_establecimiento?: string
    codigo?: string
    fecha_otorgamiento?: string
    fecha_inicio?: string
    fecha_final?: string
    fecha_registro?: string
    fecha_actualiza?: string
    fecha_elimina?: string
    fecha_maxima_subsanar?: string
    numero_colegiatura?: string
    medico_tratante?: string
    nombre_colaborador?: string
    nombre_tipodescansomedico?: string
    nombre_tipocontingencia?: string
    nombre_diagnostico?: string
    observacion?: string
    total_dias?: number
    is_subsidio?: boolean
    is_acepta_responsabilidad?: boolean
    is_acepta_politica?: boolean
    is_continuo?: boolean
    estado_registro?: EstadoDescansoMedico,
    sistema?: boolean
    estado?: boolean
    colaborador?: Colaborador
    tipoDescansoMedico?: TipoDescansoMedico
    tipoContingencia?: TipoContingencia
    diagnostico?: Diagnostico
    establecimiento?: Establecimiento
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

export interface EmpresaPaginateResponse {
    result: boolean
    data?: DescansoMedico[]
    pagination?: Pagination
    errors?: string
    status?: number
}