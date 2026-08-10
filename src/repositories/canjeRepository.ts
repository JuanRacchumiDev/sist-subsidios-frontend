import { Canje, CanjeResponse, OutputType, ReportType } from "../interfaces/ICanje"
import apiClient from "./apiClient"

export const getAll = async (): Promise<CanjeResponse> => {
    try {
        const response = await apiClient.get('/canjes')

        const { data: dataCanjes } = response

        const { result, data, message, status, error } = dataCanjes

        return {
            result,
            data,
            message,
            status,
            error
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, data: [], error: errorMessage, status: 500 }
    }
}

export const getAllPaginate = async (queryParams: string) => {
    try {
        const urlApi = `${'/canjes/paginate?'}${queryParams}`

        const response = await apiClient.get(urlApi)

        const { data: dataCanjes } = response

        const { result, data, pagination, status } = dataCanjes

        return {
            result,
            data,
            pagination,
            status
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const getAllForReports = async (
    outputType: OutputType,
    reportType: ReportType,
    limit: number,
    fechaInicio?: string,
    fechaFinal?: string
) => {
    try {
        const params = new URLSearchParams({
            type: reportType,
            limit: limit.toString(),
            output: outputType,
        });

        if (fechaInicio) params.append("fechaInicio", fechaInicio);
        if (fechaFinal) params.append("fechaFinal", fechaFinal);

        const response = await apiClient.get(`/canjes/reportes/subsidios?${params.toString()}`, {
            responseType: "blob",
        });

        return {
            result: true,
            data: response.data,
            status: response.status,
            message: "Reporte generado correctamente",
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        return { result: false, error: errorMessage, status: 500 };
    }
};

export const getById = async (id: string): Promise<CanjeResponse> => {
    try {
        const urlApi = `${'/canjes/'}${id}`

        const response = await apiClient.get(urlApi)

        const { data: { result, data, message, error, status } } = response

        return {
            result,
            data,
            message,
            error,
            status
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, data: [], error: errorMessage, status: 500 }
    }
}

export const create = async (payload: Canje): Promise<CanjeResponse> => {
    try {
        const response = await apiClient.post('/canjes', payload)

        const { data: { result, message, status } } = response

        return {
            result,
            message,
            status
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, data: [], error: errorMessage, status: 500 }
    }
}

export const update = async (id: string, payload: Canje): Promise<CanjeResponse> => {
    try {
        const urlApi = `${'/canjes/'}${id}`

        const response = await apiClient.patch(urlApi, payload)

        const { data: { result, data, message, error, status } } = response

        return {
            result,
            data,
            message,
            error,
            status
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        console.log('errorMessage', errorMessage)
        return { result: false, data: [], error: errorMessage, status: 500 }
    }
}