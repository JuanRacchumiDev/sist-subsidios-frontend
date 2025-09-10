import { Colaborador } from "./IColaborador"
import { Perfil } from "./IPerfil"
import { Persona } from "./IPersona"
import { TrabajadorSocial } from "./ITrabajadorSocial"

export interface Usuario {
    id?: string
    id_perfil?: string
    id_persona?: string
    id_colaborador?: string
    id_trabajadorsocial?: string
    username?: string
    email?: string
    password?: string
    sistema?: boolean
    estado?: boolean
    perfil?: Perfil
    persona?: Persona
    colaborador?: Colaborador
    trabajadorSocial?: TrabajadorSocial
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