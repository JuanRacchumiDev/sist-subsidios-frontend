import apiClient from "./apiClient";
import { token } from "../helpers/HToken"
import { PersonaResponse } from "../interfaces/IPersona"
import { getById as tipoDocumentoById } from './detalleParametroRepository'
import { Detalle } from '../interfaces/IDetalleParametro'

export const searchForTipoDocAndNumDoc = async (idTipoDocumento: string, numeroDocumento: string): Promise<PersonaResponse> => {
    try {
        const responseTipoDocumento = await tipoDocumentoById(idTipoDocumento)

        const { data, result, status, message } = responseTipoDocumento

        if (!result && status !== 200) {
            return {
                result,
                message,
                status
            }
        }

        const { abreviatura } = data as Detalle

        const urlApi = `${'/personas/consulta-api?abreviatura='}${abreviatura}${'&numeroDocumento='}${numeroDocumento}`
        console.log({ urlApi })

        const responseApi = await apiClient.get(urlApi, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const { data: dataApi } = responseApi

        return {
            ...dataApi
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}

