import apiClient from "./apiClient";
import { token } from "../helpers/HToken"
import { EmpresaResponse } from "../interfaces/IEmpresa"

export const searchForRuc = async (ruc: string): Promise<EmpresaResponse> => {
    try {
        const urlApi = `${'/empresas/consulta-api?ruc='}${ruc}`

        const response = await apiClient.get(`${urlApi}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const { data: dataApi, status } = response

        const { result, data, message } = dataApi

        if (result && data) {
            return {
                result,
                data,
                message,
                status
            }
        }

        return {
            result: false,
            data: [],
            message: "Error al obtener datos de la empresa",
            status: 500
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}