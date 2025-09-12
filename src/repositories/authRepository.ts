import apiClient from "./apiClient";

type ResponseAuth = {
    result?: boolean,
    message?: string,
    status?: number,
    error?: string
}

export const login = async (email: string, password: string): Promise<ResponseAuth> => {
    try {
        const credenciales: { email: string, password: string } = {
            email,
            password
        }

        console.log({ credenciales })

        const response = await apiClient.post('/auth/login', credenciales)

        console.log({ response })

        const { data: dataAuth, status: statusAuth } = response

        console.log({ dataAuth })

        const { message, result, usuario, status, token, codigo_temp, error } = dataAuth

        if (statusAuth === 200) {
            if (result && usuario) {
                localStorage.setItem('auth', JSON.stringify(
                    {
                        token,
                        usuario,
                        codigo_temp
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

export const logout = async (id: string): Promise<ResponseAuth> => {
    try {
        const response = await apiClient.post('/auth/logout', { id })
        const { data: { result, status, message, error } } = response
        if (result && status === 200) {
            localStorage.removeItem('auth')
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