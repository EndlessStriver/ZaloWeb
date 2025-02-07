import axios from "axios"
import Account from "../interface/master-data/Account"
import { RefreshToken, RegisterRequest } from "../interface/api/AuthService";

const LoginApi = async (username: string, password: string): Promise<Account> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const response = await axios.post(`${API_ENDPOINT}/auth/login`, { username, password }, { withCredentials: true })
    return response.data.data
}

const LogoutApi = async (): Promise<void> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    await axios.get(`${API_ENDPOINT}/auth/logout`, { withCredentials: true, headers: { Authorization: `Bearer ${accessToken}` } })
}

const registerApi = async (formData: RegisterRequest): Promise<Account> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const response = await axios.post(`${API_ENDPOINT}/auth/register`, formData)
    return response.data.data
}

const sendOtpAPI = async (email: string): Promise<void> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    await axios.post(`${API_ENDPOINT}/auth/send-otp`, { email }, { headers: { Authorization: `Bearer ${accessToken}` } })
}

const RefreshTokenApi = async (): Promise<RefreshToken> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const response = await axios.get(`${API_ENDPOINT}/auth/refresh-token`, { withCredentials: true })
    return response.data.data
}

export { LoginApi, RefreshTokenApi, LogoutApi, registerApi, sendOtpAPI }