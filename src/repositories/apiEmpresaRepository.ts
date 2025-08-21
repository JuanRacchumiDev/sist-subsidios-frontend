import apiClient from "./apiClient";
import { token } from "../helpers/HToken"
import { Empresa, EmpresaResponse } from "../interfaces/IEmpresa"
import { create } from "./empresaRepository"

export const searchForRuc = async (ruc: string): Promise<EmpresaResponse> => {
    try {
        // const urlApi = `${API_RUC}{ruc}`
        const urlApi = `${'/ruc/'}${ruc}`

        const response = await apiClient.get(`${urlApi}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const { data: dataApi } = response

        const { success, data } = dataApi

        if (success && data) {
            const {
                numero,
                nombre_o_razon_social,
                tipo_contribuyente,
                estado,
                condicion,
                departamento,
                provincia,
                distrito,
                direccion,
                direccion_completa,
                ubigeo_sunat,
                es_agente_de_retencion
            } = data

            const empresa: Empresa = {
                numero,
                nombre_o_razon_social,
                tipo_contribuyente,
                estadoSunat: estado,
                condicionSunat: condicion,
                departamento,
                provincia,
                distrito,
                direccion,
                direccion_completa,
                ubigeo_sunat,
                es_agente_de_retencion
            }

            const response = await create(empresa)
            // console.log('responseEmpresa', responseEmpresa)

            const {
                result,
                data: dataEmpresa,
                status: statusEmpresa,
                message
            } = response as EmpresaResponse

            return {
                result,
                data: dataEmpresa,
                message,
                status: statusEmpresa
            }
        } else {
            return {
                result: false,
                message: "Error al obtener datos de la empresa",
                status: 500
            }
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}