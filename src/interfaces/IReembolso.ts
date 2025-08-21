import { EstadoReembolso } from "../enums/EstadoRegistro"

export interface Reembolso {
    id?: string
    idCanje?: string
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
    fechaMaximaReembolso?: string
    fechaReembolso?: string
    codigo?: string
    numeroExpediente?: string
    empresaName?: string
    colaboradorName?: string
    tipoDescansoMedicoName?: string
    tipoContingenciaName?: string
    observacion?: string
    esCobrable?: boolean
    estadoRegistro?: EstadoReembolso
}

export interface ReembolsoResponse {
    result: boolean
    message?: string
    data?: Reembolso | Reembolso[]
    error?: string
    status?: number
}