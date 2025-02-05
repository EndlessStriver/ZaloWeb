import axios from "axios";
import ChatRoom from "../interface/master-data/ChatRoom";

const getMyChatRooms = async (): Promise<ChatRoom[]> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/chatrooms`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const getChatRoomsByRoomNameAndUserId = async (roomName: string): Promise<ChatRoom[]> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/chatrooms/search?roomName=${roomName}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const getChatRoomForUsers = async (friendId: string): Promise<ChatRoom | null> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_ENDPOINT}/chatrooms/between-users?friendId=${friendId}`, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

const createSingleChatRoom = async (friendId: string): Promise<ChatRoom> => {
    const API_ENDPOINT = import.meta.env.VITE_API_API_ENDPOINT;
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_ENDPOINT}/chatrooms/create-single?friendId=${friendId}`, null, { headers: { Authorization: `Bearer ${accessToken}` } })
    return response.data.data
}

export { getMyChatRooms, getChatRoomsByRoomNameAndUserId, getChatRoomForUsers, createSingleChatRoom }