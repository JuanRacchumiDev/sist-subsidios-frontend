import { login, logout } from '../repositories/authRepository'

export const loginAuth = async (email: string, password: string) => {
    const response = await login(email, password)

    return {
        ...response
    }
}

export const logoutAuth = async (id: string) => {
    const response = await logout(id)

    return {
        ...response
    }
}

// import apiClient from "./apiClient";

// export const login = async (username: string, password: string) => {
//     try {
//         const credentials: { username: string, password: string } = {
//             username,
//             password
//         }

//         const response = await apiClient.post('/auth/login', credentials)
//         console.log('response auth login - authService', response)

//         const { data: dataAuth } = response
//         const { result, message, token, usuario, status } = dataAuth

//         if (result && usuario) {
//             localStorage.setItem('auth', JSON.stringify(
//                 {
//                     token,
//                     usuario
//                 }
//             ))
//             return dataAuth
//         }
//     } catch (error) {
//         if (error.response) {
//             throw new Error(error.response.data.message || 'Error de inicio de sesión')
//         }
//         throw new Error('Error de conexión con el servidor')
//     }
// }

// export const logout = async (id: string) => {
//     try {
//         const response = await apiClient.post('/auth/logout', { id })
//         console.log('response logout', response)
//         const { data: dataLogout } = response
//         const { result, status } = dataLogout

//         if (result && status === 200) {
//             localStorage.removeItem('auth')
//             return dataLogout
//         }
//     } catch (error) {
//         if (error.response) {
//             throw new Error(error.response.data.message || 'Error al cerrar sesión')
//         }
//         throw new Error('Error de conexión con el servidor')
//     }
// }