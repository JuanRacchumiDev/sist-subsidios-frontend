import apiClient from "./apiClient";
import { token } from "../helpers/HToken"
import { PersonaResponse } from "../interfaces/IPersona"
import { getById as tipoDocumentoById } from './tipoDocumentoRepository'
import { TipoDocumento } from "../interfaces/ITipoDocumento";

export const searchForTipoDocAndNumDoc = async (idTipoDocumento: string, numeroDocumento: string): Promise<PersonaResponse> => {
    try {
        // Obteniendo tipo de documento
        const responseTipoDocumento = await tipoDocumentoById(idTipoDocumento)

        const { data, result, status, message } = responseTipoDocumento

        if (!result && status !== 200) {
            return {
                result,
                message,
                status
            }
        }

        const { abreviatura } = data as TipoDocumento

        const urlApi = `${'/personas/consulta-api?abreviatura='}${abreviatura}${'&numeroDocumento='}${numeroDocumento}`

        const responseApi = await apiClient.get(`${urlApi}`, {
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

