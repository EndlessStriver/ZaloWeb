import axios from "axios";
import Friendship from "../interface/master-data/FriendShip";

const getFriends = async (): Promise<Friendship[]> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/friendships`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const getReceivedFriendRequests = async (): Promise<Friendship[]> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/friendships/received-requests`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const getFriendTypeByPhoneNumber = async (phoneNumber: string): Promise<"NOT_FRIEND" | "FRIEND" | "REQUEST_SENT" | "REQUEST_RECEIVED" | "IS_YOU"> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/friendships/check-friendship?phoneNumber=${phoneNumber}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const addFriend = async (friendId: string): Promise<Friendship> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_ENDPOINT}/friendships?friendId=${friendId}`, null, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const cancelFriendShip = async (friendId: string): Promise<void> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.delete(`${API_ENDPOINT}/friendships?friendId=${friendId}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const acceptFriendShip = async (friendId: string): Promise<Friendship> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.patch(`${API_ENDPOINT}/friendships?friendId=${friendId}`, null, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

export { getFriends, getFriendTypeByPhoneNumber, addFriend, cancelFriendShip, acceptFriendShip, getReceivedFriendRequests }