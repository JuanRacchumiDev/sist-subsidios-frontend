import apiClient from "./apiClient";
import { token } from "../helpers/HToken"
import { EmpresaResponse } from "../interfaces/IEmpresa"

export const searchForRuc = async (ruc: string): Promise<EmpresaResponse> => {
    try {
        const urlApi = `${'/empresas/consulta-api?ruc='}${ruc}`

        const response = await apiClient.get(urlApi, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const { data: { data, status, result, message, error } } = response

        return {
            result,
            error,
            message,
            data,
            status
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}