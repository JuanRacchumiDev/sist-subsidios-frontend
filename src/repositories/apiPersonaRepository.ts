import apiClient from "./apiClient";
import { token } from "../helpers/HToken"
import { PersonaResponse } from "../interfaces/IPersona"
import { getById as tipoDocumentoById } from './tipoDocumentoRepository'
import { TipoDocumento, TipoDocumentoResponse } from "../interfaces/ITipoDocumento";

export const searchForTipoDocAndNumDoc = async (idTipoDocumento: string, numeroDocumento: string): Promise<PersonaResponse> => {
    try {
        // Obteniendo tipo de documento
        const responseTipoDocumento = await tipoDocumentoById(idTipoDocumento)
        console.log('responseTipoDocumento', responseTipoDocumento)
        const { data: dataResponseTipoDocumento } = responseTipoDocumento
        const { result, data, message, status } = dataResponseTipoDocumento as TipoDocumentoResponse

        if (status !== 200 || !data) {
            return {
                result,
                message,
                status
            }
        }

        const { abreviatura } = data as TipoDocumento

        const urlApi = `${'/personas/consulta-api?abreviatura='}${abreviatura}${'&numeroDocumento='}${numeroDocumento}`

        console.log('urlApiPersona', urlApi)

        const responseApi = await apiClient.get(`${urlApi}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log('responseApiPersona apiPersonaRepository', responseApi)

        const { data: dataApi } = responseApi

        const { result: resultPersona, data: dataPersona } = dataApi

        return {
            ...dataApi
        }

        // if (resultPersona && dataPersona) {
        //     return {
        //         ...dataApi
        //     }
        // }

        // return {
        //     result: false,
        //     message: "Datos de la persona no fueron encontrados",
        //     status: 404
        // }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}

