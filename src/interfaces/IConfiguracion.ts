import { ETipoDato } from "@/enums/ETipoDato";

export interface Configuracion {
    id?: string;
    clave?: string;
    valor?: string;
    tipo_dato?: ETipoDato;
    criterio?: string;
    descripcion?: string;
    sistema?: boolean;
    estado?: boolean;
    user_crea?: string;
    user_actualiza?: string;
    user_elimina?: string;
    created_at?: string | Date;
    updated_at?: string | Date;
}

export interface ConfiguracionResponse {
    result: boolean
    message?: string
    data?: Configuracion | Configuracion[]
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

export interface ConfiguracionPaginateResponse {
    result: boolean
    data?: Configuracion[]
    pagination?: Pagination
    errors?: string
    status?: number
}