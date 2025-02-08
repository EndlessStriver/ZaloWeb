import axios from "axios";
import User from "../interface/master-data/User";
import { UpdateProfileVerifyProps } from "../interface/api/UserService";

const getFriendsAndMessageContacts = async (friendName: string): Promise<User[]> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/users/contacts?friendName=${friendName}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const getUserByPhoneNumber = async (phoneNumber: string): Promise<User | null> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/users/search-by-phone?phoneNumber=${phoneNumber}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const updateProfileVerify = async (profile: UpdateProfileVerifyProps): Promise<User> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.patch(`${API_ENDPOINT}/users/profile`, profile, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

export { getFriendsAndMessageContacts, getUserByPhoneNumber, updateProfileVerify }