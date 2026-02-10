export interface UserAuthenticated {
    id_usuario?: string
    id_empresa?: string;
    id_persona?: string;
    username?: string;
    nombre_perfil?: string;
    nombre_perfil_url?: string;
    nombre_completo?: string;
    email_institucional?: string
    email_personal?: string
}

export interface AuthData {
    usuario: UserAuthenticated,
    codigo_temp?: string
}