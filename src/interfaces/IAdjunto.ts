import { Canje } from "./ICanje"
import { Cobro } from "./ICobro"
import { DescansoMedico } from "./IDescansoMedico"
import { Reembolso } from "./IReembolso"
import { TipoAdjunto } from "./ITipoAdjunto"
import { DocumentoTipoContingencia } from "./IDocumentoTipoContingencia"
import { Persona } from "./IPersona"

export interface Adjunto {
    id?: string
    id_tipoadjunto?: string
    id_descansomedico?: string
    id_canje?: string
    id_cobro?: string
    id_reembolso?: string
    id_persona?: string
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
    persona?: Persona
    documentoTipoContingencia?: DocumentoTipoContingencia
}

export interface AdjuntoResponse {
    result: boolean
    message?: string
    data?: Adjunto | Adjunto[]
    error?: string
    status?: number
}