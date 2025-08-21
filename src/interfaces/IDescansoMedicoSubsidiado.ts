export interface DescansoMedicoSubsidiado {
    id?: string
    codigoDescansoMedico?: string
    idDescansoMedico?: string
    idEmpresa?: string
    idColaborador?: string
    idTipoDescansoMedico?: string
    idTipoContingencia?: string
    fechaInicioDescansoMedico?: string
    fechaRegistro?: string
    fechaInicio?: string
    fechaFinal?: string
    fechaMaximaCanje?: string,
    totalDias?: string
    numeroDocumento?: string
    empresaName?: string
    colaboradorName?: string
    tipoDescansoMedicoName?: string
    tipoContingenciaName?: string
    estado?: string,
    esCanjeable?: boolean
}

export interface DescansoMedicoSubsidiadoResponse {
    result: boolean
    message?: string
    data?: DescansoMedicoSubsidiado | DescansoMedicoSubsidiado[]
    error?: string
    status?: number
}