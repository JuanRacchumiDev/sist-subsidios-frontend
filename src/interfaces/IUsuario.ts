import { Colaborador } from "./IColaborador"
import { Perfil } from "./IPerfil"
import { TrabajadorSocial } from "./ITrabajadorSocial"

export interface Usuario {
    id?: string
    id_perfil?: string
    id_colaborador?: string
    id_trabajadorsocial?: string
    username?: string
    email?: string
    password?: string
    sistema?: boolean
    estado?: boolean
    perfil?: Perfil
    colaborador?: Colaborador
    trabajadorSocial?: TrabajadorSocial
}

export interface UsuarioResponse {
    result: boolean
    message?: string
    data?: Usuario | Usuario[]
    error?: string
    status?: number
}