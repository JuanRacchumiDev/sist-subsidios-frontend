export interface TipoDocumento {
    id?: string
    nombre?: string
    nombre_url?: string
    abreviatura?: string
    longitud?: number
    en_persona?: boolean
    en_empresa?: boolean
    compra?: boolean
    venta?: boolean
    estado?: boolean
}

export interface TipoDocumentoResponse {
    result?: boolean
    message?: string
    data?: TipoDocumento[] | TipoDocumento
    error?: string
    status?: number
}