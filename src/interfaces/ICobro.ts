import { EstadoCobro } from "../enums/EstadoRegistro";

export interface Cobro {
    id?: string
    idCanje?: string
    idReembolso?: string
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
    fechaMaximaCobro?: string
    fechaCobro?: string
    codigoVoucher?: string
    codigoCheque?: string
    numeroExpediente?: string
    empresaName?: string
    colaboradorName?: string
    tipoDescansoMedicoName?: string
    tipoContingenciaName?: string
    observacion?: string
    estadoRegistro?: EstadoCobro
}

export interface CobroResponse {
    result: boolean
    message?: string
    data?: Cobro | Cobro[]
    error?: string
    status?: number
}