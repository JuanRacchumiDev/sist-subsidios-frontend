export interface RepresentanteLegal {
    id?: string
    id_tipodocumento?: string
    idCargo?: string
    numero?: string
    apellido_paterno?: string
    apellido_materno?: string
    nombres?: string
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
    codigo_verificacion?: number
    direccion_fiscal?: string
    partida_registral?: string
    nombreTipoDocumento?: string
    cargoName?: string
    telefono?: string
    correo?: string
    ospe?: string
}

export interface RepresentanteLegalResponse {
    result: boolean
    message?: string
    data?: RepresentanteLegal | RepresentanteLegal[]
    error?: string
    status?: number
}