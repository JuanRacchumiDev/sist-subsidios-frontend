import { TCodigoTemp } from "../types/TCodigoTemp";
import { TAuthResponse } from "../types/TAuthResponse";
import apiClient from "./apiClient";

export const login = async (email: string, password: string): Promise<TAuthResponse> => {
    try {
        const credenciales: { email: string, password: string } = {
            email,
            password
        }

        // console.log({ credenciales })

        const response = await apiClient.post('/auth/login', credenciales)

        // console.log({ response })

        const { data: dataAuth, status: statusAuth } = response

        // console.log({ dataAuth })

        const { message, result, usuario, status, token, error } = dataAuth

        if (statusAuth === 200) {
            if (result && usuario) {
                localStorage.setItem('auth', JSON.stringify(
                    {
                        token,
                        usuario
                    }
                ))
            }

            return {
                result,
                message,
                status,
                error
            }
        }

        return {
            result: false,
            status: statusAuth,
            message: message || "Error al iniciar sesión"
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error de inicio de sesión'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const logout = async (id: string): Promise<TAuthResponse> => {
    try {
        const response = await apiClient.post('/auth/logout', { id })
        const { data: { result, status, message, error } } = response
        if (result && status === 200) {
            localStorage.removeItem('auth')
            localStorage.removeItem('codigo_temp')
            return {
                result,
                status,
                message,
                error
            }
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error de inicio de sesión'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}

export const createCodigoTemp = async (): Promise<TCodigoTemp> => {
    try {
        const response = await apiClient.get('/auth/create-codigo-temp')

        console.log('response createCodigoTemp', response)

        const { data: dataCodigoTemp, status: statusCodigoTemp } = response

        const { result, codigo_temp, error, status } = dataCodigoTemp

        if (statusCodigoTemp === 200) {
            if (result && codigo_temp !== "") {
                localStorage.setItem('codigo_temp', codigo_temp)
            }

            return {
                result,
                codigo_temp,
                status,
                error
            }
        }

        return {
            result: false,
            codigo_temp,
            status: statusCodigoTemp,
            error
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error de inicio de sesión'
        console.log('errorMessage', errorMessage)
        return { result: false, error: errorMessage, status: 500 }
    }
}