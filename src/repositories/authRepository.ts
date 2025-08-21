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

        console.log('credenciales', credenciales)

        const response = await apiClient.post('/auth/login', credenciales)

        const { data: { result, token, usuario, message, status, error } } = response

        if (result && usuario) {
            localStorage.setItem('auth', JSON.stringify(
                {
                    token,
                    usuario
                }
            ))

            return {
                result,
                message,
                status,
                error
            }
        }

    } catch (error) {
        // if (error.response) {
        //     throw new Error(error.response.data.message || 'Error de inicio de sesión')
        // }
        // throw new Error('Error de conexión con el servidor')
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