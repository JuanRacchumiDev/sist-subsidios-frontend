export interface Trabajador {
    id?: string
    idEmpresa?: string
    idCargo?: string
    documentType?: string
    documentNumber?: string
    firstName?: string
    lastName?: string
    empresaName?: string
    cargoName?: string
    documentName?: string
    sistema?: boolean
    estado?: boolean
}

export interface TrabajadorResponse {
    result: boolean
    message?: string
    data?: Trabajador | Trabajador[]
    error?: string
    status?: number
}