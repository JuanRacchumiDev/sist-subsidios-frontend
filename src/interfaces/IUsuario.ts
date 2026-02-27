import { Perfil } from "./IPerfil"
import { Persona } from "./IPersona"

export interface Usuario {
    id?: string
    id_perfil?: string
    id_persona?: string
    id_colaborador?: string
    id_trabajadorsocial?: string
    username?: string
    email?: string
    password?: string
    nombre_persona?: string
    nombre_completo?: string
    nombres?: string
    apellido_paterno?: string
    apellido_materno?: string
    nombre_perfil?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    perfil?: Perfil
    persona?: Persona
}

export interface UsuarioResponse {
    result?: boolean
    message?: string
    data?: Usuario | Usuario[]
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

export interface UsuarioPaginateResponse {
    result: boolean
    data?: Usuario[]
    pagination?: Pagination
    errors?: string
    status?: number
}

export interface UsuarioFilter {
    id_perfil?: string
    nombre_persona?: string
    username?: string
    email?: string
}