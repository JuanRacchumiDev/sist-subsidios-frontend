import { Canje } from "./ICanje"
import { Cobro } from "./ICobro"
import { Colaborador } from "./IColaborador"
import { DescansoMedico } from "./IDescansoMedico"
import { Reembolso } from "./IReembolso"
import { TipoAdjunto } from "./ITipoAdjunto"
import { TrabajadorSocial } from "./ITrabajadorSocial"
import { DocumentoContingencia } from "./IDocumentoContingencia"

export interface Adjunto {
    id?: string
    id_tipoadjunto?: string
    id_descansomedico?: string
    id_canje?: string
    id_cobro?: string
    id_reembolso?: string
    id_colaborador?: string
    id_trabajadorsocial?: string
    id_documento?: string
    file_name?: string
    file_type?: string
    file_data?: string
    file_path?: string
    codigo_temp?: string
    sistema?: boolean
    estado?: boolean
    tipoAdjunto?: TipoAdjunto
    descansoMedico?: DescansoMedico
    canje?: Canje
    cobro?: Cobro
    reembolso?: Reembolso
    colaborador?: Colaborador
    trabajadorSocial?: TrabajadorSocial
    documento?: DocumentoContingencia
}

export interface AdjuntoResponse {
    result: boolean
    message?: string
    data?: Adjunto | Adjunto[]
    error?: string
    status?: number
}