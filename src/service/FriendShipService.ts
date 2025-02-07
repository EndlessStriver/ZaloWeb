import axios from "axios";
import Friendship from "../interface/master-data/FriendShip";

const getFriendList = async (): Promise<Friendship[]> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/friendships/list`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const getReceivedFriendRequests = async (): Promise<Friendship[]> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/friendships/requests/received`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const checkFriendshipByFriendId = async (friendId: string): Promise<"NOT_FRIEND" | "FRIEND" | "REQUEST_SENT" | "REQUEST_RECEIVED" | "IS_YOU"> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/friendships/check?friendId=${friendId}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    console.log(response.data)
    return response.data.data
}

const sendFriendRequest = async (friendId: string): Promise<Friendship> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_ENDPOINT}/friendships/request?friendId=${friendId}`, null, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const cancelFriendship = async (friendId: string): Promise<void> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.delete(`${API_ENDPOINT}/friendships/remove?friendId=${friendId}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const acceptFriendRequest = async (friendId: string): Promise<Friendship> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.patch(`${API_ENDPOINT}/friendships/accept?friendId=${friendId}`, null, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

export { getFriendList, getReceivedFriendRequests, checkFriendshipByFriendId, sendFriendRequest, cancelFriendship, acceptFriendRequest }