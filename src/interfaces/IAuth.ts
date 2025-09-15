export interface UserAuthenticated {
    id_usuario?: string
    id_colaborador?: string;
    id_empresa?: string;
    nombre_completo?: string;
    nombre_perfil?: string;
    slug_perfil?: string;
}

export interface AuthData {
    usuario: UserAuthenticated,
    codigo_temp?: string
}