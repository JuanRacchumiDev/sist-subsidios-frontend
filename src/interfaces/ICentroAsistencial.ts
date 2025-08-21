export interface CentroAsistencial {
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

export interface CentroAsistencialResponse {
    result: boolean
    message?: string
    data?: CentroAsistencial | CentroAsistencial[]
    error?: string
    status?: number
}