import axios from "axios"
import Account from "../interface/Account"

const Login = async (username: string, password: string): Promise<Account> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const response = await axios.post(`${API_ENDPOINT}/auth/login`, { username, password }, { withCredentials: true })
    return response.data.data
}

export { Login }