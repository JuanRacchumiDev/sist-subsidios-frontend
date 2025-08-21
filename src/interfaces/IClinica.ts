export interface Clinica {
    id?: string
    ruc?: string
    nombre?: string
    direccion?: string
    numeroContacto?: string
    departamento?: string
    provincia?: string
    distrito?: string
    estado?: boolean
}

export interface ClinicaResponse {
    result: boolean
    message?: string
    data?: Clinica | Clinica[]
    error?: string
    status?: number
}