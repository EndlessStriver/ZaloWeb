import axios from "axios";
import Friendship from "../interface/master-data/FriendShip";

const getFriends = async (): Promise<Friendship[]> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/friendships`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

export { getFriends }