import { EstadoCanje } from "../enums/EstadoRegistro"

export interface Canje {
    id?: string
    idDescansoMedico?: string
    idEmpresa?: string
    idColaborador?: string
    idTipoDescansoMedico?: string
    idTipoContingencia?: string
    numeroDocumento?: string
    fechaInicioDescanso?: string
    fechaFinalDescanso?: string
    fechaInicioSubsidio?: string
    fechaFinalSubsidio?: string
    fechaMaximoCanje?: string
    fechaCanje?: string
    totalDias?: string
    codigo?: string
    codigoCitt?: string
    empresaName?: string
    colaboradorName?: string
    tipoDescansoMedicoName?: string
    tipoContingenciaName?: string
    observacion?: string
    esCanjeable?: boolean
    esReembolsable?: boolean
    estadoRegistro?: EstadoCanje
}

export interface CanjeResponse {
    result: boolean
    message?: string
    data?: Canje | Canje[]
    error?: string
    status?: number
}