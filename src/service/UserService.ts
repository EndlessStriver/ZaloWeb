import axios from "axios";
import User from "../interface/master-data/User";

const getFriendsAndMessageContacts = async (friendName: string): Promise<User[]> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/users/friends?friendName=${friendName}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const getByPhoneNumber = async (phoneNumber: string): Promise<User | null> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/users/phone?phoneNumber=${phoneNumber}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

export { getFriendsAndMessageContacts, getByPhoneNumber }